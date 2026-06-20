import deleteImageService from "@/extensions/upload/delete-image";
import { db } from "./prisma";

const IMAGE_FIELD_CONFIG = {
  singleFields: [
    "image",
    "imageUrl",
    "mainUrl",
    "renderUrl",
    "modelUrl",
    "logo",
    "cover",
    "icon",
    "mainImage",
  ],
  arrayFields: ["gallery", "floors", "images"],
};

const MODEL_MAP: { [key: string]: any } = {
  categories: db.categories,
  youtube: db.youtube,
  branch: db.branch,
  certificates: db.certificates,
  fag: db.faq,
  sectionContent: db.sectionContent,
  service: db.services,
  offices: db.office,
  photoGallery: db.photoGallery,
  "work-process": db.workProcess,
  directions: db.directions,
};

function collectImageUrls(document: Record<string, unknown>): string[] {
  const urls: string[] = [];

  for (const field of IMAGE_FIELD_CONFIG.singleFields) {
    const value = document[field];
    if (value && typeof value === "string") {
      urls.push(value);
    }
  }

  for (const field of IMAGE_FIELD_CONFIG.arrayFields) {
    const value = document[field];
    if (Array.isArray(value)) {
      urls.push(
        ...value.filter(
          (url): url is string => typeof url === "string" && url.length > 0,
        ),
      );
    }
  }

  return urls;
}

async function deleteImagesFromStorage(imageUrls: string[]): Promise<void> {
  if (imageUrls.length === 0) return;

  try {
    await deleteImageService.deleteFilesByIds({ fileIds: imageUrls });
  } catch (error) {
    console.error("purgeDeletedItems image delete error:", error);
  }
}

export async function countDeletedItems(): Promise<number> {
  const counts = await Promise.all(
    Object.entries(MODEL_MAP).map(async ([modelName, prismaModel]) => {
      try {
        return await prismaModel.count({ where: { isDeleted: true } });
      } catch (error) {
        console.error(`countDeletedItems error (${modelName}):`, error);
        return 0;
      }
    }),
  );

  return counts.reduce((sum, count) => sum + count, 0);
}

export type PurgeDeletedResult = {
  success: boolean;
  totalDeleted: number;
  errors: string[];
};

export async function purgeDeletedItems(): Promise<PurgeDeletedResult> {
  let totalDeleted = 0;
  const errors: string[] = [];

  for (const [modelName, prismaModel] of Object.entries(MODEL_MAP)) {
    try {
      const items = await prismaModel.findMany({
        where: { isDeleted: true },
      });

      for (const item of items) {
        try {
          const imageUrls = collectImageUrls(item as Record<string, unknown>);
          await deleteImagesFromStorage(imageUrls);
          await prismaModel.delete({ where: { id: item.id } });
          totalDeleted++;
        } catch (error) {
          const message = `${modelName}#${item.id}: ${(error as Error).message}`;
          console.error("purgeDeletedItems item error:", message);
          errors.push(message);
        }
      }
    } catch (error) {
      const message = `${modelName}: ${(error as Error).message}`;
      console.error("purgeDeletedItems model error:", message);
      errors.push(message);
    }
  }

  

  return {
    success: errors.length === 0,
    totalDeleted,
    errors,
  };
}

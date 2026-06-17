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
  "contact-enum": db.contactEnum,
  youtube: db.youtube,
  position: db.position,
  employee: db.employee,
  advantages: db.advantages,
  blog: db.blog,
  branch: db.branch,
  certificates: db.certificates,
  fag: db.faq,
  sectionContent: db.sectionContent,
  sectioncta: db.sectionCta,
  service: db.services,
  offices: db.office,
  photoGallery: db.photoGallery,
  "work-process": db.workProcess,
  "service-category": db.servicesCat,
  blogCategory: db.blogCategory,
  directions: db.directions,
  "call-action": db.callAction,
  "price-offer": db.priceOffer,
  "contact-message": db.contactUs,
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

  if (totalDeleted > 0) {
    await revalidateAll([
      CACHE_TAG_GROUPS.BLOG,
      CACHE_TAG_GROUPS.PHOTO_GALLERY,
      CACHE_TAG_GROUPS.CERTIFICATES,
      CACHE_TAG_GROUPS.VIDEO_GALLERY,
      CACHE_TAG_GROUPS.ABOUT,
      CACHE_TAG_GROUPS.SERVICES_CATEGORY,
      CACHE_TAG_GROUPS.SERVICES_MAIN,
      CACHE_TAG_GROUPS.EMPLOYEE,
      CACHE_TAG_GROUPS.DIRECTIONS_MAIN,
      CACHE_TAG_GROUPS.HERO,
    ]);
  }

  return {
    success: errors.length === 0,
    totalDeleted,
    errors,
  };
}

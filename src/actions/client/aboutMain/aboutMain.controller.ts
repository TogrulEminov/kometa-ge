"use server";
import { FILE_SELECT } from "@/helper/fragments";
import { db } from "@/lib/prisma";
import { authActionClient } from "@/lib/safe-action/SafeAction";
import { CustomLocales } from "@/services/interface/type";
import { ZodError } from "zod";
import {
  gallerySchema,
  imageSchema,
} from "@/app/(dashboard)/_type/global.type";
import { publishGalleryFiles, publishSingleFile } from "@/helper/publishFiles";
import { upsertAboutMainInfoSchema } from "./aboutMain.schema";
type GetProps = {
  locale: CustomLocales;
};
export async function getAboutMainInfo({ locale }: GetProps) {
  return db.aboutMain.findFirst({
    where: { key: "main" },
    include: {
      imageUrl: FILE_SELECT,
      gallery: FILE_SELECT,
      service: {
        select: {
          id: true,
          translations: {
            where: {
              locale: locale,
            },
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
      branches: {
        where: {
          isDeleted: false,
          translations: {
            some: {
              locale: locale,
            },
          },
        },
      },
      translations: {
        where: { locale },
      },
    },
  });
}
export const upsetAbouMainInfo = authActionClient
  .inputSchema(upsertAboutMainInfoSchema)
  .action(async ({ parsedInput }) => {
    try {
      const {
        title,
        description,
        subTitle,
        locale,
        hightlight,
        shortDescription,
        branches,
        serviceId,
      } = parsedInput;

      return db.$transaction(async (prisma) => {
        let mainRecord = await prisma.aboutMain.findFirst({
          where: { key: "main" },
          select: { id: true },
        });

        if (!mainRecord) {
          mainRecord = await prisma.aboutMain.create({
            data: {
              key: "main",
              ...(serviceId && {
                serviceId: serviceId,
              }),
              ...(branches?.length && {
                branches: {
                  connect: branches.map((branch) => ({ id: branch })),
                },
              }),
            },
            select: { id: true },
          });
        } else if (branches) {
          await prisma.aboutMain.update({
            where: { id: mainRecord.id },
            data: {
              ...(serviceId && {
                serviceId: serviceId,
              }),
              branches: {
                set: branches.map((branch) => ({ id: branch })),
              },
            },
          });
        }

        const translation = await prisma.aboutMainTranslations.upsert({
          where: {
            documentId_locale: {
              documentId: mainRecord.id,
              locale,
            },
          },
          update: {
            title,
            locale,
            description: JSON.stringify(description),
            subTitle,
            hightlight,
            shortDescription,
          },
          create: {
            documentId: mainRecord.id,
            title,
            subTitle,
            description: JSON.stringify(description),
            locale,
            hightlight,
            shortDescription,
          },
        });

        return {
          ...mainRecord,
          translations: [translation],
        };
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Record<string, string[]> = {};
        error.issues.forEach((err) => {
          const path = err.path.join(".");
          if (!fieldErrors[path]) fieldErrors[path] = [];
          fieldErrors[path].push(err.message);
        });
        throw new Error(JSON.stringify(fieldErrors));
      }
      throw new Error("Məlumat yadda saxlanarkən xəta baş verdi");
    }
  });

export const uptadeAboutMainImage = authActionClient
  .inputSchema(imageSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { imageId } = parsedInput;
      const existingData = await db.aboutMain.findFirst({
        where: { key: "main" },
        select: {
          id: true,
          imageId: true,
        },
      });
      if (!existingData) {
        throw new Error("Category not found");
      }

      return db.$transaction(async (tx) => {
        await publishSingleFile(
          {
            newFileId: imageId,
            previousFileId: existingData.imageId,
          },
          tx,
        );

        return (tx as typeof db).aboutMain.update({
          where: { key: "main" },
          data: {
            imageId: Number(imageId),
          },
        });
      });
    } catch (error) {
      const errorMessage = (error as Error).message;
      throw new Error(`Internal Server Error - ${errorMessage}`);
    }
  });

export const upsertAboutMainGallery = authActionClient
  .inputSchema(gallerySchema)
  .action(async ({ parsedInput }) => {
    try {
      const { galleryIds } = parsedInput;
      const existingData = await db.aboutMain.findFirst({
        where: { key: "main" },
        select: {
          id: true,
          gallery: FILE_SELECT,
        },
      });
      if (!existingData) {
        throw new Error("Category not found");
      }

      if (existingData?.gallery?.length > 2) {
        throw new Error("Gallery cannot have more than 2 images");
      }
      return db.$transaction(async (tx) => {
        await publishGalleryFiles(
          {
            newFileIds: galleryIds,
            previousFileIds: existingData.gallery.map((item) => item.id),
          },
          tx,
        );

        return (tx as typeof db).aboutMain.update({
          where: { key: "main" },
          data: {
            gallery: {
              set: galleryIds?.map((id) => ({ id: Number(id) })),
            },
          },
        });
      });
    } catch (error) {
      const errorMessage = (error as Error).message;
      throw new Error(`Internal Server Error - ${errorMessage}`);
    }
  });

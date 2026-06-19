"use server";
import { FILE_SELECT } from "@/helper/fragments";
import { db } from "@/lib/prisma";
import { authActionClient } from "@/lib/safe-action/SafeAction";
import { CustomLocales } from "@/services/interface/type";
import { ZodError } from "zod";
import { imageSchema } from "@/app/(dashboard)/_type/global.type";
import { publishSingleFile } from "@/helper/publishFiles";
import { upsertAboutSectionInfoSchema } from "./aboutSection.schema";
type GetProps = {
  locale: CustomLocales;
};
export async function getAboutSectionInfo({ locale }: GetProps) {
  return db.aboutHome.findFirst({
    where: { key: "main" },
    include: {
      imageUrl: FILE_SELECT,
      translations: {
        where: { locale },
      },
    },
  });
}
export const upsertAboutSectionInfo = authActionClient
  .inputSchema(upsertAboutSectionInfoSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { title, description, subTitle, locale, features } = parsedInput;
      const result = await db.$transaction(async (prisma) => {
        let mainRecord = await prisma.aboutHome.findFirst({
          where: { key: "main" },
          select: { id: true },
        });

        if (!mainRecord) {
          mainRecord = await prisma.aboutHome.create({
            data: { key: "main" },
            select: { id: true },
          });
        }
        // 2. translation upsert
        const translation = await prisma.aboutHomeTranslations.upsert({
          where: {
            documentId_locale: {
              documentId: mainRecord.id,
              locale,
            },
          },
          update: {
            title,
            locale,
            features: JSON.stringify(features),
            subTitle,
            description,
          },
          create: {
            documentId: mainRecord.id,
            title,
            subTitle,
            features: JSON.stringify(features),
            locale,
            description,
          },
        });

        return {
          ...mainRecord,
          translations: [translation],
        };
      });

      return {
        success: true,
        data: result,
        message: "Məlumat uğurla yadda saxlandı",
      };
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

export const uptadeAboutSectionInfoImage = authActionClient
  .inputSchema(imageSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { imageId } = parsedInput;
      const existingData = await db.aboutHome.findFirst({
        where: { key: "main" },
        select: {
          id: true,
          imageId: true,
        },
      });
      if (!existingData) {
        throw new Error("Category not found");
      }

      const uptadeData = await db.$transaction(async (tx) => {
        await publishSingleFile(
          {
            newFileId: imageId,
            previousFileId: existingData.imageId,
          },
          tx,
        );

        return (tx as typeof db).aboutHome.update({
          where: { key: "main" },
          data: {
            imageId: Number(imageId),
          },
        });
      });

      return {
        success: true,
        code: "SUCCESS",
        data: uptadeData,
        message: "Uptade is successfully",
      };
    } catch (error) {
      const errorMessage = (error as Error).message;
      throw new Error(`Internal Server Error - ${errorMessage}`);
    }
  });

"use server";
import { FILE_SELECT } from "@/helper/fragments";
import { db } from "@/lib/prisma";
import { authActionClient } from "@/lib/safe-action/SafeAction";
import { CustomLocales } from "@/services/interface/type";
import { ZodError } from "zod";
import { upsertHeroInfoSchema, videoSchema } from "./hero.schema";
import { createSlug } from "@/utils/createSlug";
import { imageSchema } from "@/app/(dashboard)/_type/global.type";
import { publishSingleFile } from "@/helper/publishFiles";
import { revalidateAll } from "@/helper/revalidate";
import { CACHE_TAG_GROUPS } from "@/actions/ui/cachetags";
type GetProps = {
  locale: CustomLocales;
};
export async function getHeroInfo({ locale }: GetProps) {
  return db.heroInfo.findFirst({
    where: { key: "main" },
    include: {
      imageUrl: FILE_SELECT,
      videoUrl: FILE_SELECT,
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
      translations: {
        where: { locale },
      },
    },
  });
}
export const upsertHeroInfo = authActionClient
  .inputSchema(upsertHeroInfoSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { title, description, subTitle, serviceId, locale } = parsedInput;

      const custom_slug = createSlug(title);

      const result = await db.$transaction(async (prisma) => {
        let mainRecord = await prisma.heroInfo.findFirst({
          where: { key: "main" },
          select: { id: true },
        });

        const heroData = { serviceId: serviceId ?? null };

        if (!mainRecord) {
          mainRecord = await prisma.heroInfo.create({
            data: { key: "main", ...heroData },
            select: { id: true, serviceId: true },
          });
        } else {
          mainRecord = await prisma.heroInfo.update({
            where: { id: mainRecord.id },
            data: heroData,
            select: { id: true, serviceId: true },
          });
        }

        // 2. translation upsert
        const translation = await prisma.heroInfoTranslations.upsert({
          where: {
            documentId_locale: {
              documentId: mainRecord.id,
              locale,
            },
          },
          update: {
            title,
            description,
            subTitle,
            slug: custom_slug,
          },
          create: {
            documentId: mainRecord.id,
            title,
            subTitle,
            description,
            slug: custom_slug,
            locale,
          },
        });

        return {
          ...mainRecord,
          translations: [translation],
        };
      });
      await revalidateAll(CACHE_TAG_GROUPS.HERO);

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

export const uptadeHeroImage = authActionClient
  .inputSchema(imageSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { imageId } = parsedInput;
      const existingData = await db.heroInfo.findFirst({
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

        return (tx as typeof db).heroInfo.update({
          where: { key: "main" },
          data: {
            imageId: Number(imageId),
          },
        });
      });
      await revalidateAll(CACHE_TAG_GROUPS.HERO);

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
export const uptadeHeroVideo = authActionClient
  .inputSchema(videoSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { videoId } = parsedInput;
      const existingData = await db.heroInfo.findFirst({
        where: { key: "main" },
        select: {
          id: true,
          videoId: true,
        },
      });
      if (!existingData) {
        throw new Error("Category not found");
      }

      const uptadeData = await db.$transaction(async (tx) => {
        await publishSingleFile(
          {
            newFileId: videoId,
            previousFileId: existingData.videoId,
          },
          tx,
        );

        return (tx as typeof db).heroInfo.update({
          where: { key: "main" },
          data: {
            videoId: Number(videoId),
          },
        });
      });
      await revalidateAll(CACHE_TAG_GROUPS.HERO);
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

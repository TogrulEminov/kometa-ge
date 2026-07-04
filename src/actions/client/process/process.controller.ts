"use server";
import { FILE_SELECT } from "@/helper/fragments";
import { db } from "@/lib/prisma";
import { authActionClient } from "@/lib/safe-action/SafeAction";
import { CustomLocales } from "@/services/interface/type";
import { ZodError } from "zod";
import { imageSchema } from "@/app/(dashboard)/_type/global.type";
import { publishSingleFile } from "@/helper/publishFiles";
import { upsertProcessInfoSchema } from "./process.schema";
import { revalidateAll } from "@/helper/revalidate";
import { CACHE_TAG_GROUPS } from "@/actions/ui/cachetags";
type GetProps = {
  locale: CustomLocales;
};
export async function getProcessInfo({ locale }: GetProps) {
  return db.workProcess.findFirst({
    where: { key: "main" },
    include: {
      imageUrl: FILE_SELECT,
      translations: {
        where: { locale },
      },
    },
  });
}
export const upsertProcessInfo = authActionClient
  .inputSchema(upsertProcessInfoSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { title, description, subTitle, locale } = parsedInput;
      const result = await db.$transaction(async (prisma) => {
        let mainRecord = await prisma.workProcess.findFirst({
          where: { key: "main" },
          select: { id: true },
        });

        if (!mainRecord) {
          mainRecord = await prisma.workProcess.create({
            data: { key: "main" },
            select: { id: true },
          });
        }
        // 2. translation upsert
        const translation = await prisma.workProcessTranslations.upsert({
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
          },
          create: {
            documentId: mainRecord.id,
            title,
            subTitle,
            description: JSON.stringify(description),
            locale,
          },
        });
        await revalidateAll(CACHE_TAG_GROUPS.WORK_PROCESS);
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

export const uptadeProcessImage = authActionClient
  .inputSchema(imageSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { imageId } = parsedInput;
      const existingData = await db.workProcess.findFirst({
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

        return (tx as typeof db).workProcess.update({
          where: { key: "main" },
          data: {
            imageId: Number(imageId),
          },
        });
      });
      await revalidateAll(CACHE_TAG_GROUPS.WORK_PROCESS);
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

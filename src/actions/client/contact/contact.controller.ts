"use server";
import { localeSchema } from "@/app/(dashboard)/_type/global.type";
import { Locales } from "@/generated/prisma/enums";
import { db } from "@/lib/prisma";
import { authActionClient } from "@/lib/safe-action/SafeAction";
import { ZodError } from "zod";
import { z } from "zod";
import { upsertContactSchema } from "./contact.schema";
import { formatZodErrors } from "@/utils/format-zod-errors";
import { revalidateAll } from "@/helper/revalidate";
import { CACHE_TAG_GROUPS } from "@/actions/ui/cachetags";

// --- GET CONTACT ---
export const getContact = authActionClient
  .inputSchema(localeSchema)
  .action(async ({ parsedInput: { locale } }) => {
    return db.contactInformation.findFirst({
      where: { key: "main" },
      select: {
        id: true,
        phone: true,
        email: true,
        adressLink: true,
        whatsapp: true,
        latitude: true,
        longitude: true,
        createdAt: true,
        updatedAt: true,
        translations: {
          where: { locale },
          select: {
            id: true,
            adress: true,
            locale: true,
          },
        },
      },
    });
  });

// --- UPSERT CONTACT ---
export const upsertContact = authActionClient
  .inputSchema(upsertContactSchema)
  .action(async ({ parsedInput }) => {
    const {
      phone,
      email,
      whatsapp,
      adressLink,
      adress,
      locale,
      longitude,
      latitude,
    } = parsedInput;

    try {
      const result = await db.$transaction(async (prisma) => {
        // --- Ana record: upsert ---
        const mainRecord = await prisma.contactInformation.upsert({
          where: { key: "main" },
          create: {
            key: "main",
            phone,
            email,
            whatsapp,
            adressLink,
            latitude: String(latitude) ?? null,
            longitude: String(longitude) ?? null,
          },
          update: {
            phone,
            email,
            whatsapp,
            adressLink,
            latitude: String(latitude) ?? null,
            longitude: String(longitude) ?? null,
          },
        });

        const translation = await prisma.contactInformationTranslation.upsert({
          where: {
            documentId_locale: {
              documentId: mainRecord.id,
              locale,
            },
          },
          create: {
            adress,
            documentId: mainRecord.id,
            locale,
          },
          update: {
            adress,
            documentId: mainRecord.id,
            locale,
          },
        });

        return {
          ...mainRecord,
          translations: [translation],
        };
      });
      await revalidateAll(CACHE_TAG_GROUPS.CONTACT_INFORMATION);
      return {
        data: result,
        message: "Məlumat uğurla yadda saxlandı",
      };
    } catch (error) {
      console.error("Contact upsert error:", error);

      if (error instanceof ZodError) {
        throw new Error(JSON.stringify(formatZodErrors(error)));
      }

      if (error instanceof Error) {
        if (error.message.includes("Timed out")) {
          throw new Error(
            "Tranzaksiya icra vaxtı aşıldı. Zəhmət olmasa yenidən cəhd edin.",
          );
        }
        throw new Error(error.message);
      }

      throw new Error("Məlumat yadda saxlanarkən xəta baş verdi");
    }
  });

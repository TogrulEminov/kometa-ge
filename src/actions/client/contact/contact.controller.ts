"use server";
import { ZodError } from "zod";
import { db } from "../../../lib/admin/prismaClient";
import { Locales } from "@/src/generated/prisma/enums";
import { formatZodErrors } from "../../../utils/format-zod-errors";
import {
  UpsertContactInput,
  upsertContactSchema,
} from "@/src/actions/client/contact/contact.schema";
import { authActionClient } from "@/src/lib/safe-action";
import { z } from "zod";

// --- GET CONTACT ---
export const getContact = authActionClient
  .inputSchema(z.object({ locale: z.nativeEnum(Locales) }))
  .action(async ({ parsedInput: { locale } }) => {
    const data = await db.contactInformation.findFirst({
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
            info: true,
          },
        },
      },
    });

    return {
      message: "Success",
      data,
      success: true,
    };
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
      info,
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
            latitude: latitude ?? null,
            longitude: longitude ?? null,
          },
          update: {
            phone,
            email,
            whatsapp,
            adressLink,
            latitude: latitude ?? null,
            longitude: longitude ?? null,
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
            info: JSON.stringify(info),
            documentId: mainRecord.id,
            locale,
          },
          update: {
            adress,
            info: JSON.stringify(info),
            documentId: mainRecord.id,
            locale,
          },
        });

        return {
          ...mainRecord,
          translations: [translation],
        };
      });

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

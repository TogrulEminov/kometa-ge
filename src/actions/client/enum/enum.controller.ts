"use server";
import { ZodError } from "zod";
import { db } from "../../../lib/admin/prismaClient";
import { Prisma } from "@/src/generated/prisma/client";
import { EnumKey, Locales } from "@/src/generated/prisma/enums";
import { formatZodErrors } from "../../../utils/format-zod-errors";
import { createSlug } from "@/src/lib/slugifyHelper";
import { authActionClient } from "@/src/lib/safe-action";
import { createEnumSchema, uptadeEnumSchema } from "./enum.schema";
import { CustomLocales } from "@/src/services/interface";

type GetProps = {
  page?: number;
  query?: string;
  pageSize?: number;
  locale: Locales;
};
type GetByIDProps = {
  id: string;
  locale: Locales;
};
export async function getEnumData({ page, pageSize, query, locale }: GetProps) {
  const customPage = page || 1;
  const customPageSize = Math.min(Number(pageSize) || 12, 100);
  const skip = (customPage - 1) * customPageSize;
  const take = customPageSize;
  const searchTerm = query?.trim();

  const whereClause: Prisma.EnumWhereInput = {
    isDeleted: false,
    translations: {
      some: {
        locale: locale,
        ...(searchTerm && {
          title: {
            contains: searchTerm,
            mode: "insensitive",
          },
        }),
      },
    },
  };

  // ✅ SELECT OPTIMIZATION VƏ PARALLEL SORĞU
  const [data, totalCount] = await Promise.all([
    db.enum.findMany({
      where: whereClause,
      select: {
        status: true,
        id: true,
        createdAt: true,
        updatedAt: true,
        translations: {
          where: {
            locale: locale,
          },
          select: {
            id: true,
            locale: true,
            slug: true,
            title: true,
            documentId: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: skip,
      take: take,
    }),
    db.enum.count({ where: whereClause }),
  ]);

  const totalPages = Math.ceil(totalCount / customPageSize);

  return {
    message: "Success",
    data: totalCount < 1 ? [] : data,
    success: true,
    paginations: {
      page: customPage,
      pageSize: customPageSize,
      totalPages: totalPages,
      dataCount: totalCount,
    },
  };
}
export async function getEnumById({ locale, id }: GetByIDProps) {
  try {
    const whereClause: Prisma.EnumWhereInput = {
      isDeleted: false,
      id,
      translations: {
        some: { locale },
      },
    };

    const existingData = await db.enum.findFirst({
      where: whereClause,
      select: {
        id: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        translations: {
          where: { locale },
        },
      },
    });

    return { data: existingData };
  } catch (error) {
    console.error("getPositionById error:", error);
    const errorMessage = (error as Error).message;
    return {
      success: false,
      code: "SERVER_ERROR",
      error: `Internal Server Error - ${errorMessage}`,
    };
  }
}
export async function getEnumByKey({
  locale,
  key,
}: {
  locale: CustomLocales;
  key: EnumKey;
}) {
  try {
    const whereClause: Prisma.EnumWhereInput = {
      isDeleted: false,
      key: key,
      translations: {
        some: { locale },
      },
    };

    const existingData = await db.enum.findMany({
      where: whereClause,
      select: {
        id: true,
        translations: {
          where: { locale },
        },
      },
    });

    return { data: existingData };
  } catch (error) {
    console.error("getPositionById error:", error);
    const errorMessage = (error as Error).message;
    return {
      success: false,
      code: "SERVER_ERROR",
      error: `Internal Server Error - ${errorMessage}`,
    };
  }
}
export const createEnum = authActionClient
  .inputSchema(createEnumSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { title, locale, key, slug } = parsedInput;
      const customSlug = slug || createSlug(title);

      const existingData = await db.enum.findFirst({
        where: {
          isDeleted: false,
          translations: {
            some: { locale: locale, slug: customSlug },
          },
        },
        select: { id: true },
      });
      if (existingData) {
        throw new Error("Bu başlıqla (slug) məlumat artıq mövcuddur");
      }

      const newData = await db.enum.create({
        data: {
          key: key || "contact",
          translations: {
            create: {
              title: title,
              slug: customSlug,
              locale: locale,
            },
          },
        },
      });

      return newData;
    } catch (error) {
      console.error("createPosition error:", error);
      if (error instanceof ZodError) {
        throw new Error(JSON.stringify(formatZodErrors(error)));
      }
      throw new Error("Məlumat yadda saxlanarkən xəta baş verdi");
    }
  });

export const updateEnum = authActionClient
  .inputSchema(uptadeEnumSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { title, locale, id, key, slug } = parsedInput;

      const customSlug = slug || createSlug(title);
      const updatedData = await db.$transaction(async (prisma) => {
        const result = await prisma.enum.update({
          where: { id: id },
          data: {
            key: key || "contact",
            translations: {
              upsert: {
                where: {
                  documentId_locale: {
                    documentId: id!,
                    locale,
                  },
                },
                create: {
                  title: title,
                  locale,
                  slug: customSlug,
                },
                update: {
                  title,
                  slug: customSlug,
                },
              },
            },
          },
          select: {
            documentId: true,
            status: true,
            updatedAt: true,
            translations: {
              where: { locale: locale },
              select: { title: true, slug: true, locale: true },
            },
          },
        });

        return result;
      });

      return updatedData;
    } catch (error) {
      console.error("updatePosition error:", error);
      if (error instanceof ZodError) {
        throw new Error(JSON.stringify(formatZodErrors(error)));
      }
      const errorMessage = (error as Error).message;
      throw new Error(`Internal Server Error - ${errorMessage}`);
    }
  });

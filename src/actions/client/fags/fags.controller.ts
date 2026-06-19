"use server";
import { Prisma } from "@/generated/prisma/client";
import {   Locales } from "@/generated/prisma/enums";
import { db } from "@/lib/prisma";
import { authActionClient } from "@/lib/safe-action/SafeAction";
import { ZodError } from "zod";
import { createSlug } from "@/utils/createSlug";
import { formatZodErrors } from "@/utils/format-zod-errors";
import { idSchema } from "@/app/(dashboard)/_type/global.type";
import { createFagSchema, uptadeFagSchema } from "./fags.schema";
import { getNextOrderNumber } from "@/lib/order/getNextOrderNumber";

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
export async function getFagData({ page, pageSize, query, locale }: GetProps) {
  const customPage = page || 1;
  const customPageSize = Math.min(Number(pageSize) || 12, 100);
  const skip = (customPage - 1) * customPageSize;
  const take = customPageSize;
  const searchTerm = query?.trim();

  const whereClause: Prisma.FaqWhereInput = {
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
  const [data, totalCount] = await Promise.all([
    db.faq.findMany({
      where: whereClause,
      select: {
        id: true,
        orderNumber:true,
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
      orderBy: { orderNumber: "asc" },
      skip: skip,
      take: take,
    }),
    db.faq.count({ where: whereClause }),
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
export async function getFagById({ locale, id }: GetByIDProps) {
  try {
    const whereClause: Prisma.FaqWhereInput = {
      isDeleted: false,
      id,
      translations: {
        some: { locale },
      },
    };

    return db.faq.findFirst({
      where: whereClause,
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        translations: {
          where: { locale },
        },
      },
    });
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

export const createFag = authActionClient
  .inputSchema(createFagSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { title, locale, description } = parsedInput;
      const customSlug = createSlug(title);

      const existingData = await db.faq.findFirst({
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
      const nextOrder = await getNextOrderNumber("faq");

      const newData = await db.faq.create({
        data: {
          orderNumber: nextOrder,
          translations: {
            create: {
              title,
              slug: customSlug,
              description,
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

export const updateFag = authActionClient
  .inputSchema(uptadeFagSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { title, locale, id, description } = parsedInput;

      const customSlug = createSlug(title);
      const updatedData = await db.$transaction(async (prisma) => {
        const result = await prisma.faq.update({
          where: { id: id },
          data: {
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
                  description,
                },
                update: {
                  title,
                  slug: customSlug,
                  description,
                  locale,
                },
              },
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
export const deleteFag = authActionClient
  .inputSchema(idSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { id } = parsedInput;
      const existingCategory = await db.faq.findUnique({
        where: { id: id, isDeleted: false },
      });
      if (!existingCategory) {
        throw new Error("Data not found");
      }
      await db.faq.update({
        where: { id: id },
        data: { isDeleted: true },
      });
      return {
        message: "Data deleted successfully",
      };
    } catch (error) {
      const errorMessage = (error as Error).message;
      throw new Error(`Internal Server Error - ${errorMessage}`);
    }
  });

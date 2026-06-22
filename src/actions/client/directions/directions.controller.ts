"use server";
import { Prisma } from "@/generated/prisma/client";
import { Locales } from "@/generated/prisma/enums";
import { FILE_SELECT } from "@/helper/fragments";
import { db } from "@/lib/prisma";
import { authActionClient } from "@/lib/safe-action/SafeAction";
import { ZodError } from "zod";
import { createSlug } from "@/utils/createSlug";
import { publishSingleFile } from "@/helper/publishFiles";
import { formatZodErrors } from "@/utils/format-zod-errors";
import { idSchema, imageSchema } from "@/app/(dashboard)/_type/global.type";
import { getNextOrderNumber } from "@/lib/order/getNextOrderNumber";
import {
  createDirectionsSchema,
  uptadeDirectionsSchema,
} from "./directions.schema";
import { revalidateAll } from "@/helper/revalidate";
import { CACHE_TAG_GROUPS } from "@/actions/ui/cachetags";
type GetProps = {
  page: number;
  query?: string;
  pageSize: number;
  locale: Locales;
};
type GetByIDProps = {
  id: string;
  locale: Locales;
};
export async function getDirections({
  page,
  pageSize,
  query,
  locale,
}: GetProps) {
  const customPage = page || 1;
  const customPageSize = Math.min(Number(pageSize) || 12, 100);
  const skip = (customPage - 1) * customPageSize;
  const take = customPageSize;
  const searchTerm = query?.trim();

  const whereClause: Prisma.DirectionsWhereInput = {
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
    db.directions.findMany({
      where: whereClause,
      select: {
        id: true,
        imageUrl: FILE_SELECT,
        createdAt: true,
        orderNumber: true,
        updatedAt: true,
        route: true,
        translations: {
          where: {
            locale: locale,
          },
          select: {
            id: true,
            slug: true,
            locale: true,
            title: true,
            navTitle: true,
            shortDescription: true,
            description: true,
            documentId: true,
          },
        },
      },
      orderBy: { orderNumber: "asc" },
      skip: skip,
      take: take,
    }),
    db.directions.count({ where: whereClause }),
  ]);
  const totalPages = Math.ceil(totalCount / customPageSize);
  return {
    message: "Success",
    data: totalCount < 1 ? [] : data,
    paginations: {
      page: customPage,
      pageSize: customPageSize,
      totalPages: totalPages,
      dataCount: totalCount,
    },
  };
}
export async function getDirectionsById({ locale, id }: GetByIDProps) {
  try {
    const whereClause: Prisma.DirectionsWhereInput = {
      isDeleted: false,
      id,
      translations: {
        some: { locale },
      },
    };

    return db.directions.findFirst({
      where: whereClause,
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        imageUrl: FILE_SELECT,
        route: true,
        translations: {
          where: { locale },
          select: {
            id: true,
            title: true,
            description: true,
            slug: true,
            locale: true,
            navTitle: true,
            shortDescription: true,
            seo: {
              select: {
                metaDescription: true,
                metaKeywords: true,
                metaTitle: true,
              },
            },
          },
        },
      },
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    throw new Error(`Internal Server Error - ${errorMessage}`);
  }
}
export const createDirections = authActionClient
  .inputSchema(createDirectionsSchema)
  .action(async ({ parsedInput }) => {
    try {
      const {
        title,
        description,
        locale,
        imageId,
        metaTitle,
        metaDescription,
        metaKeywords,
        navTitle,
        route,
        shortDescription,
        slug,
      } = parsedInput;

      const customSlug = slug || createSlug(title);

      const existingData = await db.directions.findFirst({
        where: {
          isDeleted: false,
          translations: {
            some: { locale: locale, slug: customSlug },
          },
        },
        select: { id: true },
      });
      if (existingData) {
        throw new Error("Data with this title and slug already exists");
      }
      return db.$transaction(async (prisma) => {
        await publishSingleFile({ newFileId: imageId }, prisma);
        const nextOrder = await getNextOrderNumber("directions");
        await revalidateAll(CACHE_TAG_GROUPS.DIRECTIONS);
        return prisma.directions.create({
          data: {
            orderNumber: nextOrder,
            route: route,
            imageId: imageId ? Number(imageId) : null,
            translations: {
              create: {
                title: title,
                locale: locale,
                slug: customSlug,
                navTitle,
                shortDescription,
                description: JSON.stringify(description),
                seo: {
                  create: {
                    metaTitle: metaTitle,
                    metaDescription: metaDescription,
                    metaKeywords: metaKeywords,
                    imageId: imageId ? Number(imageId) : null,
                    locale: locale,
                  },
                },
              },
            },
          },
        });
      });
    } catch (error) {
      console.error("createServices error:", error);
      if (error instanceof ZodError) {
        throw new Error(JSON.stringify(formatZodErrors(error)));
      }
      throw new Error("Data saving failed");
    }
  });
export const uptadeDirections = authActionClient
  .inputSchema(uptadeDirectionsSchema)
  .action(async ({ parsedInput }) => {
    try {
      const {
        title,
        description,
        locale,
        metaTitle,
        metaDescription,
        metaKeywords,
        id,
        slug,
        navTitle,
        route,
        shortDescription,
      } = parsedInput;

      const customSlug = slug || createSlug(title);

      const finalSlug = customSlug;
      return db.$transaction(async (prisma) => {
        const updatedData = await prisma.directions.update({
          where: { id: id },
          data: {
            route: route,
            translations: {
              upsert: {
                where: {
                  documentId_locale: { documentId: id!, locale },
                },
                create: {
                  title: title,
                  locale,
                  slug: finalSlug,
                  description: JSON.stringify(description),
                  navTitle,
                  shortDescription,
                  seo: {
                    create: {
                      metaTitle: metaTitle,
                      metaDescription: metaDescription,
                      metaKeywords: metaKeywords,
                      locale,
                    },
                  },
                },
                update: {
                  title: title,
                  locale,
                  slug: finalSlug,
                  description: JSON.stringify(description),
                  navTitle,
                  shortDescription,
                  seo: {
                    update: {
                      metaTitle: metaTitle,
                      metaDescription: metaDescription,
                      metaKeywords: metaKeywords,
                      locale,
                    },
                  },
                },
              },
            },
          },
        });
        await revalidateAll(CACHE_TAG_GROUPS.DIRECTIONS);
        return updatedData;
      });
    } catch (error) {
      console.error("uptadeEmployee error:", error);
      const errorMessage = (error as Error).message;
      if (errorMessage.includes("Timed out")) {
        throw new Error(
          "Tranzaksiya icra vaxtı aşıldı. Zəhmət olmasa yenidən cəhd edin.",
        );
      }
      throw new Error(`Internal Server Error - ${errorMessage}`);
    }
  });
export const uptadeDirectionsImage = authActionClient
  .inputSchema(imageSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { imageId, id } = parsedInput;

      const existingData = await db.directions.findUnique({
        where: { id: id },
        select: { imageId: true },
      });
      if (!existingData) {
        throw new Error("Service not found");
      }

      return db.$transaction(async (prisma) => {
        await publishSingleFile(
          { newFileId: imageId, previousFileId: existingData.imageId },
          prisma,
        );
        await revalidateAll(CACHE_TAG_GROUPS.DIRECTIONS);
        return (prisma as typeof db).directions.update({
          where: { id: id },
          data: {
            imageId: Number(imageId),
            translations: {
              update: {
                where: {
                  documentId_locale: {
                    documentId: id!,
                    locale: "en",
                  },
                },
                data: {
                  seo: {
                    update: {
                      imageId: Number(imageId),
                    },
                  },
                },
              },
            },
          },
        });
      });
    } catch (error) {
      console.error("uptadeServicesImage error:", error);
      const errorMessage = (error as Error).message;
      throw new Error(`Internal Server Error - ${errorMessage}`);
    }
  });

export const deleteDirections = authActionClient
  .inputSchema(idSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { id } = parsedInput;
      const existingData = await db.directions.findUnique({
        where: { id: id },
        select: { id: true },
      });
      if (!existingData) {
        throw new Error("Direction not found");
      }
      await db.directions.update({
        where: { id: id },
        data: { isDeleted: true },
      });
      await revalidateAll(CACHE_TAG_GROUPS.DIRECTIONS);
      return {
        message: "Direction deleted successfully",
      };
    } catch (error) {
      const errorMessage = (error as Error).message;
      throw new Error(`Internal Server Error - ${errorMessage}`);
    }
  });

"use server";
import { ZodError } from "zod";
import { db } from "../../../lib/admin/prismaClient";
import { Prisma } from "@/src/generated/prisma/client";
import { Locales } from "@/src/generated/prisma/enums";
import { formatZodErrors } from "../../../utils/format-zod-errors";
import { createSlug } from "@/src/lib/slugifyHelper";
import {
  createServiceSchema,
  uptadeServiceSchema,
} from "@/src/actions/client/services/service.schema";
import { FILE_SELECT } from "@/src/helper/fragments";
import { authActionClient } from "@/src/lib/safe-action";
import { gallerySchema, imageSchema } from "@/src/services/global/global.type";

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
export async function getServices({ page, pageSize, query, locale }: GetProps) {
  const customPage = page || 1;
  const customPageSize = Math.min(Number(pageSize) || 12, 100);
  const skip = (customPage - 1) * customPageSize;
  const take = customPageSize;
  const searchTerm = query?.trim();

  const whereClause: Prisma.ServicesWhereInput = {
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
    db.services.findMany({
      where: whereClause,
      select: {
        id: true,
        status: true,
        enumId: true,
        gallery: FILE_SELECT,
        imageUrl: FILE_SELECT,
        createdAt: true,
        updatedAt: true,
        translations: {
          where: {
            locale: locale,
          },
          select: {
            id: true,
            slug: true,
            locale: true,
            title: true,
            documentId: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: skip,
      take: take,
    }),
    db.services.count({ where: whereClause }),
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
export async function getServicesById({ locale, id }: GetByIDProps) {
  try {
    const whereClause: Prisma.ServicesWhereInput = {
      isDeleted: false,
      id,
      translations: {
        some: { locale },
      },
    };

    const category = await db.services.findFirst({
      where: whereClause,
      select: {
        id: true,
        status: true,
        createdAt: true,
        enumId: true,
        enum: {
          where: {
            key: "services",
            isDeleted: false,
            translations: {
              some: {
                locale: locale,
              },
            },
          },
          include: {
            translations: true,
          },
        },
        updatedAt: true,
        imageUrl: FILE_SELECT,
        gallery: FILE_SELECT,
        translations: {
          where: { locale },
          select: {
            id: true,
            title: true,
            subDescription: true,
            description: true,
            slug: true,
            locale: true,
            highlight: true,
            seo: {
              select: {
                metaDescription: true,
                metaKeywords: true,
                metaTitle: true,
                imageUrl: FILE_SELECT,
              },
            },
          },
        },
      },
    });

    return { data: category };
  } catch (error) {
    const errorMessage = (error as Error).message;
    throw new Error(`Internal Server Error - ${errorMessage}`);
  }
}
export const createServices = authActionClient
  .inputSchema(createServiceSchema)
  .action(async ({ parsedInput }) => {
    try {
      const {
        title,
        description,
        locale,
        imageId,
        highlight,
        galleryIds,
        metaTitle,
        metaDescription,
        subDescription,
        metaKeywords,
        enumId,
      } = parsedInput;

      const customSlug = createSlug(title);
      const existingData = await db.services.findFirst({
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

      const newData = await db.services.create({
        data: {
          enumId: enumId,
          gallery: {
            connect: galleryIds?.map((id) => ({ id: Number(id) })),
          },
          imageId: imageId ? Number(imageId) : null,
          translations: {
            create: {
              title: title,
              locale: locale,
              slug: customSlug,
              description: JSON.stringify(description),
              highlight: highlight,
              subDescription,
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
      return newData;
    } catch (error) {
      console.error("createEmployee error:", error);
      if (error instanceof ZodError) {
        throw new Error(JSON.stringify(formatZodErrors(error)));
      }
      throw new Error("Məlumat yadda saxlanarkən xəta baş verdi");
    }
  });
export const uptadeServices = authActionClient
  .inputSchema(uptadeServiceSchema)
  .action(async ({ parsedInput }) => {
    try {
      const {
        title,
        description,
        locale,
        highlight,
        metaTitle,
        metaDescription,
        metaKeywords,
        subDescription,
        enumId,
        id,
      } = parsedInput;

      const customSlug = createSlug(title);

      const finalSlug = customSlug;
      const uptadeData = await db.$transaction(async (prisma) => {
        const updatedData = await prisma.services.update({
          where: { id: id },
          data: {
            enumId: enumId,
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
                  highlight: highlight,
                  subDescription,
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
                  highlight: highlight,
                  subDescription,
                  seo: {
                    upsert: {
                      create: {
                        metaTitle: metaTitle,
                        metaDescription: metaDescription,
                        metaKeywords: metaKeywords,
                        locale,
                      },
                      update: { metaTitle, metaDescription, metaKeywords },
                    },
                  },
                },
              },
            },
          },
        });

        return updatedData;
      });

      return uptadeData;
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
export const uptadeServicesImage = authActionClient
  .inputSchema(imageSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { imageId, id } = parsedInput;
      const uptadeData = await db.services.update({
        where: { id: id },
        data: {
          imageId: Number(imageId),
          translations: {
            update: {
              where: {
                documentId_locale: {
                  documentId: id!,
                  locale: "az",
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
        select: { documentId: true, imageId: true },
      });
      return uptadeData;
    } catch (error) {
      const errorMessage = (error as Error).message;
      throw new Error(`Internal Server Error - ${errorMessage}`);
    }
  });
export const uptadeServicesImages = authActionClient
  .inputSchema(gallerySchema)
  .action(async ({ parsedInput }) => {
    try {
      const { galleryIds, id } = parsedInput;
      const uptadeData = await db.services.update({
        where: { id: id },
        data: {
          gallery: {
            connect: galleryIds?.map((id) => ({ id: Number(id) })),
          },
        },
      });

      return uptadeData;
    } catch (error) {
      console.error("uptadeGalleryImages error:", error);
      const errorMessage = (error as Error).message;
      throw new Error(`Internal Server Error - ${errorMessage}`);
    }
  });

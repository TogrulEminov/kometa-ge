"use server";
import { Prisma } from "@/generated/prisma/client";
import { Locales } from "@/generated/prisma/enums";
import { FILE_SELECT } from "@/helper/fragments";
import { db } from "@/lib/prisma";
import { authActionClient } from "@/lib/safe-action/SafeAction";
import { ZodError } from "zod";
import {
  createSubServiceSchema,
  uptadeSubServiceSchema,
} from "./services-sub.schema";
import { createSlug } from "@/utils/createSlug";
import { publishGalleryFiles, publishSingleFile } from "@/helper/publishFiles";
import { formatZodErrors } from "@/utils/format-zod-errors";
import {
  gallerySchema,
  idSchema,
  imageSchema,
} from "@/app/(dashboard)/_type/global.type";
import { getNextOrderNumber } from "@/lib/order/getNextOrderNumber";
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
export async function getSubServicesInfo({
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

  const whereClause: Prisma.SubServicesWhereInput = {
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
    db.subServices.findMany({
      where: whereClause,
      select: {
        id: true,
        imageUrl: FILE_SELECT,
        gallery: FILE_SELECT,
        createdAt: true,
        orderNumber: true,
        updatedAt: true,
        services: {
          select: {
            translations: {
              where: { locale },
              select: {
                title: true,
              },
            },
          },
        },
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
      orderBy: { orderNumber: "asc" },
      skip: skip,
      take: take,
    }),
    db.subServices.count({ where: whereClause }),
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
export async function getSubServicesById({ locale, id }: GetByIDProps) {
  try {
    const whereClause: Prisma.SubServicesWhereInput = {
      isDeleted: false,
      id,
      translations: {
        some: { locale },
      },
    };

    return db.subServices.findFirst({
      where: whereClause,
      select: {
        id: true,
        createdAt: true,
        iconsUrl: true,
        servicesId: true,
        updatedAt: true,
        imageUrl: FILE_SELECT,
        gallery: FILE_SELECT,
        imageId: true,
        services: {
          select: {
            id: true,
            translations: {
              where: { locale },
              select: { title: true },
            },
          },
        },
        translations: {
          where: { locale },
          select: {
            id: true,
            title: true,
            description: true,
            slug: true,
            locale: true,
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
export const createSubServices = authActionClient
  .inputSchema(createSubServiceSchema)
  .action(async ({ parsedInput }) => {
    try {
      const {
        title,
        description,
        locale,
        imageId,
        galleryIds,
        metaTitle,
        metaDescription,
        metaKeywords,
        slug,
        servicesId,
        iconsUrl,
      } = parsedInput;

      const customSlug = slug || createSlug(title);

      const existingData = await db.subServices.findFirst({
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
        if (imageId) {
          await publishSingleFile({ newFileId: imageId }, prisma);
        }
        if (galleryIds) {
          await publishGalleryFiles({ newFileIds: galleryIds }, prisma);
        }
        await revalidateAll(CACHE_TAG_GROUPS.SUB_SERVICES);
        const nextOrder = await getNextOrderNumber("subServices");
        return prisma.subServices.create({
          data: {
            orderNumber: nextOrder,
            servicesId: servicesId,
            iconsUrl: iconsUrl,
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
export const uptadeSubServices = authActionClient
  .inputSchema(uptadeSubServiceSchema)
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
        servicesId,
        iconsUrl,
      } = parsedInput;

      const customSlug = slug || createSlug(title);

      const finalSlug = customSlug;
      return db.$transaction(async (prisma) => {
        const updatedData = await prisma.subServices.update({
          where: { id: id },
          data: {
            iconsUrl: iconsUrl,
            services: {
              connect: {
                id: String(servicesId),
              },
            },
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
        await revalidateAll(CACHE_TAG_GROUPS.SUB_SERVICES);
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
export const uptadeSubServicesImage = authActionClient
  .inputSchema(imageSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { imageId, id } = parsedInput;

      const existingData = await db.subServices.findFirst({
        where: { id: id },
        select: { id: true, imageId: true, imageUrl: FILE_SELECT },
      });
      if (!existingData) {
        throw new Error("Service not found");
      }

      return db.$transaction(async (prisma) => {
        await publishSingleFile(
          { newFileId: imageId, previousFileId: existingData.imageId },
          prisma,
        );
        await revalidateAll(CACHE_TAG_GROUPS.SUB_SERVICES);
        return (prisma as typeof db).subServices.update({
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
export const updateSubServicesGallery = authActionClient
  .inputSchema(gallerySchema)
  .action(async ({ parsedInput }) => {
    try {
      const { galleryIds, id } = parsedInput;
      const existingData = await db.subServices.findFirst({
        where: { id: id },
        select: { gallery: FILE_SELECT },
      });
      if (!existingData) {
        throw new Error("Service not found");
      }
      return db.$transaction(async (tx) => {
        await publishGalleryFiles(
          {
            newFileIds: galleryIds,
            previousFileIds: existingData.gallery.map((item) => item.id),
          },
          tx,
        );
        await revalidateAll(CACHE_TAG_GROUPS.SUB_SERVICES);
        return (tx as typeof db).subServices.update({
          where: { id: id },
          data: {
            gallery: { connect: galleryIds?.map((id) => ({ id: Number(id) })) },
          },
        });
      });
    } catch (error) {
      const errorMessage = (error as Error).message;
      throw new Error(`Internal Server Error - ${errorMessage}`);
    }
  });
export const deleteSubServices = authActionClient
  .inputSchema(idSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { id } = parsedInput;
      const existingData = await db.subServices.findUnique({
        where: { id: id },
        select: { id: true },
      });
      if (!existingData) {
        throw new Error("Service not found");
      }
      await db.subServices.update({
        where: { id: id },
        data: { isDeleted: true },
      });
      await revalidateAll(CACHE_TAG_GROUPS.SUB_SERVICES);
      return {
        message: "Service deleted successfully",
      };
    } catch (error) {
      const errorMessage = (error as Error).message;
      throw new Error(`Internal Server Error - ${errorMessage}`);
    }
  });

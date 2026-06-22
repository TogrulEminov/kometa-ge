"use server";
import { Prisma } from "@/generated/prisma/client";
import { Locales } from "@/generated/prisma/enums";
import { FILE_SELECT } from "@/helper/fragments";
import { db } from "@/lib/prisma";
import { authActionClient } from "@/lib/safe-action/SafeAction";
import { ZodError } from "zod";
import { createSlug } from "@/utils/createSlug";
import { publishGalleryFiles, publishSingleFile } from "@/helper/publishFiles";
import { formatZodErrors } from "@/utils/format-zod-errors";
import {
  gallerySchema,
  idSchema,
  imageSchema,
} from "@/app/(dashboard)/_type/global.type";
import { getNextOrderNumber } from "@/lib/order/getNextOrderNumber";
import {
  createCertificatesSchema,
  uptadeCertificatesSchema,
} from "./certificates.schema";
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
export async function getCertificates({
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

  const whereClause: Prisma.CertificatesWhereInput = {
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
    db.certificates.findMany({
      where: whereClause,
      select: {
        id: true,
        imageUrl: FILE_SELECT,
        gallery: FILE_SELECT,
        createdAt: true,
        orderNumber: true,
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
      orderBy: { orderNumber: "asc" },
      skip: skip,
      take: take,
    }),
    db.certificates.count({ where: whereClause }),
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
export async function getCertificatesById({ locale, id }: GetByIDProps) {
  try {
    const whereClause: Prisma.CertificatesWhereInput = {
      isDeleted: false,
      id,
      translations: {
        some: { locale },
      },
    };

    return db.certificates.findFirst({
      where: whereClause,
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        imageUrl: FILE_SELECT,
        gallery: FILE_SELECT,
        translations: {
          where: { locale },
          select: {
            id: true,
            title: true,
            description: true,
            slug: true,
            locale: true,
          },
        },
      },
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    throw new Error(`Internal Server Error - ${errorMessage}`);
  }
}
export const createCertificates = authActionClient
  .inputSchema(createCertificatesSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { title, description, locale, imageId, galleryIds } = parsedInput;
      const customSlug = createSlug(title);
      const existingData = await db.certificates.findFirst({
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
        const nextOrder = await getNextOrderNumber("certificates");
        if (galleryIds) {
          await publishGalleryFiles({ newFileIds: galleryIds }, prisma);
        }
        await revalidateAll(CACHE_TAG_GROUPS.CERTIFICATES);
        return prisma.certificates.create({
          data: {
            orderNumber: nextOrder,
            gallery: {
              connect: galleryIds?.map((id) => ({ id: Number(id) })),
            },
            imageId: imageId ? Number(imageId) : null,
            translations: {
              create: {
                title: title,
                locale: locale,
                slug: customSlug,
                description,
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
export const uptadeCertificates = authActionClient
  .inputSchema(uptadeCertificatesSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { title, description, locale, id } = parsedInput;

      const customSlug = createSlug(title);

      const finalSlug = customSlug;
      return db.$transaction(async (prisma) => {
        const updatedData = await prisma.certificates.update({
          where: { id: id },
          data: {
            translations: {
              upsert: {
                where: {
                  documentId_locale: { documentId: id!, locale },
                },
                create: {
                  title: title,
                  locale,
                  slug: finalSlug,
                  description,
                },
                update: {
                  title: title,
                  locale,
                  slug: finalSlug,
                  description,
                },
              },
            },
          },
        });
        await revalidateAll(CACHE_TAG_GROUPS.CERTIFICATES);
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
export const uptadeCertificatesImage = authActionClient
  .inputSchema(imageSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { imageId, id } = parsedInput;

      const existingData = await db.certificates.findUnique({
        where: { id: id },
        select: { imageId: true },
      });
      if (!existingData) {
        throw new Error("Photo gallery not found");
      }

      return db.$transaction(async (prisma) => {
        await publishSingleFile(
          { newFileId: imageId, previousFileId: existingData.imageId },
          prisma,
        );
        await revalidateAll(CACHE_TAG_GROUPS.CERTIFICATES);
        return (prisma as typeof db).certificates.update({
          where: { id: id },
          data: {
            imageId: Number(imageId),
          },
        });
      });
    } catch (error) {
      console.error("uptadeServicesImage error:", error);
      const errorMessage = (error as Error).message;
      throw new Error(`Internal Server Error - ${errorMessage}`);
    }
  });
export const updateCertificatesGallery = authActionClient
  .inputSchema(gallerySchema)
  .action(async ({ parsedInput }) => {
    try {
      const { galleryIds, id } = parsedInput;
      const existingData = await db.certificates.findFirst({
        where: { id: id },
        select: { gallery: FILE_SELECT },
      });
      if (!existingData) {
        throw new Error("Certificates not found");
      }
      return db.$transaction(async (tx) => {
        await publishGalleryFiles(
          {
            newFileIds: galleryIds,
            previousFileIds: existingData.gallery.map((item) => item.id),
          },
          tx,
        );
        await revalidateAll(CACHE_TAG_GROUPS.CERTIFICATES);
        return (tx as typeof db).certificates.update({
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
export const deleteCertificates = authActionClient
  .inputSchema(idSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { id } = parsedInput;
      const existingData = await db.certificates.findUnique({
        where: { id: id },
        select: { id: true },
      });
      if (!existingData) {
        throw new Error("Certificates not found");
      }
      await db.certificates.update({
        where: { id: id },
        data: { isDeleted: true },
      });
      await revalidateAll(CACHE_TAG_GROUPS.CERTIFICATES);
      return {
        message: "Certificates deleted successfully",
      };
    } catch (error) {
      const errorMessage = (error as Error).message;
      throw new Error(`Internal Server Error - ${errorMessage}`);
    }
  });

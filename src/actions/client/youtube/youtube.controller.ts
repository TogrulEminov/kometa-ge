"use server";
import { Prisma } from "@/generated/prisma/client";
import { Locales } from "@/generated/prisma/enums";
import { FILE_SELECT } from "@/helper/fragments";
import { db } from "@/lib/prisma";
import { authActionClient } from "@/lib/safe-action/SafeAction";
import { ZodError } from "zod";
import { createYoutubeSchema, uptadeYoutubeSchema } from "./youtube.schema";
import { createSlug } from "@/utils/createSlug";
import { formatZodErrors } from "@/utils/format-zod-errors";
import { idSchema, imageSchema } from "@/app/(dashboard)/_type/global.type";
import { publishSingleFile } from "@/helper/publishFiles";

type GetProps = {
  page?: number;
  query?: string;
  pageSize?: number;
  locale: Locales;
  sort?: string;
};
type GetByIDProps = {
  id: string;
  locale: Locales;
};

export async function getYoutube({
  page,
  pageSize,
  query,
  locale,
  sort = "desc",
}: GetProps) {
  const customPage = page || 1;
  const customPageSize = Math.min(Number(pageSize) || 12, 100);
  const skip = (customPage - 1) * customPageSize;
  const take = customPageSize;
  const searchTerm = query?.trim();

  try {
    const whereClause: Prisma.YoutubeWhereInput = {
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
      db.youtube.findMany({
        where: whereClause,
        select: {
          id: true,
          imageUrl: FILE_SELECT,
          url: true,
          createdAt: true,
          updatedAt: true,
          translations: {
            where: {
              locale: locale,
            },
            select: {
              slug: true,
              id: true,
              locale: true,
              title: true,
              documentId: true,
            },
          },
        },
        orderBy: { createdAt: (sort as Prisma.SortOrder) ?? "desc" },
        skip: skip,
        take: take,
      }),
      db.youtube.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(totalCount / customPageSize);
    return {
      success: true,
      code: "SUCCESS",
      message: "Success",
      data: totalCount < 1 ? [] : data,
      paginations: {
        page: customPage,
        pageSize: customPageSize,
        totalPages: totalPages,
        dataCount: totalCount,
      },
    };
  } catch (error) {
    console.error("getYoutube error:", error);
    const errorMessage = (error as Error).message;
    return {
      success: false,
      code: "SERVER_ERROR",
      error: `Internal Server Error - ${errorMessage}`,
    };
  }
}

export async function getYoutubeById({ locale, id }: GetByIDProps) {
  try {
    const whereClause: Prisma.YoutubeWhereInput = {
      isDeleted: false,
      id: id,
      translations: {
        some: { locale },
      },
    };
    const existingData = await db.youtube.findFirst({
      where: whereClause,
      include: {
        imageUrl: FILE_SELECT,
        translations: {
          where: { locale },
        },
      },
    });

    return { data: existingData };
  } catch (error) {
    console.error("getYoutubeById error:", error);
    const errorMessage = (error as Error).message;
    throw new Error(`Internal Server Error - ${errorMessage}`);
  }
}

export const createYoutube = authActionClient
  .inputSchema(createYoutubeSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { title, locale, imageId, url } = parsedInput;
      const custom_slug = createSlug(title);
      const existingData = await db.youtube.findFirst({
        where: {
          isDeleted: false,
          translations: {
            some: { locale: locale, slug: custom_slug },
          },
        },
      });
      if (existingData) {
        throw new Error("Data with this title and slug already exists");
      }

      const newData = await db.$transaction(async (prisma) => {
        await publishSingleFile({ newFileId: imageId }, prisma);
        return (prisma as typeof db).youtube.create({
          data: {
            imageId: Number(imageId) || null,
            url: url,
            translations: {
              create: {
                slug: custom_slug,
                title: title,
                locale: locale,
              },
            },
          },
        });
      });
      return newData;
    } catch (error) {
      console.error("createYoutube error:", error);
      if (error instanceof ZodError) {
        throw new Error(JSON.stringify(formatZodErrors(error)));
      }
      throw new Error("Məlumat yadda saxlanarkən xəta baş verdi");
    }
  });

export const updateYoutube = authActionClient
  .inputSchema(uptadeYoutubeSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { title, locale, url, id } = parsedInput;
      const existingData = await db.youtube.findUnique({
        where: {
          id: id,
          isDeleted: false,
        },
        include: {
          translations: true,
        },
      });
      if (!existingData) {
        throw new Error("Video tapılmadı");
      }

      const customSlug = createSlug(title);

      const updateData = await db.$transaction(async (prisma) => {
        const updatedData = await prisma.youtube.update({
          where: { id: id },
          data: {
            url: url,
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
          include: {
            translations: { where: { locale: locale } },
          },
        });

        return updatedData;
      });

      return updateData;
    } catch (error) {
      console.error("updateYoutube error:", error);
      const errorMessage = (error as Error).message;
      throw new Error(`Internal Server Error - ${errorMessage}`);
    }
  });

export const updateYoutubeImage = authActionClient
  .inputSchema(imageSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { imageId, id } = parsedInput;
      const existingData = await db.youtube.findUnique({
        where: { id: id, isDeleted: false },
      });
      if (!existingData) {
        throw new Error("Video tapılmadı");
      }
      await publishSingleFile({
        newFileId: imageId,
        previousFileId: existingData.imageId,
      });
      return db.youtube.update({
        where: { id: id },
        data: {
          imageId: Number(imageId),
        },
      });
    } catch (error) {
      console.error("updateYoutubeImage error:", error);
      const errorMessage = (error as Error).message;
      throw new Error(`Internal Server Error - ${errorMessage}`);
    }
  });
export const deleteYoutube = authActionClient
  .inputSchema(idSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { id } = parsedInput;
      const existingYoutube = await db.youtube.findUnique({
        where: { id: id, isDeleted: false },
      });
      if (!existingYoutube) {
        throw new Error("Date not found");
      }
      await db.categories.update({
        where: { id: id },
        data: { isDeleted: true },
      });
      return {
        message: "Date deleted successfully",
      };
    } catch (error) {
      const errorMessage = (error as Error).message;
      throw new Error(`Internal Server Error - ${errorMessage}`);
    }
  });

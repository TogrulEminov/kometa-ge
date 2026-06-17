"use server";
import { ZodError } from "zod";
import {
  createCategorySchema,
  uptadeCategorySchema,
} from "@/actions/client/categories/category.schema";
import { Locales } from "@/generated/prisma/enums";
import { Prisma } from "@/generated/prisma/client";
import { FILE_SELECT } from "@/helper/fragments";
import { publishSingleFile } from "@/helper/publishFiles";
import { db } from "@/lib/prisma";
import { authActionClient } from "@/lib/safe-action/SafeAction";
import { imageSchema } from "@/app/(dashboard)/_type/global.type";
import { Category } from "@/services/interface/type";
type GetProps = {
  page: number;
  query: string;
  pageSize: number;
  locale: Locales;
};
type GetByIDProps = {
  id: string;
  locale: Locales;
};

type GetCategoriesResult = {
  message: string;
  data: Category[];
  paginations: {
    page: number;
    pageSize: number;
    totalPages: number;
    dataCount: number;
  };
};

export async function getCategories({
  page,
  pageSize,
  query,
  locale,
}: GetProps): Promise<GetCategoriesResult> {
  const customPageSize = Number(pageSize) || Number(12);
  const skip = 0;
  const take = Number(page) * customPageSize;
  const searchTerm = query?.trim();

  const whereClause: Prisma.CategoriesWhereInput = {
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
    db.categories.findMany({
      where: whereClause,
      select: {
        id: true,
        imageUrl: FILE_SELECT,
        createdAt: true,
        updatedAt: true,
        slug: true,
        translations: {
          where: {
            locale: locale,
          },
          select: {
            id: true,
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
    db.categories.count({ where: whereClause }),
  ]);
  const totalPages = Math.ceil(totalCount / customPageSize);
  return {
    message: "Success",
    data: totalCount < 1 ? [] : data,
    paginations: {
      page,
      pageSize: customPageSize,
      totalPages: totalPages,
      dataCount: totalCount,
    },
  };
}

export async function getCategoriesById({ locale, id }: GetByIDProps) {
  try {
    const whereClause: Prisma.CategoriesWhereInput = {
      isDeleted: false,
      id: id,
    };

    const category = await db.categories.findFirst({
      where: whereClause,
      include: {
        imageUrl: {
          select: {
            id: true,
            publicUrl: true,
            fileKey: true,
          },
        },
        translations: {
          where: { locale },
          include: {
            seo: {
              include: {
                imageUrl: {
                  select: {
                    id: true,
                    publicUrl: true,
                    fileKey: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!category) {
      return { message: "Category not found", code: "NOT_FOUND" };
    }
    return { data: category };
  } catch (error) {
    const errorMessage = (error as Error).message;
    return { message: `Internal Server Error - ${errorMessage}` };
  }
}
export const createCategory = authActionClient
  .inputSchema(createCategorySchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      const {
        title,
        description,
        slug,
        metaTitle,
        metaDescription,
        metaKeywords,
        locale,
        imageId,
      } = parsedInput;

      const existingData = await db.categories.findFirst({
        where: {
          slug: slug,
          isDeleted: false,
          translations: {
            some: { locale: locale },
          },
        },
      });
      if (existingData) {
        throw new Error("Data with this title and slug already exists");
      }

      const newData = await db.$transaction(async (tx) => {
        if (imageId) {
          await publishSingleFile({ newFileId: imageId }, tx);
        }

        return (tx as typeof db).categories.create({
          data: {
            imageId: imageId ? Number(imageId) : null,
            slug: slug,
            translations: {
              create: {
                title: title,
                description: JSON.stringify(description),
                locale: locale,
                seo: {
                  create: {
                    metaTitle: metaTitle || "",
                    metaDescription: metaDescription || "",
                    metaKeywords: metaKeywords || "",
                    imageId: imageId ? Number(imageId) : null,
                    locale: locale,
                  },
                },
              },
            },
          },
        });
      });

      return {
        data: newData,
        message: "Data created successfully",
      };
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Record<string, string[]> = {};

        error.issues.forEach((err) => {
          const path = err.path.join(".");
          if (!fieldErrors[path]) {
            fieldErrors[path] = [];
          }
          fieldErrors[path].push(err.message);
        });

        return {
          success: false,
          error: "Məlumatlar düzgün deyil",
          errors: fieldErrors,
          code: "VALIDATION_ERROR",
        };
      }
      return {
        success: false,
        code: "SERVER_ERROR",
        error: "Məlumat yadda saxlanarkən xəta baş verdi",
      };
    }
  });

export const uptadeCategory = authActionClient
  .inputSchema(uptadeCategorySchema)
  .action(async ({ parsedInput }) => {
    try {
      const {
        title,
        description,
        slug,
        metaTitle,
        metaDescription,
        metaKeywords,
        locale,
        id,
      } = parsedInput;
      const existingCategory = await db.categories.findUnique({
        where: {
          id: id,
          isDeleted: false,
        },
        include: {
          translations: true,
        },
      });
      if (!existingCategory) {
        throw new Error("Category not found");
      }

      const uptadeData = await db.$transaction(async (prisma: any) => {
        const updatedData = await prisma.categories.update({
          where: { documentId: id },
          data: {
            slug: slug || existingCategory.slug,
            translations: {
              upsert: {
                where: {
                  documentId_locale: { documentId: id, locale },
                },
                create: {
                  title: title,
                  description: JSON.stringify(description),
                  locale,

                  seo: {
                    create: {
                      metaTitle: metaTitle ?? "",
                      metaDescription: metaDescription ?? "",
                      metaKeywords: metaKeywords ?? "",
                      locale,
                    },
                  },
                },
                update: {
                  title,
                  description: JSON.stringify(description),
                  seo: {
                    upsert: {
                      create: {
                        metaTitle: metaTitle ?? "",
                        metaDescription: metaDescription ?? "",
                        metaKeywords: metaKeywords ?? "",
                        locale,
                      },
                      update: { metaTitle, metaDescription, metaKeywords },
                    },
                  },
                },
              },
            },
          },
          include: {
            translations: { where: { locale: locale }, include: { seo: true } },
          },
        });

        return updatedData;
      });

      return { success: true, data: uptadeData, code: "Success" };
    } catch (error) {
      const errorMessage = (error as Error).message;
      throw new Error(`Internal Server Error - ${errorMessage}`);
    }
  });

export const uptadeCategoryImage = authActionClient
  .inputSchema(imageSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { imageId, id } = parsedInput;
      const existingData = await db.categories.findUnique({
        where: { id: id, isDeleted: false },
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

        return (tx as typeof db).categories.update({
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

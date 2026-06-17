"use server";
import { ZodError } from "zod";
import { db } from "../../../lib/admin/prismaClient";
import { createSlug } from "@/src/lib/slugifyHelper";
import {
  createSectionContentSchema,
  uptadeSectionContentSchema,
} from "@/src/actions/client/section/section.schema";
import { Prisma } from "@/src/generated/prisma/browser";
import { CustomLocales } from "@/src/services/interface";
import { authActionClient } from "@/src/lib/safe-action";
type GetProps = {
  page: number;
  query: string;
  pageSize: number;
  locale: CustomLocales;
};
type GetByIDProps = {
  id: string;
  locale: CustomLocales;
};
export async function getSectionContent({
  page,
  pageSize,
  query,
  locale,
}: GetProps) {
  const customPageSize = Number(pageSize) || Number(12);
  const skip = 0;
  const take = Number(page) * customPageSize;
  const searchTerm = query?.trim();
  const whereClause: Prisma.SectionContentWhereInput = {
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
    db.sectionContent.findMany({
      where: whereClause,
      select: {
        status: true,
        key: true,
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
            subTitle: true,
            documentId: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: skip,
      take: take,
    }),
    db.sectionContent.count({ where: whereClause }),
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
export async function getSectionContentById({ locale, id }: GetByIDProps) {
  try {
    const whereClause: Prisma.SectionContentWhereInput = {
      isDeleted: false,
      id: id,
      translations: {
        some: { locale },
      },
    };

    const existingData = await db.sectionContent.findFirst({
      where: whereClause,
      include: {
        translations: {
          where: { locale },
        },
      },
    });

    return { data: existingData };
  } catch (error) {
    const errorMessage = (error as Error).message;
    throw new Error(`Internal Server Error - ${errorMessage}`);
  }
}

export const createSectionContent = authActionClient
  .inputSchema(createSectionContentSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { title, description, locale, key } = parsedInput;

      const customSlug = createSlug(title);
      const existingData = await db.sectionContent.findFirst({
        where: {
          isDeleted: false,
          key,
          translations: {
            some: { locale: locale, slug: customSlug },
          },
        },
      });
      if (existingData) {
        throw new Error("Data with this title and key already exists");
      }

      const newData = await db.sectionContent.create({
        data: {
          key,
          translations: {
            create: {
              title: title,
              slug: customSlug,
              description: description ?? "",
              locale: locale,
            },
          },
        },
      });
      return newData;
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

        throw new Error(JSON.stringify(fieldErrors));
      }
      throw new Error("Məlumat yadda saxlanarkən xəta baş verdi");
    }
  });

export const uptadeSectionContent = authActionClient
  .inputSchema(uptadeSectionContentSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { title, description, key, id, locale, highlightWord, subTitle } =
        parsedInput;
      const existingData = await db.sectionContent.findUnique({
        where: {
          id: id,
          isDeleted: false,
        },
        include: {
          translations: true,
        },
      });
      if (!existingData) {
        throw new Error("Data not found");
      }

      const customSlug = createSlug(title);
      const uptadeData = await db.$transaction(async (prisma: any) => {
        const updatedData = await prisma.sectionContent.update({
          where: { documentId: id },
          data: {
            key,
            translations: {
              upsert: {
                where: {
                  documentId_locale: {
                    documentId: id,
                    locale,
                  },
                },
                create: {
                  title: title,
                  description: description ?? "",
                  locale,
                  slug: customSlug,
                  highlightWord,
                  subTitle,
                },
                update: {
                  title,
                  description,
                  slug: customSlug,
                  highlightWord,
                  subTitle,
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
      return uptadeData;
    } catch (error) {
      const errorMessage = (error as Error).message;
      throw new Error(`Internal Server Error - ${errorMessage}`);
    }
  });

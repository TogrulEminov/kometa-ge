// src/actions/branches.action.ts
"use server";
import { ZodError } from "zod";
import { db } from "../../../lib/admin/prismaClient";
import { Prisma } from "@/src/generated/prisma/client";
import { Locales } from "@/src/generated/prisma/enums";
import { createBranchSchema, updateBranchSchema } from "./branches.schema";
import { authActionClient } from "@/src/lib/safe-action";
import { idSchema } from "@/src/services/global/global.type";

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
export async function getBranches({ page, pageSize, query, locale }: GetProps) {
  const customPage = page || 1;
  const customPageSize = Math.min(Number(pageSize) || 12, 100);
  const skip = (customPage - 1) * customPageSize;
  const take = customPageSize;
  const searchTerm = query?.trim();

  const whereClause: Prisma.BranchWhereInput = {
    isDeleted: false,
    translations: {
      some: {
        locale: locale,
        ...(searchTerm && {
          countryName: {
            contains: searchTerm,
            mode: "insensitive",
          },
        }),
      },
    },
  };

  const [data, totalCount] = await Promise.all([
    db.branch.findMany({
      where: whereClause,
      select: {
        status: true,
        id: true,
        isoCode: true,
        createdAt: true,
        updatedAt: true,
        translations: {
          where: {
            locale: locale,
          },
          select: {
            id: true,
            locale: true,
            countryName: true,
            documentId: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: skip,
      take: take,
    }),
    db.branch.count({ where: whereClause }),
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
export async function getBranchById({ locale, id }: GetByIDProps) {
  try {
    const whereClause: Prisma.BranchWhereInput = {
      isDeleted: false,
      id: id,
    };
    const branch = await db.branch.findFirst({
      where: whereClause,
      include: {
        translations: {
          where: { locale },
        },
      },
    });

    if (!branch) {
      throw new Error("Branch not found");
    }

    return { data: branch };
  } catch (error) {
    const errorMessage = (error as Error).message;
    throw new Error(`Internal Server Error - ${errorMessage}`);
  }
}
export const createBranch = authActionClient
  .inputSchema(createBranchSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { isoCode, countryName, status, locale } = parsedInput;
      const existingBranch = await db.branch.findFirst({
        where: {
          isoCode: isoCode,
          isDeleted: false,
        },
      });

      if (existingBranch) {
        throw new Error("Branch with this ISO code already exists");
      }

      const newBranch = await db.branch.create({
        data: {
          isoCode: isoCode,
          status: status || "ACTIVE",
          translations: {
            create: {
              countryName: countryName,
              locale: locale,
            },
          },
        },
        include: {
          translations: true,
        },
      });

      return {
        data: newBranch,
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

        throw new Error(JSON.stringify(fieldErrors));
      }
      throw new Error("Məlumat yadda saxlanarkən xəta baş verdi");
    }
  });
export const updateBranch = authActionClient
  .inputSchema(updateBranchSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { countryName, status, locale, id } = parsedInput;

      const updatedBranch = await db.$transaction(async (prisma) => {
        const updated = await prisma.branch.update({
          where: { id: id },
          data: {
            status: status,
            translations: {
              upsert: {
                where: {
                  documentId_locale: { documentId: id!, locale },
                },
                create: {
                  countryName: countryName!,
                  locale,
                },
                update: {
                  countryName,
                },
              },
            },
          },
          include: {
            translations: { where: { locale: locale } },
          },
        });

        return updated;
      });

      return updatedBranch;
    } catch (error) {
      const errorMessage = (error as Error).message;
      throw new Error(`Internal Server Error - ${errorMessage}`);
    }
  });
export const deleteBranch = authActionClient
  .inputSchema(idSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { id } = parsedInput;
      const existingBranch = await db.branch.findUnique({
        where: { id: id, isDeleted: false },
      });

      if (!existingBranch) {
        throw new Error("Branch not found");
      }

      await db.branch.update({
        where: { id: id },
        data: { isDeleted: true },
      });
      return {
        message: "Branch deleted successfully",
      };
    } catch (error) {
      const errorMessage = (error as Error).message;
      throw new Error(`Internal Server Error - ${errorMessage}`);
    }
  });

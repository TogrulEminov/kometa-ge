"use server";
import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/prisma";
import { authActionClient } from "@/lib/safe-action/SafeAction";
import { CustomLocales } from "@/services/interface/type";
import { ZodError } from "zod";
import { createOfficeSchema, updateOfficeSchema } from "./offices.schema";
import { idSchema } from "@/app/(dashboard)/_type/global.type";
import { getNextOrderNumber } from "@/lib/order/getNextOrderNumber";
import { revalidateAll } from "@/helper/revalidate";
import { CACHE_TAG_GROUPS } from "@/actions/ui/cachetags";
type GetProps = {
  page?: number;
  query?: string;
  pageSize?: number;
  locale: CustomLocales;
};
type GetByIDProps = {
  id: string;
  locale: CustomLocales;
};
export async function getOffices({ page, pageSize, query, locale }: GetProps) {
  const customPage = page || 1;
  const customPageSize = Math.min(Number(pageSize) || 12, 100);
  const skip = (customPage - 1) * customPageSize;
  const take = customPageSize;
  const searchTerm = query?.trim();

  const whereClause: Prisma.OfficeWhereInput = {
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
    db.office.findMany({
      where: whereClause,
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        orderNumber: true,
        branchId: true,
        type: true,
        branch: {
          select: {
            id: true,
            isoCode: true,
          },
        },
        translations: {
          where: {
            locale: locale,
          },
          select: {
            id: true,
            locale: true,
            address: true,
            city: true,
          },
        },
      },
      orderBy: { orderNumber: "asc" },
      skip: skip,
      take: take,
    }),
    db.office.count({ where: whereClause }),
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
export async function getOfficeById({ locale, id }: GetByIDProps) {
  try {
    const whereClause: Prisma.OfficeWhereInput = {
      isDeleted: false,
      id: id,
    };

    return db.office.findFirst({
      where: whereClause,
      include: {
        branch: {
          select: {
            id: true,
            isoCode: true,
          },
        },

        translations: {
          where: { locale },
        },
      },
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    throw new Error(`Internal Server Error - ${errorMessage}`);
  }
}
export const createOffice = authActionClient
  .inputSchema(createOfficeSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { branchId, city, address, type, locale } = parsedInput;

      const existingBranch = await db.office.findFirst({
        where: {
          isDeleted: false,
          translations: {
            some: {
              city,
              locale,
            },
          },
        },
      });

      if (existingBranch) {
        throw new Error("Office with this city already exists");
      }

      const orderNumber = await getNextOrderNumber("office");
      await revalidateAll(CACHE_TAG_GROUPS.ABOUT_MAIN);
      return db.office.create({
        data: {
          orderNumber: orderNumber,
          branchId: branchId,
          type: type || "office",
          translations: {
            create: {
              locale: locale,
              city: city,
              address: address,
            },
          },
        },
        include: {
          translations: true,
        },
      });
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
export const updateOffice = authActionClient
  .inputSchema(updateOfficeSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { city, address, type, locale, id, branchId } = parsedInput;

      return db.$transaction(async (prisma) => {
        await revalidateAll(CACHE_TAG_GROUPS.ABOUT_MAIN);
        return prisma.office.update({
          where: { id: id },
          data: {
            type: type || "office",
            branchId: branchId,
            translations: {
              upsert: {
                where: {
                  documentId_locale: { documentId: id!, locale },
                },
                create: {
                  address,
                  city,
                  locale,
                },
                update: {
                  address,
                  city,
                  locale,
                },
              },
            },
          },
        });
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Record<string, string[]> = {};
        error.issues.forEach((err) => {
          const path = err.path.join(".");
          if (!fieldErrors[path]) fieldErrors[path] = [];
          fieldErrors[path].push(err.message);
        });
        throw new Error(JSON.stringify(fieldErrors));
      }
      throw new Error("Məlumat yadda saxlanarkən xəta baş verdi");
    }
  });
export const deleteOffice = authActionClient
  .inputSchema(idSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { id } = parsedInput;
      const existingOffice = await db.office.findUnique({
        where: { id: id, isDeleted: false },
      });

      if (!existingOffice) {
        throw new Error("Office not found");
      }
      await revalidateAll(CACHE_TAG_GROUPS.ABOUT_MAIN);
      await db.office.update({
        where: { id: id },
        data: { isDeleted: true },
      });
      return {
        message: "Office deleted successfully",
      };
    } catch (error) {
      const errorMessage = (error as Error).message;
      throw new Error(`Internal Server Error - ${errorMessage}`);
    }
  });

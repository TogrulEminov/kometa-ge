"use server";
import { ZodError } from "zod";
import { db } from "../../../lib/admin/prismaClient";
import {
  createSocialSchema,
  updateSocialSchema,
} from "@/src/actions/client/socials/social.schema";
import { Status } from "@/src/generated/prisma/enums";
import { Prisma } from "@/src/generated/prisma/client";
import { authActionClient } from "@/src/lib/safe-action";
import { idSchema } from "@/src/services/global/global.type";

type GetProps = {
  page?: number;
  query?: string;
  pageSize?: number;
  status?: Status;
};

type GetByIDProps = {
  id: string;
};
export async function getSocials({
  page = 1,
  pageSize = 12,
  query,
  status,
}: GetProps) {
  try {
    const customPage = page || 1;
    const customPageSize = Number(pageSize) || 12;
    const skip = (customPage - 1) * customPageSize;
    const take = customPageSize;
    const searchTerm = query?.trim();

    const whereClause: Prisma.SocialWhereInput = searchTerm
      ? {
          OR: [
            { socialName: { contains: searchTerm, mode: "insensitive" } },
            { socialLink: { contains: searchTerm, mode: "insensitive" } },
          ],
        }
      : {};

    const [data, totalCount] = await Promise.all([
      db.social.findMany({
        where: {
          ...whereClause,
          status: status,
        },
        orderBy: { createdAt: "asc" },
        skip: skip,
        take: take,
      }),
      db.social.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(totalCount / customPageSize);

    return {
      success: true,
      code: "SUCCESS",
      message: "Socials fetched successfully",
      data: data,
      paginations: {
        page: customPage,
        pageSize: customPageSize,
        totalPages: totalPages,
        dataCount: totalCount,
      },
    };
  } catch (error) {
    const errorMessage = (error as Error).message;
    return {
      success: false,
      code: "SERVER_ERROR",
      error: `Internal Server Error - ${errorMessage}`,
    };
  }
}
export async function getSocialById({ id }: GetByIDProps) {
  try {
    const existingData = await db.social.findUnique({
      where: {
        id: id,
      },
    });
    return {
      data: existingData,
    };
  } catch (error) {
    const errorMessage = (error as Error).message;
    throw new Error(`Internal Server Error - ${errorMessage}`);
  }
}

export const createSocial = authActionClient
  .inputSchema(createSocialSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { socialName, socialLink, iconName, status } = parsedInput;
      const existingSocialName = await db.social.findUnique({
        where: { socialName: socialName! },
      });

      if (existingSocialName) {
        throw new Error("Bu adda sosial şəbəkə artıq mövcuddur");
      }
      const existingSocialLink = await db.social.findUnique({
        where: { socialLink: socialLink! },
      });

      if (existingSocialLink) {
        throw new Error("Bu link artıq mövcuddur");
      }

      const newData = await db.social.create({
        data: {
          socialName,
          socialLink,
          iconName,
          status: status || Status.published,
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
      const errorMessage = (error as Error).message;
      throw new Error(
        `Məlumat yadda saxlanarkən xəta baş verdi - ${errorMessage}`,
      );
    }
  });
export const updateSocial = authActionClient
  .inputSchema(updateSocialSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { socialName, socialLink, iconName, status, id } = parsedInput;

      const existingData = await db.social.findUnique({
        where: { id: id },
      });
      if (socialName && socialName !== existingData?.socialName) {
        const duplicateName = await db.social.findUnique({
          where: { socialName },
        });

        if (duplicateName) {
          throw new Error("Bu adda sosial şəbəkə artıq mövcuddur");
        }
      }

      if (socialLink && socialLink !== existingData?.socialLink) {
        const duplicateLink = await db.social.findUnique({
          where: { socialLink },
        });

        if (duplicateLink) {
          throw new Error("Bu link artıq mövcuddur");
        }
      }

      const updatedData = await db.social.update({
        where: { id: id },
        data: {
          ...(socialName && { socialName }),
          ...(socialLink && { socialLink }),
          ...(iconName && { iconName }),
          ...(status && { status }),
        },
      });
      return updatedData;
    } catch (error) {
      const errorMessage = (error as Error).message;
      throw new Error(`Internal Server Error - ${errorMessage}`);
    }
  });
export const deleteSocial = authActionClient
  .inputSchema(idSchema)
  .action(async ({ parsedInput }) => {
    try {
      const existingData = await db.social.findUnique({
        where: { id: parsedInput.id },
      });

      if (!existingData) {
        throw new Error("Sosial şəbəkə tapılmadı");
      }

      await db.social.delete({
        where: { id: parsedInput.id },
      });
      return {
        message: "Sosial şəbəkə uğurla silindi",
      };
    } catch (error) {
      const errorMessage = (error as Error).message;
      throw new Error(`Internal Server Error - ${errorMessage}`);
    }
  });
export const toggleSocialStatus = authActionClient
  .inputSchema(idSchema)
  .action(async ({ parsedInput }) => {
    try {
      const existingData = await db.social.findUnique({
        where: { id: parsedInput.id },
      });

      if (!existingData) {
        throw new Error("Sosial şəbəkə tapılmadı");
      }

      const newStatus =
        existingData.status === Status.published
          ? Status.draft
          : Status.published;

      const updatedData = await db.social.update({
        where: { id: parsedInput.id },
        data: { status: newStatus },
      });
      return updatedData;
    } catch (error) {
      const errorMessage = (error as Error).message;
      throw new Error(`Internal Server Error - ${errorMessage}`);
    }
  });

"use server";

import { z } from "zod";
import { FormStatus, FormType } from "@/generated/prisma/enums";
import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/prisma";
import { adminAction, authActionClient } from "@/lib/safe-action/SafeAction";

const listSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().max(100).optional().default(20),
  query: z.string().optional(),
  type: z.nativeEnum(FormType).optional(),
  status: z.nativeEnum(FormStatus).optional(),
});

const updateStatusSchema = z.object({
  id: z.string().cuid(),
  status: z.nativeEnum(FormStatus),
});

type ListInput = z.infer<typeof listSchema>;

export async function getFormSubmissions(input: ListInput) {
  const { page, pageSize, query, type, status } = listSchema.parse(input);
  const skip = (page - 1) * pageSize;
  const searchTerm = query?.trim();

  const where: Prisma.FormSubmissionWhereInput = {
    ...(type && { type }),
    ...(status && { status }),
    ...(searchTerm && {
      OR: [
        { ipAddress: { contains: searchTerm, mode: "insensitive" } },
        {
          payload: {
            path: ["email"],
            string_contains: searchTerm,
          },
        },
        {
          payload: {
            path: ["name"],
            string_contains: searchTerm,
          },
        },
        {
          payload: {
            path: ["telephone"],
            string_contains: searchTerm,
          },
        },
        {
          payload: {
            path: ["phone"],
            string_contains: searchTerm,
          },
        },
      ],
    }),
  };

  const [data, totalCount] = await Promise.all([
    db.formSubmission.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    db.formSubmission.count({ where }),
  ]);

  return {
    success: true,
    data,
    paginations: {
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
      dataCount: totalCount,
    },
  };
}

export async function getFormSubmissionById(id: string) {
  return db.formSubmission.findUnique({ where: { id } });
}

export const updateFormSubmissionStatus = authActionClient
  .inputSchema(updateStatusSchema)
  .action(async ({ parsedInput }) => {
    const updated = await db.formSubmission.update({
      where: { id: parsedInput.id },
      data: { status: parsedInput.status },
    });

    return { success: true, data: updated };
  });

export const deleteFormSubmission = adminAction
  .inputSchema(z.object({ id: z.string().cuid() }))
  .action(async ({ parsedInput }) => {
    await db.formSubmission.delete({ where: { id: parsedInput.id } });
    return { success: true, message: "Message deleted" };
  });

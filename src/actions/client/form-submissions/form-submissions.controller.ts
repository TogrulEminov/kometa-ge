"use server";

import { z } from "zod";
import { FormType } from "@/generated/prisma/enums";
import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/prisma";
import { authActionClient } from "@/lib/safe-action/SafeAction";

const listSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().max(100).optional().default(20),
  query: z.string().optional(),
  type: z.nativeEnum(FormType).optional(),
});

type ListInput = z.infer<typeof listSchema>;

export async function getFormSubmissions(input: ListInput) {
  const { page, pageSize, query, type } = listSchema.parse(input);
  const skip = (page - 1) * pageSize;
  const searchTerm = query?.trim();

  const where: Prisma.FormSubmissionWhereInput = {
    ...(type && { type }),
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

export const deleteFormSubmission = authActionClient
  .inputSchema(z.object({ id: z.string().cuid() }))
  .action(async ({ parsedInput }) => {
    await db.formSubmission.delete({ where: { id: parsedInput.id } });
    return { success: true, message: "Message deleted" };
  });

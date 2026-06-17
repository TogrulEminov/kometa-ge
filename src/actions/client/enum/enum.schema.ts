import { EnumKey } from "@/src/generated/prisma/enums";
import { idSchema, localeSchema } from "@/src/services/global/global.type";
import z from "zod";
export const createEnumSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().nullable().optional(),
    key: z.enum(EnumKey).nullish(),
  })
  .merge(localeSchema);
export const uptadeEnumSchema = createEnumSchema.merge(idSchema);
export type CreateEnumInput = z.infer<typeof createEnumSchema>;
export type UpdateEnumInput = z.infer<typeof uptadeEnumSchema>;

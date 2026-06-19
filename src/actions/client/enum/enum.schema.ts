import { idSchema, localeSchema } from "@/app/(dashboard)/_type/global.type";
import { EnumKey } from "@/generated/prisma/enums";
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

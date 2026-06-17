import {
  idSchema,
  imageSchema,
  localeSchema,
  metaInformationSchema,
} from "@/app/(dashboard)/_type/global.type";
import z from "zod";

export const createCategorySchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "A slug is required"),
    description: z.string().nullable().optional(),
  })
  .merge(metaInformationSchema)
  .merge(localeSchema)
  .merge(idSchema)
  .merge(imageSchema);

export const uptadeCategorySchema = createCategorySchema.merge(idSchema);

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof uptadeCategorySchema>;

import { idSchema, localeSchema } from "@/src/services/global/global.type";
import z from "zod";

export const createSectionContentSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    highlightWord: z.string().optional(),
    subTitle: z.string().optional(),
    key: z.string().nullish(),
  })
  .merge(localeSchema);

export const uptadeSectionContentSchema =
  createSectionContentSchema.merge(idSchema);

export type CreateSectionContentInput = z.infer<
  typeof createSectionContentSchema
>;
export type UpdateSectionContentInput = z.infer<
  typeof uptadeSectionContentSchema
>;

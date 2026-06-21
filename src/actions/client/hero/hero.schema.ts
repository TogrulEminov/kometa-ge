import {
  idSchema,
  imageSchema,
  localeSchema,
} from "@/app/(dashboard)/_type/global.type";
import z from "zod";

export const upsertHeroInfoSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    subTitle: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    serviceId: z
      .string()
      .nullable()
      .optional()
      .transform((value) => (value?.trim() ? value.trim() : null)),
  })
  .merge(localeSchema);

export const videoSchema = z
  .object({
    videoId: z.number().nullable().optional(),
  })
  .merge(idSchema);
export type UpdateVideoInput = z.infer<typeof videoSchema>;
export type UpsertHeroInfoInput = z.input<typeof upsertHeroInfoSchema>;
export type UpsertHeroInfoParsed = z.infer<typeof upsertHeroInfoSchema>;

import {
  idSchema,
  imageSchema,
  localeSchema,
} from "@/app/(dashboard)/_type/global.type";
import z from "zod";

export const createYoutubeSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    url: z.string().min(1, "Youtube link is required"),
  })
  .merge(localeSchema)
  .merge(imageSchema);

export const uptadeYoutubeSchema = createYoutubeSchema
  .merge(localeSchema)
  .merge(idSchema);

export type CreateYoutubeInput = z.infer<typeof createYoutubeSchema>;
export type UpdateYoutubeInput = z.infer<typeof uptadeYoutubeSchema>;

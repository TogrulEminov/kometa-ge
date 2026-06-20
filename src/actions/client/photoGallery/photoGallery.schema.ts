import {
  gallerySchema,
  idSchema,
  imageSchema,
  localeSchema,
} from "@/app/(dashboard)/_type/global.type";
import z from "zod";
export const createPhotoGallerySchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().nullable().optional(),
  })
  .merge(localeSchema)
  .merge(imageSchema)
  .merge(gallerySchema);

export const uptadePhotoGallerySchema =
  createPhotoGallerySchema.merge(idSchema);

export type CreatePhotoGalleryInput = z.infer<typeof createPhotoGallerySchema>;
export type UpdatePhotoGalleryInput = z.infer<typeof uptadePhotoGallerySchema>;

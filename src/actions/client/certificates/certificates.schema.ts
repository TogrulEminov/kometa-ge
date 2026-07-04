import {
  gallerySchema,
  idSchema,
  imageSchema,
  localeSchema,
} from "@/app/(dashboard)/_type/global.type";
import z from "zod";
export const createCertificatesSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().nullable().optional(),
  })
  .merge(localeSchema)
  .merge(imageSchema)
  .merge(gallerySchema);

export const uptadeCertificatesSchema =
  createCertificatesSchema.merge(idSchema);

export type CreateCertificatesInput = z.infer<typeof createCertificatesSchema>;
export type UpdateCertificatesInput = z.infer<typeof uptadeCertificatesSchema>;

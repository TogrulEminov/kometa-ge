import { gallerySchema, idSchema, imageSchema, localeSchema, metaInformationSchema, newInfoJsonSchema } from "@/app/(dashboard)/_type/global.type";
import z from "zod";
export const createServiceSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().nullable().optional(),
    description: z.array(newInfoJsonSchema).optional(),
  })
  .merge(localeSchema)
  .merge(imageSchema)
  .merge(gallerySchema)
  .merge(metaInformationSchema);

export const uptadeServiceSchema = createServiceSchema.merge(idSchema);

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof uptadeServiceSchema>;

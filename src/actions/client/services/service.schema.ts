import {
  gallerySchema,
  idSchema,
  imageSchema,
  localeSchema,
  metaInformationSchema,
  newInfoJsonSchema,
} from "@/src/services/global/global.type";
import z from "zod";
export const createServiceSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.array(newInfoJsonSchema).optional(),
    subDescription: z.string().optional(),
    highlight: z.string().optional(),
    enumId: z.string().min(1, "Position is required"),
  })
  .merge(localeSchema)
  .merge(imageSchema)
  .merge(gallerySchema)
  .merge(metaInformationSchema);

export const uptadeServiceSchema = createServiceSchema.merge(idSchema);

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof uptadeServiceSchema>;

import {
  gallerySchema,
  idSchema,
  imageSchema,
  localeSchema,
  metaInformationSchema,
  newInfoJsonSchema,
} from "@/app/(dashboard)/_type/global.type";
import z from "zod";
export const createSubServiceSchema = z
  .object({
    iconsUrl: z.string().nullable().optional(),
    title: z.string().min(1, "Title is required"),
    slug: z.string().nullable().optional(),
    servicesId: z.string().nullable().optional(),
    description: z.array(newInfoJsonSchema).optional(),
    shortDescription: z.string().nullable().optional(),
  })
  .merge(localeSchema)
  .merge(imageSchema)
  .merge(gallerySchema)
  .merge(metaInformationSchema);

export const uptadeSubServiceSchema = createSubServiceSchema.merge(idSchema);

export type CreateSubServiceInput = z.infer<typeof createSubServiceSchema>;
export type UpdateSubServiceInput = z.infer<typeof uptadeSubServiceSchema>;

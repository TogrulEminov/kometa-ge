import {
  idSchema,
  imageSchema,
  localeSchema,
  metaInformationSchema,
  newInfoJsonSchema,
} from "@/app/(dashboard)/_type/global.type";
import z from "zod";
export const routeJsonSchema = z.object({
  from: z.string(),
  to: z.string(),
});
export const createDirectionsSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    navTitle: z.string().min(1, "Nav Title is required"),
    slug: z.string().nullable().optional(),
    shortDescription: z.string().nullable().optional(),
    route: routeJsonSchema,
    description: z.array(newInfoJsonSchema).optional(),
  })
  .merge(localeSchema)
  .merge(imageSchema)
  .merge(metaInformationSchema);

export const uptadeDirectionsSchema = createDirectionsSchema.merge(
  z.object({
    id: z.string().cuid("ID formatı düzgün deyil"),
  }),
);

export type CreateDirectionsInput = z.infer<typeof createDirectionsSchema>;
export type UpdateDirectionsInput = z.infer<typeof uptadeDirectionsSchema>;

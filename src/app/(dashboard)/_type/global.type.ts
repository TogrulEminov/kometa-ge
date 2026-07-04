import { Locales } from "@/generated/prisma/enums";
import { z } from "zod";
export const localeSchema = z.object({
  locale: z.enum(Locales),
});
 
export const idSchema = z.object({
  id: z.string().cuid("ID formatı düzgün deyil").optional(),
});
export const slugSchema = z.object({
  slug: z.string(),
});
export const paginationSchema = z
  .object({
    page: z.coerce.number().int().positive().min(1).optional().default(1),
    pageSize: z.coerce
      .number()
      .int()
      .positive()
      .min(1)
      .max(100)
      .optional()
      .default(25),
    query: z.string().optional().default(""),
  })
  .merge(localeSchema);

export const imageSchema = z
  .object({
    imageId: z.number().nullish().optional(),
  })
  .merge(idSchema);

export const countSchema = z.object({
  title: z.string().optional().nullable(),
  count: z.number().optional().nullable(),
  suffix: z.string().optional().nullable(),
});
export const jsonSchema = z.object({
  subTitle: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
});
export const metaInformationSchema = z.object({
  metaTitle: z.string().nullable().optional(),
  metaKeywords: z.string().nullable().optional(),
  metaDescription: z.string().nullable().optional(),
});

export const gallerySchema = z
  .object({
    galleryIds: z.array(z.number()).optional(),
  })
  .merge(idSchema);

export const jsonItemSchema = z
  .object({
    itemTitle: z.string().nullable().optional(),
    itemDescription: z.string().nullable().optional(),
  })
  .passthrough();

export const newInfoJsonSchema = z
  .object({
    title: z.string(),
    type: z.string().optional(),
    description: z.string().nullable().optional(),
    items: z.array(jsonItemSchema),
  })
  .passthrough();

export type JsonItem = {
  itemTitle?: string | null;
  itemDescription?: string | null;
} & Record<string, unknown>;
export type NewInfoJson = z.infer<typeof newInfoJsonSchema>;

export type PaginationInput = z.infer<typeof paginationSchema>;
export type LocalesInput = z.infer<typeof localeSchema>;
export type IdSchemaInput = z.infer<typeof idSchema>;
export type SlugSchemaInput = z.infer<typeof slugSchema>;
export type ImageSchemaInput = z.infer<typeof imageSchema>;
export type GallerySchemaInput = z.infer<typeof gallerySchema>;

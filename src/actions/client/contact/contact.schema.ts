import { localeSchema } from "@/src/services/global/global.type";
import z from "zod";
const contactJsonSchema = z.object({
  title: z.string().nullish(),
  description: z.string().nullish(),
  hightlightWord: z.string().nullable().optional(),
  about: z.string().nullable().optional(),
});
export const upsertContactSchema = z
  .object({
    phone: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
    latitude: z.string().nullable().optional(),
    longitude: z.string().nullable().optional(),
    info: contactJsonSchema,
    whatsapp: z.string().nullable().optional(),
    adressLink: z.string().optional(),
    adress: z.string().nullable().optional(),
  })
  .merge(localeSchema);

export type UpsertContactInput = z.infer<typeof upsertContactSchema>;

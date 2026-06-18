import { localeSchema } from "@/app/(dashboard)/_type/global.type";
import z from "zod";
 
export const upsertContactSchema = z
  .object({
    phone: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
    latitude: z.string().nullable().optional(),
    longitude: z.string().nullable().optional(),
    whatsapp: z.string().nullable().optional(),
    adressLink: z.string().optional(),
    adress: z.string().nullable().optional(),
  })
  .merge(localeSchema);

export type UpsertContactInput = z.infer<typeof upsertContactSchema>;

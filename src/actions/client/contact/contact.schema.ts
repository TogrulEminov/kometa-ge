import { localeSchema } from "@/app/(dashboard)/_type/global.type";
import z from "zod";

export const upsertContactSchema = z
  .object({
    phone: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
    latitude: z
      .union([z.string(), z.number()])
      .transform((val) => parseFloat(String(val)))
      .refine((val) => !isNaN(val), { message: "Düzgün ədəd daxil edin" })
      .refine((val) => val >= -90 && val <= 90, {
        message: "Latitude -90 ilə 90 arasında olmalıdır",
      }),

    longitude: z
      .union([z.string(), z.number()])
      .transform((val) => parseFloat(String(val)))
      .refine((val) => !isNaN(val), { message: "Düzgün ədəd daxil edin" })
      .refine((val) => val >= -180 && val <= 180, {
        message: "Longitude -180 ilə 180 arasında olmalıdır",
      }),
    whatsapp: z.string().nullable().optional(),
    adressLink: z.string().optional(),
    adress: z.string().nullable().optional(),
  })
  .merge(localeSchema);

export type UpsertContactInput = z.infer<typeof upsertContactSchema>;
export type UpsertContactFormValues = z.input<typeof upsertContactSchema>;
import { localeSchema } from "@/app/(dashboard)/_type/global.type";
import z from "zod";

function optionalCoordinate(min: number, max: number, rangeMessage: string) {
  return z
    .union([z.string(), z.number()])
    .optional()
    .nullable()
    .transform((val) => {
      if (val === "" || val === null || val === undefined) {
        return null;
      }

      const parsed = parseFloat(String(val));
      return Number.isNaN(parsed) ? Number.NaN : parsed;
    })
    .refine((val) => val === null || !Number.isNaN(val), {
      message: "Düzgün ədəd daxil edin",
    })
    .refine((val) => val === null || (val >= min && val <= max), {
      message: rangeMessage,
    });
}

export const upsertContactSchema = z
  .object({
    phone: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
    latitude: optionalCoordinate(-90, 90, "Latitude -90 ilə 90 arasında olmalıdır"),
    longitude: optionalCoordinate(
      -180,
      180,
      "Longitude -180 ilə 180 arasında olmalıdır",
    ),
    whatsapp: z.string().nullable().optional(),
    adressLink: z.string().optional(),
    adress: z.string().nullable().optional(),
  })
  .merge(localeSchema);

export type UpsertContactInput = z.infer<typeof upsertContactSchema>;
export type UpsertContactFormValues = z.input<typeof upsertContactSchema>;

import { idSchema } from "@/app/(dashboard)/_type/global.type";
import z from "zod";

export const createSocialSchema = z.object({
  socialName: z.string().nullable(),
  socialLink: z.string().nullable(),
  iconName: z.string().nullable(),
});

export const updateSocialSchema = createSocialSchema.merge(idSchema);

export type CreateSocialInput = z.infer<typeof createSocialSchema>;
export type UpdateSocialInput = z.infer<typeof updateSocialSchema>;

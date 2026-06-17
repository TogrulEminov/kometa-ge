import z from "zod";
import { Status } from "../../../generated/prisma/enums";
import { idSchema } from "@/src/services/global/global.type";

export const createSocialSchema = z.object({
  socialName: z.string().nullable(),
  socialLink: z.string().nullable(),
  iconName: z.string().nullable(),
  status: z.nativeEnum(Status).optional(),
});

export const updateSocialSchema = createSocialSchema.merge(idSchema);

export type CreateSocialInput = z.infer<typeof createSocialSchema>;
export type UpdateSocialInput = z.infer<typeof updateSocialSchema>;

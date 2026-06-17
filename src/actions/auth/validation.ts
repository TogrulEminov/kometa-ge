import * as zod from "zod";

export const loginValidation = zod.object({
  email: zod.email(),
  password: zod.string().min(1),
});
import z from "zod";

export const upsertUserSchema = z.object({
  name: z.string(),
  email: z.string(),
  id: z.string().optional(),
  role: z.enum(["admin", "moderator"]),
  password: z.string().min(8),
});

export const updateUserPasssword = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8),
});

export const userIdSchema = z.object({ id: z.string() });
export type UpsertUserSchemaInput = z.infer<typeof upsertUserSchema>;
export type UpdateUserPassSchemaInput = z.infer<typeof updateUserPasssword>;
export type LoginInput = zod.z.infer<typeof loginValidation>;
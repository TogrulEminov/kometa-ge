import * as zod from "zod";

export const loginValidation = zod.object({
  email: zod.email(),
  password: zod.string().min(1),
});
import z from "zod";

export const upsertUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  id: z.string().optional(),
  role: z.enum(["admin", "moderator"]),
  password: z.string().optional(),
});

export const createUserFormSchema = upsertUserSchema.refine(
  (data) => Boolean(data.password && data.password.length >= 8),
  {
    message: "Password must be at least 8 characters",
    path: ["password"],
  },
);

export const updateUserFormSchema = upsertUserSchema
  .extend({
    id: z.string(),
  })
  .omit({ password: true });

export const resetUserPasswordSchema = z.object({
  id: z.string(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const updateUserPasssword = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export const changePasswordFormSchema = updateUserPasssword
  .extend({
    confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const resetOwnPasswordFormSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const resetOwnPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const userIdSchema = z.object({ id: z.string() });
export type UpsertUserSchemaInput = z.infer<typeof upsertUserSchema>;
export type UpdateUserFormInput = z.infer<typeof updateUserFormSchema>;
export type ResetUserPasswordInput = z.infer<typeof resetUserPasswordSchema>;
export type UpdateUserPassSchemaInput = z.infer<typeof updateUserPasssword>;
export type ChangePasswordFormInput = z.infer<typeof changePasswordFormSchema>;
export type ResetOwnPasswordFormInput = z.infer<typeof resetOwnPasswordFormSchema>;
export type LoginInput = zod.z.infer<typeof loginValidation>;
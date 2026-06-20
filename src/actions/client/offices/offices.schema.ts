import { idSchema, localeSchema } from "@/app/(dashboard)/_type/global.type";
import z from "zod";
export const createOfficeSchema = z
  .object({
    city: z.string().min(1, "City is required"),
    address: z.string().nullable().optional(),
    type: z.enum(["office", "warehouse"]).optional(),
    branchId: z.string().min(1, "Branch is required"),
  })
  .merge(localeSchema);
export const updateOfficeSchema = createOfficeSchema.merge(idSchema);
export type CreateOfficeInput = z.infer<typeof createOfficeSchema>;
export type UpdateOfficeInput = z.infer<typeof updateOfficeSchema>;

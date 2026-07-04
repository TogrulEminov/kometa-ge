import { idSchema, localeSchema } from "@/app/(dashboard)/_type/global.type";
import z from "zod";
export const createBranchSchema = z
  .object({
    isoCode: z.string().min(1, "ISO code is required"),
    countryName: z.string().min(1, "Country name is required"),
    status: z.enum(["ACTIVE", "PLANNED"]).optional(),
  })
  .merge(localeSchema);
export const updateBranchSchema = createBranchSchema.merge(idSchema);
export type CreateBranchInput = z.infer<typeof createBranchSchema>;
export type UpdateBranchInput = z.infer<typeof updateBranchSchema>;

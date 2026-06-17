// src/schema/branch.schema.ts
import { idSchema, localeSchema } from "@/src/services/global/global.type";
import z from "zod";
export const createBranchSchema = z
  .object({
    isoCode: z.string().nullish(),
    countryName: z.string().min(1, "Country name is required"),
    status: z.enum(["ACTIVE", "PLANNED"]).optional(),
  })
  .merge(localeSchema);
export const updateBranchSchema = createBranchSchema.merge(idSchema);
export type CreateBranchInput = z.infer<typeof createBranchSchema>;
export type UpdateBranchInput = z.infer<typeof updateBranchSchema>;

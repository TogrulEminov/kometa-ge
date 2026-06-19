import { idSchema, localeSchema } from "@/app/(dashboard)/_type/global.type";
import z from "zod";
export const createFagSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().nullable().optional(),
  })
  .merge(localeSchema);
export const uptadeFagSchema = createFagSchema.merge(idSchema);
export type CreateFagInput = z.infer<typeof createFagSchema>;
export type UpdateFagInput = z.infer<typeof uptadeFagSchema>;

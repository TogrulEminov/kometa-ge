import { localeSchema } from "@/app/(dashboard)/_type/global.type";
import z from "zod";

export const JsonValue = z.object({
  title: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
});
export const upsertProcessInfoSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    subTitle: z.string().nullable().optional(),
    description: z.array(JsonValue).nullable().optional(),
  })
  .merge(localeSchema);

export type UpsertProcessInfoInput = z.infer<typeof upsertProcessInfoSchema>;

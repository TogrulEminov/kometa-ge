import { localeSchema } from "@/app/(dashboard)/_type/global.type";
import z from "zod";

export const upsertHeroInfoSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    subTitle: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
  })
  .merge(localeSchema);

export type UpsertHeroInfoInput = z.infer<typeof upsertHeroInfoSchema>;

import {
  localeSchema,
  newInfoJsonSchema,
} from "@/app/(dashboard)/_type/global.type";
import z from "zod";

export const upsertAboutSectionInfoSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    subTitle: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    features: z.array(newInfoJsonSchema).nullable().optional(),
  })
  .merge(localeSchema);

export type UpsertAboutSectionInfoInput = z.infer<
  typeof upsertAboutSectionInfoSchema
>;

import {
  localeSchema,
  newInfoJsonSchema,
} from "@/app/(dashboard)/_type/global.type";
import z from "zod";

export const upsertAboutMainInfoSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    subTitle: z.string().nullable().optional(),
    hightlight: z.string().nullable().optional(),
    shortDescription: z.string().nullable().optional(),
    branches: z.array(z.string()).nullable().optional(),
    description: z.array(newInfoJsonSchema).nullable().optional(),
  })
  .merge(localeSchema)
  .superRefine((data, ctx) => {
    if (!data.description?.length) return;

    const seenTypes = new Set<string>();

    data.description.forEach((section, index) => {
      if (!section.type) return;

      if (seenTypes.has(section.type)) {
        ctx.addIssue({
          code: "custom",
          message: "This section type is already used",
          path: ["description", index, "type"],
        });
        return;
      }

      seenTypes.add(section.type);
    });
  });

export type UpsertAboutMainInfoInput = z.infer<typeof upsertAboutMainInfoSchema>;

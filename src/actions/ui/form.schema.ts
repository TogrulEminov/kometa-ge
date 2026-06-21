import z from "zod";

export const callActionSchema = z.object({
  from: z.string(),
  to: z.string(),
  email: z.string(),
  telephone: z.string(),
  message: z.string(),
});
export type CallActionInputType = z.infer<typeof callActionSchema>;

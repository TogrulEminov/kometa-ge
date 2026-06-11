import { z } from "zod";

export const isFieldRequired = <T extends z.ZodRawShape>(
    schema: z.ZodObject<T>,
    fieldName: string,
): boolean => {
    const field = schema.shape[fieldName] as z.ZodTypeAny | undefined;

    if (!field) return false;

    return !field.isOptional();
};
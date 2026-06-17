"use server";

import { z } from "zod";
import { authActionClient } from "@/lib/safe-action/SafeAction";
import { db } from "@/lib/prisma";
import { ORDERABLE_MODEL_MAP } from "@/lib/order/orderableModelMap";
import { isOrderableModel } from "@/lib/order/orderableModels";

const updateOrderSchema = z.object({
  model: z.string(),
  items: z
    .array(
      z.object({
        id: z.union([z.string(), z.number()]),
        orderNumber: z.number().int().positive(),
      }),
    )
    .min(1),
});

type OrderableDelegate = {
  update: (args: {
    where: { id: string | number };
    data: { orderNumber: number };
  }) => Promise<unknown>;
};

export const updateOrderAction = authActionClient
  .inputSchema(updateOrderSchema)
  .action(async ({ parsedInput }) => {
    const { model, items } = parsedInput;

    if (!isOrderableModel(model)) {
      return {
        success: false as const,
        error: "Bu model üçün sıralama dəstəklənmir",
      };
    }

    const prismaModel = ORDERABLE_MODEL_MAP[
      model
    ] as unknown as OrderableDelegate;

    await db.$transaction(
      items.map((item) =>
        prismaModel.update({
          where: { id: item.id },
          data: { orderNumber: item.orderNumber },
        }),
      ),
    );

    return {
      success: true as const,
      message: "Sıra uğurla yeniləndi",
    };
  });

import { ORDERABLE_MODEL_MAP } from "./orderableModelMap";
import { OrderableModel } from "./orderableModels";

type OrderableAggregateDelegate = {
  aggregate: (args: {
    _max: { orderNumber: true };
  }) => Promise<{ _max: { orderNumber: number | null } }>;
};

export async function getNextOrderNumber(model: OrderableModel): Promise<number> {
  const prismaModel = ORDERABLE_MODEL_MAP[
    model
  ] as unknown as OrderableAggregateDelegate;
  const result = await prismaModel.aggregate({
    _max: { orderNumber: true },
  });

  return (result._max.orderNumber ?? 0) + 1;
}

export const ORDERABLE_MODELS = [
  "faq",
  "work-process",
  "service",
  "service-category",
  "directions",
  "youtube",
] as const;

export type OrderableModel = (typeof ORDERABLE_MODELS)[number];

const ORDERABLE_MODEL_SET = new Set<string>(ORDERABLE_MODELS);

export function isOrderableModel(model: string): model is OrderableModel {
  return ORDERABLE_MODEL_SET.has(model);
}

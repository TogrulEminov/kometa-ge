import { db } from "../prisma";
import { OrderableModel } from "./orderableModels";

export const ORDERABLE_MODEL_MAP: Record<
  OrderableModel,
  (typeof db)[keyof typeof db]
> = {
  faq: db.faq,
  "work-process": db.workProcess,
  service: db.services,
  "service-category": db.subServices,
  directions: db.directions,
  youtube: db.youtube,
};

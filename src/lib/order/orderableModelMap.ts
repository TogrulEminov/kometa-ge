import { db } from "../prisma";
import { OrderableModel } from "./orderableModels";

export const ORDERABLE_MODEL_MAP: Record<
  OrderableModel,
  (typeof db)[keyof typeof db]
> = {
  faq: db.faq,
  service: db.services,
  subServices: db.subServices,
  directions: db.directions,
  youtube: db.youtube,
  branch: db.branch,
  office: db.office,
  photoGallery: db.photoGallery,
  certificates: db.certificates,
};

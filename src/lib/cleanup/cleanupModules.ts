import { pageRoutes } from "@/app/(dashboard)/_type/constant";
import { db } from "@/lib/prisma";
import type { CleanupModuleKey } from "@/lib/cleanup/cleanup.types";

export type { CleanupModuleKey };

export interface CleanupModuleDefinition {
  key: CleanupModuleKey;
  label: string;
  route: string;
}

const GALLERY_INCLUDE = {
  gallery: { select: { id: true } },
  imageUrl: { select: { id: true } },
} as const;

const IMAGE_INCLUDE = {
  imageUrl: { select: { id: true } },
} as const;

export const CLEANUP_MODULE_DEFINITIONS: CleanupModuleDefinition[] = [
  {
    key: "categories",
    label: "Meta information",
    route: pageRoutes.categories.root,
  },
  {
    key: "sectionContent",
    label: "Section titles",
    route: pageRoutes.sectionContent.root,
  },
  {
    key: "servicesMain",
    label: "Services main",
    route: pageRoutes.servicesMain.root,
  },
  {
    key: "subServices",
    label: "Sub Services",
    route: pageRoutes.subServices.root,
  },
  {
    key: "youtubeMedia",
    label: "Youtube videos",
    route: pageRoutes.youtubeMedia.root,
  },
  {
    key: "directions",
    label: "Directions",
    route: pageRoutes.directions.root,
  },
  {
    key: "faq",
    label: "FAQ",
    route: pageRoutes.faq.root,
  },
  {
    key: "enum",
    label: "System types",
    route: pageRoutes.enum.root,
  },
  {
    key: "branches",
    label: "Branches",
    route: pageRoutes.branches.root,
  },
  {
    key: "offices",
    label: "Offices",
    route: pageRoutes.offices.root,
  },
  {
    key: "photoGallery",
    label: "Photo Gallery",
    route: pageRoutes.photoGallery.root,
  },
  {
    key: "certificates",
    label: "Certificates",
    route: pageRoutes.certificates.root,
  },
];

type SoftDeleteRecord = {
  id: string;
  imageId?: number | null;
  imageUrl?: { id: number } | null;
  gallery?: { id: number }[];
};

interface SoftDeleteDelegate {
  countDeleted: () => Promise<number>;
  findDeleted: () => Promise<SoftDeleteRecord[]>;
  hardDelete: (id: string) => Promise<unknown>;
}

export const CLEANUP_MODULE_DELEGATES: Record<
  CleanupModuleKey,
  SoftDeleteDelegate
> = {
  categories: {
    countDeleted: () =>
      db.categories.count({ where: { isDeleted: true } }),
    findDeleted: () =>
      db.categories.findMany({
        where: { isDeleted: true },
        include: IMAGE_INCLUDE,
      }),
    hardDelete: (id) => db.categories.delete({ where: { id } }),
  },
  sectionContent: {
    countDeleted: () =>
      db.sectionContent.count({ where: { isDeleted: true } }),
    findDeleted: () =>
      db.sectionContent.findMany({ where: { isDeleted: true } }),
    hardDelete: (id) => db.sectionContent.delete({ where: { id } }),
  },
  servicesMain: {
    countDeleted: () => db.services.count({ where: { isDeleted: true } }),
    findDeleted: () =>
      db.services.findMany({
        where: { isDeleted: true },
        include: GALLERY_INCLUDE,
      }),
    hardDelete: (id) => db.services.delete({ where: { id } }),
  },
  subServices: {
    countDeleted: () => db.subServices.count({ where: { isDeleted: true } }),
    findDeleted: () =>
      db.subServices.findMany({
        where: { isDeleted: true },
        include: GALLERY_INCLUDE,
      }),
    hardDelete: (id) => db.subServices.delete({ where: { id } }),
  },
  youtubeMedia: {
    countDeleted: () => db.youtube.count({ where: { isDeleted: true } }),
    findDeleted: () =>
      db.youtube.findMany({
        where: { isDeleted: true },
        include: IMAGE_INCLUDE,
      }),
    hardDelete: (id) => db.youtube.delete({ where: { id } }),
  },
  directions: {
    countDeleted: () => db.directions.count({ where: { isDeleted: true } }),
    findDeleted: () =>
      db.directions.findMany({
        where: { isDeleted: true },
        include: IMAGE_INCLUDE,
      }),
    hardDelete: (id) => db.directions.delete({ where: { id } }),
  },
  faq: {
    countDeleted: () => db.faq.count({ where: { isDeleted: true } }),
    findDeleted: () => db.faq.findMany({ where: { isDeleted: true } }),
    hardDelete: (id) => db.faq.delete({ where: { id } }),
  },
  enum: {
    countDeleted: () => db.enum.count({ where: { isDeleted: true } }),
    findDeleted: () => db.enum.findMany({ where: { isDeleted: true } }),
    hardDelete: (id) => db.enum.delete({ where: { id } }),
  },
  branches: {
    countDeleted: () => db.branch.count({ where: { isDeleted: true } }),
    findDeleted: () => db.branch.findMany({ where: { isDeleted: true } }),
    hardDelete: (id) => db.branch.delete({ where: { id } }),
  },
  offices: {
    countDeleted: () => db.office.count({ where: { isDeleted: true } }),
    findDeleted: () => db.office.findMany({ where: { isDeleted: true } }),
    hardDelete: (id) => db.office.delete({ where: { id } }),
  },
  photoGallery: {
    countDeleted: () =>
      db.photoGallery.count({ where: { isDeleted: true } }),
    findDeleted: () =>
      db.photoGallery.findMany({
        where: { isDeleted: true },
        include: GALLERY_INCLUDE,
      }),
    hardDelete: (id) => db.photoGallery.delete({ where: { id } }),
  },
  certificates: {
    countDeleted: () =>
      db.certificates.count({ where: { isDeleted: true } }),
    findDeleted: () =>
      db.certificates.findMany({
        where: { isDeleted: true },
        include: GALLERY_INCLUDE,
      }),
    hardDelete: (id) => db.certificates.delete({ where: { id } }),
  },
};

export function getCleanupModuleDefinition(
  key: CleanupModuleKey,
): CleanupModuleDefinition {
  const definition = CLEANUP_MODULE_DEFINITIONS.find(
    (module) => module.key === key,
  );

  if (!definition) {
    throw new Error(`Unknown cleanup module: ${key}`);
  }

  return definition;
}

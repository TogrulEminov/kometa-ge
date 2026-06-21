export type CleanupModuleKey =
  | "categories"
  | "sectionContent"
  | "servicesMain"
  | "subServices"
  | "youtubeMedia"
  | "directions"
  | "faq"
  | "enum"
  | "branches"
  | "offices"
  | "photoGallery"
  | "certificates";

const CLEANUP_MODULE_KEYS = new Set<string>([
  "categories",
  "sectionContent",
  "servicesMain",
  "subServices",
  "youtubeMedia",
  "directions",
  "faq",
  "enum",
  "branches",
  "offices",
  "photoGallery",
  "certificates",
]);

export function isCleanupModuleKey(value: string): value is CleanupModuleKey {
  return CLEANUP_MODULE_KEYS.has(value);
}

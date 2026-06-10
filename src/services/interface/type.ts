export const Role = {
  USER: "user",
  ADMIN: "admin",
  MODERATOR: "moderator",
} as const;

export const Status = {
  published: "published",
  draft: "draft",
} as const;

export type Status = (typeof Status)[keyof typeof Status];

export const CustomLocales = {
  az: "az",
  ru: "ru",
  en: "en",
  kk: "kk",
} as const;

export type CustomLocales = (typeof CustomLocales)[keyof typeof CustomLocales];

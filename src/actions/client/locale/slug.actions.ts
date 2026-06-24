"use server";

import { getPathname } from "@/i18n/navigation";
import type { LocaleContentType } from "@/i18n/locale-routing";
import { CACHE_TAG_GROUPS } from "@/actions/ui/cachetags";
import { Locales } from "@/generated/prisma/enums";
import { db } from "@/lib/prisma";
import { CustomLocales } from "@/services/interface/type";
import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod";

const LocalesSchema = z.enum(["en", "ka"]);
const ContentTypeSchema = z.enum(["services", "sub-services", "directions"]);

type GetTranslatedSlugParams = {
  currentLocale: string;
  newLocale: string;
  slug: string;
  type: LocaleContentType;
  category?: string;
};

type GetTranslatedSlugResult = {
  success: boolean;
  translatedSlug?: string;
  translatedCategory?: string | null;
  message?: string;
};

export async function getTranslatedSlug(
  params: GetTranslatedSlugParams,
): Promise<GetTranslatedSlugResult> {
  try {
    const { currentLocale, newLocale, slug, type, category } = params;

    const parsedCurrentLocale = LocalesSchema.safeParse(currentLocale);
    const parsedNewLocale = LocalesSchema.safeParse(newLocale);
    const parsedType = ContentTypeSchema.safeParse(type);

    if (
      !parsedCurrentLocale.success ||
      !parsedNewLocale.success ||
      !parsedType.success
    ) {
      return { success: false, message: "Incorrect parameters provided" };
    }

    const currentLang = parsedCurrentLocale.data as Locales;
    const newLang = parsedNewLocale.data as Locales;
    const contentType = parsedType.data;

    let translatedSlug: string | undefined;
    let translatedCategory: string | undefined | null;

    switch (contentType) {
      case "services": {
        const serviceItem = await db.servicesTranslations.findFirst({
          where: {
            slug,
            locale: currentLang,
            document: { isDeleted: false },
          },
          select: {
            document: {
              select: {
                translations: {
                  where: { locale: newLang },
                  select: { slug: true },
                  take: 1,
                },
              },
            },
          },
        });

        translatedSlug = serviceItem?.document?.translations[0]?.slug ?? undefined;

        if (!translatedSlug) {
          return { success: false, message: "Service translation not found" };
        }
        break;
      }

      case "sub-services": {
        const [subServiceItem, categoryItem] = await Promise.all([
          db.subServicesTranslations.findFirst({
            where: {
              slug,
              locale: currentLang,
              document: {
                isDeleted: false,
                ...(category && {
                  services: {
                    translations: {
                      some: { slug: category, locale: currentLang },
                    },
                  },
                }),
              },
            },
            select: {
              document: {
                select: {
                  translations: {
                    where: { locale: newLang },
                    select: { slug: true },
                    take: 1,
                  },
                },
              },
            },
          }),
          category
            ? db.servicesTranslations.findFirst({
                where: {
                  slug: category,
                  locale: currentLang,
                  document: { isDeleted: false },
                },
                select: {
                  document: {
                    select: {
                      translations: {
                        where: { locale: newLang },
                        select: { slug: true },
                        take: 1,
                      },
                    },
                  },
                },
              })
            : null,
        ]);

        translatedSlug = subServiceItem?.document?.translations[0]?.slug;
        translatedCategory = categoryItem?.document?.translations[0]?.slug;

        if (!translatedSlug || !translatedCategory) {
          return {
            success: false,
            message: "Sub-service translation not found",
          };
        }
        break;
      }

      case "directions": {
        const directionsItem = await db.directionsTranslations.findFirst({
          where: {
            slug,
            locale: currentLang,
            document: { isDeleted: false },
          },
          select: {
            document: {
              select: {
                translations: {
                  where: { locale: newLang },
                  select: { slug: true },
                  take: 1,
                },
              },
            },
          },
        });

        translatedSlug =
          directionsItem?.document?.translations[0]?.slug ?? undefined;

        if (!translatedSlug) {
          return {
            success: false,
            message: "Direction translation not found",
          };
        }
        break;
      }

      default:
        return { success: false, message: "Invalid content type." };
    }

    return {
      success: true,
      translatedSlug,
      translatedCategory,
    };
  } catch (error) {
    console.error("Error fetching translated slug:", error);
    return {
      success: false,
      message: "Internal Server Error",
    };
  }
}

type SmartRedirectParams = {
  slug: string;
  locale: string;
  type: LocaleContentType;
  category?: string;
};

export async function getSmartRedirectUrl({
  slug,
  locale,
  type,
  category,
}: SmartRedirectParams): Promise<string | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag(CACHE_TAG_GROUPS.LOCALE_REDIRECT);

  try {
    const parsedLocale = LocalesSchema.safeParse(locale);
    const parsedType = ContentTypeSchema.safeParse(type);

    if (!parsedLocale.success || !parsedType.success) {
      return null;
    }

    const targetLocale = parsedLocale.data as CustomLocales;

    switch (parsedType.data) {
      case "services": {
        const item = await db.servicesTranslations.findFirst({
          where: { slug, document: { isDeleted: false } },
          select: {
            document: {
              select: {
                translations: {
                  where: { locale: targetLocale as Locales },
                  select: { slug: true },
                  take: 1,
                },
              },
            },
          },
        });

        const newSlug = item?.document?.translations[0]?.slug;
        if (!newSlug) return null;

        return getPathname({
          locale: targetLocale,
          href: {
            pathname: "/services/[category]",
            params: { category: newSlug },
          },
        });
      }

      case "sub-services": {
        const item = await db.subServicesTranslations.findFirst({
          where: {
            slug,
            document: {
              isDeleted: false,
              ...(category && {
                services: {
                  translations: {
                    some: { slug: category },
                  },
                },
              }),
            },
          },
          select: {
            document: {
              select: {
                translations: {
                  where: { locale: targetLocale as Locales },
                  select: { slug: true },
                  take: 1,
                },
                services: {
                  select: {
                    translations: {
                      where: { locale: targetLocale as Locales },
                      select: { slug: true },
                      take: 1,
                    },
                  },
                },
              },
            },
          },
        });

        const newSlug = item?.document?.translations[0]?.slug;
        const newCategory = item?.document?.services?.translations[0]?.slug;

        if (!newSlug || !newCategory) return null;

        return getPathname({
          locale: targetLocale,
          href: {
            pathname: "/services/[category]/[slug]",
            params: { category: newCategory, slug: newSlug },
          },
        });
      }

      case "directions": {
        const item = await db.directionsTranslations.findFirst({
          where: { slug, document: { isDeleted: false } },
          select: {
            document: {
              select: {
                translations: {
                  where: { locale: targetLocale as Locales },
                  select: { slug: true },
                  take: 1,
                },
              },
            },
          },
        });

        const newSlug = item?.document?.translations[0]?.slug;
        if (!newSlug) return null;

        return getPathname({
          locale: targetLocale,
          href: {
            pathname: "/directions/[slug]",
            params: { slug: newSlug },
          },
        });
      }
    }
  } catch (error) {
    console.error("Smart redirect error:", error);
    return null;
  }

  return null;
}

import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { db } from "@/lib/prisma";
import { CustomLocales } from "@/services/interface/type";
import type { MetadataRoute } from "next";

const LOCALES = routing.locales;
const DEFAULT_LOCALE = routing.defaultLocale as CustomLocales;

const STATIC_ROUTES = [
  "/",
  "/about",
  "/services",
  "/directions",
  "/contact",
  "/certificates",
  "/photo-gallery",
  "/video-gallery",
] as const;

type StaticRoute = (typeof STATIC_ROUTES)[number];

type LocalizedHref =
  | StaticRoute
  | {
      pathname: "/services/[category]";
      params: { category: string };
    }
  | {
      pathname: "/services/[category]/[slug]";
      params: { category: string; slug: string };
    }
  | {
      pathname: "/directions/[slug]";
      params: { slug: string };
    };

function getWebsiteUrl() {
  return (process.env.NEXT_PUBLIC_BASE_URL || "https://kometa.ge").replace(
    /\/$/,
    "",
  );
}

function toSlugMap(
  translations: Array<{ locale: CustomLocales; slug: string | null }>,
) {
  return Object.fromEntries(
    translations
      .filter((translation) => translation.slug)
      .map((translation) => [translation.locale, translation.slug as string]),
  ) as Partial<Record<CustomLocales, string>>;
}

function buildAbsoluteUrl(locale: CustomLocales, href: LocalizedHref) {
  const pathname = getPathname({
    locale,
    href: href as Parameters<typeof getPathname>[0]["href"],
  });

  return `${getWebsiteUrl()}${pathname}`;
}

function buildSitemapItem({
  lastModified,
  hrefByLocale,
  changeFrequency = "weekly",
  priority = 0.7,
}: {
  lastModified: Date;
  hrefByLocale: Partial<Record<CustomLocales, LocalizedHref>>;
  changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority?: number;
}): MetadataRoute.Sitemap[number] | null {
  const languages: Record<string, string> = {};

  for (const locale of LOCALES) {
    const href = hrefByLocale[locale as CustomLocales];
    if (!href) continue;

    languages[locale] = buildAbsoluteUrl(locale as CustomLocales, href);
  }

  const localeKeys = Object.keys(languages);
  if (!localeKeys.length) {
    return null;
  }

  const defaultUrl =
    languages[DEFAULT_LOCALE] ?? languages[localeKeys[0] as CustomLocales];

  languages["x-default"] = languages[DEFAULT_LOCALE] ?? defaultUrl;

  return {
    url: defaultUrl,
    lastModified,
    changeFrequency,
    priority,
    alternates: {
      languages,
    },
  };
}

function buildStaticEntries(): MetadataRoute.Sitemap {
  return STATIC_ROUTES.map((route) => {
    const hrefByLocale = Object.fromEntries(
      LOCALES.map((locale) => [locale, route]),
    ) as Record<CustomLocales, StaticRoute>;

    return buildSitemapItem({
      lastModified: new Date(),
      hrefByLocale,
      changeFrequency: route === "/" ? "daily" : "weekly",
      priority: route === "/" ? 1 : 0.8,
    })!;
  });
}

async function buildServiceEntries(): Promise<MetadataRoute.Sitemap> {
  const services = await db.services.findMany({
    where: { isDeleted: false },
    select: {
      updatedAt: true,
      translations: {
        where: { slug: { not: null } },
        select: { locale: true, slug: true },
      },
    },
  });

  return services
    .map((service) => {
      const slugsByLocale = toSlugMap(
        service.translations as Array<{
          locale: CustomLocales;
          slug: string | null;
        }>,
      );

      const hrefByLocale = Object.fromEntries(
        LOCALES.flatMap((locale) => {
          const slug = slugsByLocale[locale as CustomLocales];
          if (!slug) return [];

          return [
            [
              locale,
              {
                pathname: "/services/[category]",
                params: { category: slug },
              },
            ],
          ];
        }),
      ) as Partial<Record<CustomLocales, LocalizedHref>>;

      return buildSitemapItem({
        lastModified: service.updatedAt,
        hrefByLocale,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    })
    .filter((entry): entry is MetadataRoute.Sitemap[number] => Boolean(entry));
}

async function buildSubServiceEntries(): Promise<MetadataRoute.Sitemap> {
  const subServices = await db.subServices.findMany({
    where: { isDeleted: false },
    select: {
      updatedAt: true,
      translations: {
        where: { slug: { not: null } },
        select: { locale: true, slug: true },
      },
      services: {
        select: {
          translations: {
            where: { slug: { not: null } },
            select: { locale: true, slug: true },
          },
        },
      },
    },
  });

  return subServices
    .map((subService) => {
      const slugsByLocale = toSlugMap(
        subService.translations as Array<{
          locale: CustomLocales;
          slug: string | null;
        }>,
      );
      const categorySlugsByLocale = toSlugMap(
        (subService.services?.translations ?? []) as Array<{
          locale: CustomLocales;
          slug: string | null;
        }>,
      );

      const hrefByLocale = Object.fromEntries(
        LOCALES.flatMap((locale) => {
          const slug = slugsByLocale[locale as CustomLocales];
          const category = categorySlugsByLocale[locale as CustomLocales];
          if (!slug || !category) return [];

          return [
            [
              locale,
              {
                pathname: "/services/[category]/[slug]",
                params: { category, slug },
              },
            ],
          ];
        }),
      ) as Partial<Record<CustomLocales, LocalizedHref>>;

      return buildSitemapItem({
        lastModified: subService.updatedAt,
        hrefByLocale,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    })
    .filter((entry): entry is MetadataRoute.Sitemap[number] => Boolean(entry));
}

async function buildDirectionEntries(): Promise<MetadataRoute.Sitemap> {
  const directions = await db.directions.findMany({
    where: { isDeleted: false },
    select: {
      updatedAt: true,
      translations: {
        select: { locale: true, slug: true },
      },
    },
  });

  return directions
    .map((direction) => {
      const slugsByLocale = toSlugMap(
        direction.translations as Array<{
          locale: CustomLocales;
          slug: string | null;
        }>,
      );

      const hrefByLocale = Object.fromEntries(
        LOCALES.flatMap((locale) => {
          const slug = slugsByLocale[locale as CustomLocales];
          if (!slug) return [];

          return [
            [
              locale,
              {
                pathname: "/directions/[slug]",
                params: { slug },
              },
            ],
          ];
        }),
      ) as Partial<Record<CustomLocales, LocalizedHref>>;

      return buildSitemapItem({
        lastModified: direction.updatedAt,
        hrefByLocale,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    })
    .filter((entry): entry is MetadataRoute.Sitemap[number] => Boolean(entry));
}

export async function buildSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    const serviceEntries = await buildServiceEntries();
    const subServiceEntries = await buildSubServiceEntries();
    const directionEntries = await buildDirectionEntries();

    return [
      ...buildStaticEntries(),
      ...serviceEntries,
      ...subServiceEntries,
      ...directionEntries,
    ];
  } catch (error) {
    console.error("Failed to build dynamic sitemap entries:", error);
    return buildStaticEntries();
  }
}

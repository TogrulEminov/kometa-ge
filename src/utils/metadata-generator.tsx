import { Metadata } from "next";
import { getForCards } from "./getFullimageUrl";
import { getLocalizedUrl } from "@/i18n/localized-url";
import { routing } from "../i18n/routing";
import {
  DEFAULT_DESCRIPTIONS,
  DEFAULT_TITLES,
  GeneratePageMetadataParams,
  getCachedMetadata,
} from "@/services/interface/metadata-constant";
import { CustomLocales } from "@/services/interface/type";
import { CustomPath } from "@/services/interface/metadata-constant";

function resolveDefaultDescription(
  customPath: CustomPath,
  locale: string,
): string {
  return (
    DEFAULT_DESCRIPTIONS[customPath]?.[locale as CustomLocales]?.trim() ||
    DEFAULT_DESCRIPTIONS[customPath]?.en?.trim() ||
    "Kometa GE provides international freight transportation and logistics services from Georgia."
  );
}

export async function generatePageMetadata({
  locale,
  slug,
  category,
  categoryKey,
  customPath,
  detail,
  dataType = "category",
}: GeneratePageMetadataParams): Promise<Metadata> {
  try {
    let title: string | undefined;
    let description: string | undefined;
    let keywords: string | undefined;
    let imageUrl: string | undefined;

    const data = await getCachedMetadata(
      dataType,
      locale as CustomLocales,
      slug,
      category,
      categoryKey,
    );

    if (data) {
      const translation = data.translations?.[0];
      const seoData = translation?.seo;

      title = seoData?.metaTitle || translation?.title || undefined;
      description =
        seoData?.metaDescription || translation?.shortDescription || undefined;
      keywords = seoData?.metaKeywords || undefined;
      imageUrl = getForCards(data?.imageUrl);
    }

    if (!title) {
      title =
        DEFAULT_TITLES[customPath]?.[locale as CustomLocales] ||
        DEFAULT_TITLES[customPath]?.en ||
        "Kometa GE";
    }

    if (!description?.trim()) {
      description = resolveDefaultDescription(customPath, locale);
    }

    const slugsByLocale = data?.slugsByLocale ?? {};
    const categorySlugsByLocale = data?.categorySlugsByLocale ?? {};

    const getUrlForLocale = (lang: CustomLocales) => {
      const currentSlug = slugsByLocale?.[lang] || slug;
      const currentCategory = categorySlugsByLocale?.[lang] || category;

      return getLocalizedUrl(lang, customPath, currentSlug, currentCategory);
    };

    const canonicalUrl = getLocalizedUrl(
      locale as CustomLocales,
      customPath,
      slug,
      category,
    );

    const availableLocales = Object.values(CustomLocales);
    const includedLocales = availableLocales.filter((lang) => {
      let isIncluded = true;
      if (detail && slug && Object.keys(slugsByLocale).length > 0) {
        isIncluded = !!slugsByLocale[lang];
      }
      if (isIncluded && category && Object.keys(categorySlugsByLocale).length > 0) {
        isIncluded = !!categorySlugsByLocale[lang];
      }
      return isIncluded;
    });
    const DEFAULT_LOCALE = routing.defaultLocale;
    const languages: Record<string, string> = {
      ...Object.fromEntries(
        includedLocales.map((lang) => [lang, getUrlForLocale(lang)]),
      ),
    };

    if (includedLocales.includes(DEFAULT_LOCALE)) {
      languages["x-default"] = getUrlForLocale(DEFAULT_LOCALE);
    }

    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        images: imageUrl
          ? [
              {
                url: imageUrl,
                alt: title || "",
                width: 1200,
                height: 630,
              },
            ]
          : undefined,
        locale,
        type: "website",
        url: canonicalUrl,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: imageUrl ? [imageUrl] : undefined,
      },
      alternates: {
        canonical: canonicalUrl,
        languages,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
    };
  } catch {
    const fallbackTitle =
      DEFAULT_TITLES[customPath]?.[locale as CustomLocales] ||
      DEFAULT_TITLES[customPath]?.en ||
      "Kometa GE";

    return {
      title: fallbackTitle,
      description: resolveDefaultDescription(customPath, locale),
    };
  }
}

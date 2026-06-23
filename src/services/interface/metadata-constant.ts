import { cache } from "react";
import { CategoryKey, CustomLocales } from "./type";
import {
  fetchCategoriesByKey,
  fetchDirectionsSeo,
  fetchServicesMainSeo,
  fetchSubServicesSeo,
} from "@/actions/ui/main.controller";
export type CustomPath =
  | "home"
  | "services"
  | "certificates"
  | "contact"
  | "photo-gallery"
  | "video-gallery"
  | "directions"
  | "about";

export interface GeneratePageMetadataParams {
  locale: string;
  slug?: string;
  categoryKey?: CategoryKey;
  category?: string;
  detail?: boolean;
  customPath: CustomPath;
  dataType?:
    | "category"
    | "serviceMain"
    | "directions"
    | "servicesSubCategory"
    | "blogCategory";
}

export interface CachedMetadataResult {
  imageUrl?: { publicUrl?: string | null } | null;
  translations?: Array<{
    title?: string | null;
    shortDescription?: string | null;
    seo?: {
      metaTitle?: string | null;
      metaDescription?: string | null;
      metaKeywords?: string | null;
    } | null;
  }>;
  slugsByLocale?: Partial<Record<CustomLocales, string>>;
  categorySlugsByLocale?: Partial<Record<CustomLocales, string>>;
}

/**
 * ✅ Default titles
 */
export const DEFAULT_TITLES: Record<
  CustomPath,
  Partial<Record<CustomLocales, string>>
> = {
  home: {
    en: "Home",
    ka: "მთავარი",
  },
  services: {
    en: "Services",
    ka: "სერვისები",
  },
  directions: {
    en: "Directions",
    ka: "მიმართულებები",
  },
  certificates: {
    en: "Certificates",
    ka: "სერტიფიკატები",
  },
  contact: {
    en: "Contact",
    ka: "კონტაქტი",
  },
  "video-gallery": {
    en: "Video Gallery",
    ka: "ვიდეო გალერეა",
  },
  "photo-gallery": {
    en: "Photo Gallery",
    ka: "ფოტო გალერეა",
  },
  about: {
    en: "About Us",
    ka: "ჩვენს შესახებ",
  },
};

/**
 * ✅ Default descriptions
 */
export const DEFAULT_DESCRIPTIONS: Record<
  CustomPath,
  Partial<Record<CustomLocales, string>>
> = {
  home: {
    en: "Kometa GE provides reliable international freight transportation and logistics solutions across Europe, Asia, and the CIS region.",
    ka: "Kometa GE უზრუნველყოფს სანდო საერთაშორისო სატვირთო გადაზიდვებსა და ლოგისტიკურ გადაწყვეტილებებს ევროპაში, აზიასა და CIS რეგიონში.",
  },
  services: {
    en: "Explore our comprehensive logistics services, including road freight, cargo transportation, customs support, and supply chain solutions.",
    ka: "გაეცანით ჩვენს ლოგისტიკურ სერვისებს, მათ შორის საგზაო გადაზიდვებს, სატვირთო ტრანსპორტირებას, საბაჟო მხარდაჭერასა და მიწოდების ჯაჭვის გადაწყვეტილებებს.",
  },
  directions: {
    en: "Discover the countries and regions where Kometa GE delivers efficient and secure transportation services.",
    ka: "გაეცანით ქვეყნებსა და რეგიონებს, სადაც Kometa GE უზრუნველყოფს ეფექტურ და უსაფრთხო ტრანსპორტირებას.",
  },
  certificates: {
    en: "View our certifications, licenses, and compliance documents that demonstrate our commitment to quality and reliability.",
    ka: "იხილეთ ჩვენი სერტიფიკატები, ლიცენზიები და შესაბამისობის დოკუმენტები, რომლებიც ადასტურებს ხარისხსა და სანდოობას.",
  },
  contact: {
    en: "Get in touch with Kometa GE for transportation inquiries, logistics consultations, and customer support.",
    ka: "დაგვიკავშირდით Kometa GE-სთან ტრანსპორტირების შეკითხვების, ლოგისტიკური კონსულტაციებისა და მომხმარებელთა მხარდაჭერისთვის.",
  },
  "video-gallery": {
    en: "Watch videos showcasing our logistics operations, transportation services, fleet, and company activities.",
    ka: "ნახეთ ვიდეოები ჩვენი ლოგისტიკური ოპერაციების, ტრანსპორტირების სერვისების, ავტოპარკისა და კომპანიის საქმიანობის შესახებ.",
  },
  "photo-gallery": {
    en: "Browse photos of our transportation projects, vehicles, logistics operations, and company events.",
    ka: "იხილეთ ფოტოები ჩვენი ტრანსპორტირების პროექტების, ავტომობილების, ლოგისტიკური ოპერაციებისა და კომპანიის ღონისძიებების შესახებ.",
  },
  about: {
    en: "Learn more about Kometa GE, our experience in international logistics, our mission, and our commitment to customer satisfaction.",
    ka: "გაიგეთ მეტი Kometa GE-ს შესახებ, ჩვენს გამოცდილებაზე საერთაშორისო ლოგისტიკაში, მისიაზე და მომხმარებელთა კმაყოფილებისადმი ვალდებულებაზე.",
  },
};

/**
 * ✅ React cache ile metadata fetcher
 */
export const getCachedMetadata = cache(
  async (
    dataType: string,
    locale: CustomLocales,
    slug?: string,
    category?: string,
    categoryKey?: CategoryKey,
  ): Promise<CachedMetadataResult | null> => {
    try {
      let result;

      switch (dataType) {
        case "category":
          if (!categoryKey) {
            return null;
          }
          result = await fetchCategoriesByKey({ locale, key: categoryKey });
          return result ?? null;

        case "serviceMain":
          if (!category) {
            return null;
          }
          result = await fetchServicesMainSeo({
            locale,
            slug: category,
          });
          if (!result) {
            return null;
          }
          return {
            ...result,
            translations: result.translations.filter(
              (t) => t.locale === locale,
            ),
            categorySlugsByLocale: Object.fromEntries(
              result.translations
                .filter((t) => t.slug)
                .map((t) => [t.locale, t.slug]),
            ),
          };

        case "directions":
          if (!slug) {
            return null;
          }
          result = await fetchDirectionsSeo({
            locale,
            slug: slug,
          });
          if (!result) {
            return null;
          }
          return {
            ...result,
            translations: result.translations.filter(
              (t) => t.locale === locale,
            ),
            slugsByLocale: Object.fromEntries(
              result.translations
                .filter((t) => t.slug)
                .map((t) => [t.locale, t.slug]),
            ),
          };

        case "servicesSubCategory":
          if (!slug || !category) {
            return null;
          }
          result = await fetchSubServicesSeo({ locale, slug, category });
          if (!result) {
            return null;
          }
          return {
            ...result,
            translations: result.translations.filter(
              (t) => t.locale === locale,
            ),
            slugsByLocale: Object.fromEntries(
              result.translations
                .filter((t) => t.slug)
                .map((t) => [t.locale, t.slug]),
            ),
            categorySlugsByLocale: Object.fromEntries(
              (result.services?.translations ?? [])
                .filter((t: any) => t.slug)
                .map((t: any) => [t.locale, t.slug]),
            ),
          };

        default:
          return null;
      }
    } catch (error) {
      console.error(`❌ Metadata fetch error for ${dataType}:`, error);
      return null;
    }
  },
);

import { getPathname } from "./navigation";
import { CustomPath } from "@/services/interface/metadata-constant";
import { CustomLocales } from "@/services/interface/type";

type LocalizedHref =
  | "/"
  | "/about"
  | "/services"
  | "/directions"
  | "/contact"
  | "/certificates"
  | "/photo-gallery"
  | "/video-gallery"
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

function resolveHref(
  customPath: CustomPath,
  slug?: string,
  category?: string,
): LocalizedHref {
  switch (customPath) {
    case "home":
      return "/";
    case "about":
      return "/about";
    case "contact":
      return "/contact";
    case "certificates":
      return "/certificates";
    case "photo-gallery":
      return "/photo-gallery";
    case "video-gallery":
      return "/video-gallery";
    case "services":
      if (category && slug) {
        return {
          pathname: "/services/[category]/[slug]",
          params: { category, slug },
        };
      }
      if (category) {
        return {
          pathname: "/services/[category]",
          params: { category },
        };
      }
      return "/services";
    case "directions":
      if (slug) {
        return {
          pathname: "/directions/[slug]",
          params: { slug },
        };
      }
      return "/directions";
    default:
      return "/";
  }
}

export function getLocalizedUrl(
  locale: CustomLocales,
  customPath: CustomPath,
  slug?: string,
  category?: string,
): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const pathname = getPathname({
    locale,
    href: resolveHref(customPath, slug, category),
  });

  return `${baseUrl}${pathname}`;
}

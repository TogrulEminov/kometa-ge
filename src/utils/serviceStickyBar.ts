import { getPathname } from "@/i18n/navigation";
import { AppHref, serviceMainHref, serviceSubHref } from "@/i18n/href";
import { CustomLocales, ServicesType } from "@/services/interface/type";

export function isHrefActive(
  pathname: string,
  href: AppHref,
  locale: CustomLocales,
): boolean {
  const targetPath = getPathname({
    href: href as Parameters<typeof getPathname>[0]["href"],
    locale,
  });
  return pathname === targetPath;
}

export function isServiceCategoryActive(
  pathname: string,
  serviceSlug: string,
  locale: CustomLocales,
): boolean {
  if (!serviceSlug) {
    return false;
  }

  return isHrefActive(pathname, serviceMainHref(serviceSlug), locale);
}

export function isSubServicePathActive(
  pathname: string,
  parentSlug: string,
  subSlug: string,
  locale: CustomLocales,
): boolean {
  if (!parentSlug || !subSlug) {
    return false;
  }

  return isHrefActive(pathname, serviceSubHref(parentSlug, subSlug), locale);
}

export function findExpandedServiceId(
  services: ServicesType[],
  pathname: string,
  category: string,
  locale: CustomLocales,
): string | null {
  if (category) {
    const matchedByCategory = services.find(
      (service) => service.translations[0]?.slug === category,
    );

    if (matchedByCategory) {
      return matchedByCategory.id;
    }
  }

  for (const service of services) {
    const serviceSlug = service.translations[0]?.slug;
    if (!serviceSlug) continue;

    const hasActiveChild = service.subServices?.some((child) => {
      const subSlug = child.translations[0]?.slug;
      return Boolean(
        subSlug &&
          isSubServicePathActive(pathname, serviceSlug, subSlug, locale),
      );
    });

    if (hasActiveChild || isServiceCategoryActive(pathname, serviceSlug, locale)) {
      return service.id;
    }
  }

  return null;
}

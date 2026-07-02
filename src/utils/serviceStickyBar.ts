import { ServicesType } from "@/services/interface/type";

function getPathSegments(pathname: string): string[] {
  return pathname.split("/").filter(Boolean);
}

export function isServiceCategoryActive(
  pathname: string,
  serviceSlug: string,
): boolean {
  const segments = getPathSegments(pathname);
  const index = segments.indexOf(serviceSlug);

  if (index === -1) {
    return false;
  }

  return index === segments.length - 1 || index === segments.length - 2;
}

export function isSubServicePathActive(
  pathname: string,
  parentSlug: string,
  subSlug: string,
): boolean {
  const segments = getPathSegments(pathname);
  const parentIndex = segments.indexOf(parentSlug);

  if (parentIndex === -1) {
    return false;
  }

  return segments[parentIndex + 1] === subSlug;
}

export function findExpandedServiceId(
  services: ServicesType[],
  pathname: string,
  category: string,
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
        subSlug && isSubServicePathActive(pathname, serviceSlug, subSlug),
      );
    });

    if (hasActiveChild || isServiceCategoryActive(pathname, serviceSlug)) {
      return service.id;
    }
  }

  return null;
}

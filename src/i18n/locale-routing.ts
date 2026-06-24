import { routing } from "./routing";

export type LocaleContentType = "services" | "sub-services" | "directions";

function getLocalizedPrefixes(internalPath: keyof typeof routing.pathnames): string[] {
  const config = routing.pathnames[internalPath];

  if (!config) {
    return [internalPath];
  }

  if (typeof config === "string") {
    return [config];
  }

  return Object.values(config);
}

function getDynamicDepth(pathname: string, prefixes: string[]): number {
  for (const prefix of prefixes) {
    if (pathname === prefix) {
      return 0;
    }

    if (pathname.startsWith(`${prefix}/`)) {
      return pathname.slice(prefix.length + 1).split("/").filter(Boolean).length;
    }
  }

  return -1;
}

export function detectLocaleContentType(
  pathname: string,
  params: { category?: string; slug?: string },
): LocaleContentType | null {
  const directionsPrefixes = getLocalizedPrefixes("/directions");
  const directionsDepth = getDynamicDepth(pathname, directionsPrefixes);

  if (directionsDepth === 1 && params.slug) {
    return "directions";
  }

  const servicesPrefixes = getLocalizedPrefixes("/services");
  const servicesDepth = getDynamicDepth(pathname, servicesPrefixes);

  if (servicesDepth === 2 && params.category && params.slug) {
    return "sub-services";
  }

  if (servicesDepth === 1 && params.category) {
    return "services";
  }

  return null;
}

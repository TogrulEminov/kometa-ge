import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { DEFAULT_DESCRIPTIONS, DEFAULT_TITLES } from "@/services/interface/metadata-constant";
import { CustomLocales } from "@/services/interface/type";
import {
  STATIC_PUBLIC_ROUTE_CUSTOM_PATH,
  STATIC_PUBLIC_ROUTE_HREFS,
} from "@/lib/routes/static-public-routes";

const LOCALE_SECTION_LABELS: Record<string, string> = {
  en: "English",
  ka: "Georgian",
};

function getWebsiteUrl() {
  return (
    process.env.NEXT_PUBLIC_BASE_URL || "https://kometa-ge.vercel.app"
  ).replace(/\/$/, "");
}

export function buildLlmsContent(): string {
  const websiteUrl = getWebsiteUrl();
  const intro =
    DEFAULT_DESCRIPTIONS.home.en?.trim() ||
    "International freight transportation and logistics services from Georgia.";

  const lines: string[] = ["# Kometa GE", "", `> ${intro}`, ""];

  for (const locale of routing.locales) {
    lines.push(
      `## Main pages (${LOCALE_SECTION_LABELS[locale] ?? locale})`,
      "",
    );

    for (const href of STATIC_PUBLIC_ROUTE_HREFS) {
      const customPath = STATIC_PUBLIC_ROUTE_CUSTOM_PATH[href];
      const pathname = getPathname({ locale, href });
      const url = `${websiteUrl}${pathname}`;
      const title =
        DEFAULT_TITLES[customPath][locale as CustomLocales] ||
        DEFAULT_TITLES[customPath].en ||
        customPath;

      lines.push(`- [${title}](${url})`);
    }

    lines.push("");
  }

  lines.push("## Sitemap", "", `- [Sitemap](${websiteUrl}/sitemap.xml)`);

  return lines.join("\n");
}

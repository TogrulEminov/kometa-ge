import type { MetadataRoute } from "next";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatLastModified(value: Date | string | undefined) {
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return date.toISOString();
}

export function renderSitemapXml(entries: MetadataRoute.Sitemap) {
  const urls = entries
    .map((entry) => {
      const lastModified = formatLastModified(entry.lastModified);
      const alternateLinks = Object.entries(entry.alternates?.languages ?? {})
        .filter((entry): entry is [string, string] => Boolean(entry[1]))
        .map(
          ([lang, href]) =>
            `<xhtml:link rel="alternate" hreflang="${escapeXml(lang)}" href="${escapeXml(href)}" />`,
        )
        .join("\n");

      return [
        "<url>",
        `<loc>${escapeXml(entry.url)}</loc>`,
        alternateLinks,
        lastModified ? `<lastmod>${lastModified}</lastmod>` : "",
        entry.changeFrequency
          ? `<changefreq>${entry.changeFrequency}</changefreq>`
          : "",
        entry.priority != null ? `<priority>${entry.priority}</priority>` : "",
        "</url>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;
}

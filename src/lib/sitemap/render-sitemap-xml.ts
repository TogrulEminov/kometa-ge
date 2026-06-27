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

function indent(level: number, value: string) {
  return `${"  ".repeat(level)}${value}`;
}

export function renderSitemapXml(entries: MetadataRoute.Sitemap) {
  const urls = entries
    .map((entry) => {
      const lastModified = formatLastModified(entry.lastModified);
      const alternateLinks = Object.entries(entry.alternates?.languages ?? {})
        .filter((entry): entry is [string, string] => Boolean(entry[1]))
        .map(
          ([lang, href]) =>
            indent(
              2,
              `<xhtml:link rel="alternate" hreflang="${escapeXml(lang)}" href="${escapeXml(href)}" />`,
            ),
        );

      const lines = [
        indent(1, "<url>"),
        indent(2, `<loc>${escapeXml(entry.url)}</loc>`),
        ...alternateLinks,
        lastModified ? indent(2, `<lastmod>${lastModified}</lastmod>`) : "",
        entry.changeFrequency
          ? indent(2, `<changefreq>${entry.changeFrequency}</changefreq>`)
          : "",
        entry.priority != null
          ? indent(2, `<priority>${entry.priority}</priority>`)
          : "",
        indent(1, "</url>"),
      ].filter(Boolean);

      return lines.join("\n");
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;
}

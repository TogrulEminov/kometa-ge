import { buildSitemapEntries } from "@/lib/sitemap/build-sitemap-entries";
import { renderSitemapXml } from "@/lib/sitemap/render-sitemap-xml";

export async function GET() {
  const entries = await buildSitemapEntries();
  const xml = renderSitemapXml(entries);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

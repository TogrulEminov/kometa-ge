import { buildSitemapEntries } from "@/lib/sitemap/build-sitemap-entries";
import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildSitemapEntries();
}

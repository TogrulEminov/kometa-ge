import { NextResponse } from "next/server";

export async function GET() {
  const websiteUrl = (
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ).replace(/\/$/, "");
  const sitemapUrl = `${websiteUrl}/sitemap.xml`;

  const content = [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${sitemapUrl}`,
  ].join("\n");

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}

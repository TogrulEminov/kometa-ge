import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const websiteUrl = (
    process.env.NEXT_PUBLIC_BASE_URL || "https://kometa.ge"
  ).replace(/\/$/, "");

  // Bütün botlar üçün ortaq qadağalar
  const commonDisallows = [
    "/api/*",
    "/general/images/temp-upload/*",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [...commonDisallows, "/_next/static/"],
        crawlDelay: 1,
      },
      {
        // Google-a açıq şəkildə bu bölmələrin qadağan olduğunu təkrar vurğulayaq
        userAgent: "Googlebot",
        allow: "/",
        disallow: commonDisallows,
      },
      {
        userAgent: ["GPTBot", "ChatGPT-User", "CCBot", "AhrefsBot"], // AI və Analitika botları
        disallow: "/",
      },
    ],
    sitemap: `${websiteUrl}/sitemap.xml`,
  };
}
// next.config.ts
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import redirectData from "@/json/redirect.json";

const isDev = process.env.NODE_ENV === "development";
// ✅ Əsas domain — yalnız bir yerdə dəyiş
const MAIN_DOMAIN = "kometa-ge.vercel.app";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["sharp", "nodemailer", "ejs"],
  reactStrictMode: false,
  poweredByHeader: true,
  trailingSlash: false,
  compress: true,
  cacheComponents: true,
  productionBrowserSourceMaps: false,

  generateBuildId: async () => {
    return process.env.GIT_COMMIT_SHA || Date.now().toString();
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.kometa-ge.vercel.app" },
      { protocol: "https", hostname: "**.kometa-ge.vercel.app" },
      { protocol: "https", hostname: "kometa-ge.vercel.app" },
      { protocol: "https", hostname: "**.r2.dev" },
      { protocol: "https", hostname: "blobs.**" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.pinimg.com" },
      { protocol: "https", hostname: "kometa-ge-new.togruleminov.site" },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 768, 1024, 1280, 1920],
    imageSizes: [32, 64, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 7,
    dangerouslyAllowSVG: true,
    qualities: [75, 80, 90],
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  compiler: {
    removeConsole: isDev ? false : { exclude: ["error", "warn"] },
  },

  experimental: {
    turbopackMemoryLimit: isDev ? 2048 : undefined,
    // optimizeCss: true,
    optimizePackageImports: [
      "lucide-react",
      "recharts",
      "react-hook-form",
      "zod",
      "@tanstack/react-query",
      "antd",
      "framer-motion",
    ],
    serverActions: {
      bodySizeLimit: "10mb",
      allowedOrigins: [
        "localhost:3000",
        MAIN_DOMAIN,
        `*.${MAIN_DOMAIN}`,
        "kometa.ge",
        "*.kometa.ge",
      ],
    },
    staleTimes: {
      dynamic: 60,
      static: 180,
    },
    workerThreads: false,
    cpus: 1,
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.mergeDuplicateChunks = true;
    }
    return config;
  },

  async headers() {
    if (isDev) return [];

    // ✅ CSP direktiv — hər dəyişiklik yalnız burada
    const csp = [
      "default-src 'self'",

      // Skriptlər
      [
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "https://www.googletagmanager.com",
        "https://static.cloudflareinsights.com",
        "https://connect.facebook.net",
        "https://www.clarity.ms",
        "https://*.clarity.ms",
        "https://challenges.cloudflare.com",
      ].join(" "),

      // Stillər
      "style-src 'self' 'unsafe-inline'",

      // Şəkillər
      [
        "img-src 'self' data: https:",
        "https://www.googletagmanager.com",
        "https://www.facebook.com",
        "https://api-maps.yandex.ru",
        "https://*.maps.yandex.net",
        "https://yastatic.net",
        "https://*.clarity.ms",
      ].join(" "),

      // Fontlar
      "font-src 'self' data:",

      // Media — ✅ köhnə kometa.ge silindi, yalnız yeni domain
      [
        `media-src 'self'`,
        `https://blobs.${MAIN_DOMAIN}`,
        `https://*.${MAIN_DOMAIN}`,
        "https://i.ytimg.com",
        "https://*.r2.dev",
      ].join(" "),

      // Frame-lər
      [
        "frame-src 'self'",
        "https://www.youtube-nocookie.com",
        "https://www.youtube.com",
        "https://www.facebook.com",
        "https://web.facebook.com",
        "https://challenges.cloudflare.com", // ✅ Turnstile iframe-i üçün (hər ehtimala qarşı)
      ].join(" "),

      // Worker
      "worker-src 'self' blob:",

      // Connect — same-origin API + analytics/third-party
      [
        "connect-src 'self'",
        "http://localhost:*",
        "http://127.0.0.1:*",
        "ws://localhost:*",
        "ws://127.0.0.1:*",
        "wss://localhost:*",
        "wss://127.0.0.1:*",
        "https://www.google-analytics.com",
        "https://*.google-analytics.com",
        "https://*.analytics.google.com",
        "https://*.googletagmanager.com",
        "https://static.cloudflareinsights.com",
        "https://www.facebook.com",
        "https://connect.facebook.net",
        "https://api-maps.yandex.ru",
        "https://*.maps.yandex.net",
        "https://yandex.ru",
        `https://*.${MAIN_DOMAIN}`,
        "https://*.clarity.ms",
        "https:",
      ].join(" "),
    ].join("; ");

    const baseSecurityHeaders = [
      { key: "X-DNS-Prefetch-Control", value: "on" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-XSS-Protection", value: "1; mode=block" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(self)",
      },
      {
        key: "Link",
        value: `<https://${MAIN_DOMAIN}>; rel=preconnect`,
      },
    ];

    return [
      {
        source: "/sitemap.xml",
        headers: baseSecurityHeaders,
      },
      {
        source: "/robots.txt",
        headers: baseSecurityHeaders,
      },
      {
        source: "/llms.txt",
        headers: baseSecurityHeaders,
      },
      {
        source: "/((?!sitemap\\.xml|robots\\.txt|llms\\.txt).*)",
        headers: [
          ...baseSecurityHeaders,
          {
            key: "Content-Security-Policy",
            value: csp,
          },
        ],
      },

      // Fontlar üçün cache
      {
        source: "/:path*\\.(woff|woff2|ttf)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },

      // ✅ YENİ: API route-ları üçün no-cache
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate",
          },
        ],
      },
    ];
  },
  async redirects() {
    return redirectData.redirect.map((item) => ({
      source: item.source,
      destination: item.destination,
      statusCode: item.statusCode ?? 301,
    }));
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);

// src/middleware.ts

import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import createMiddleware from "next-intl/middleware";

const i18nMiddleware = createMiddleware(routing);

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/robots.txt") ||
    pathname.startsWith("/llms.txt") ||
    pathname.startsWith("/sitemap") ||
    pathname.startsWith("/.well-known") ||
    pathname.startsWith("/auth")
  ) {
    return NextResponse.next();
  }
  if (pathname.includes("/cdn-cgi/l/email-protection")) {
    return new NextResponse(null, { status: 410 });
  }
  if (pathname.startsWith("/manage")) {
    const response = NextResponse.next();

    return response;
  }

  // ✅ Normal i18n middleware
  const response = i18nMiddleware(req);

  return response;
}

export const config = {
  matcher: ["/(az|en|ru)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};

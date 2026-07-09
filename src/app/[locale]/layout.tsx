import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Inter } from "next/font/google";
import MainLayoutProvider from "../_provider/MainLayoutProvider";
import { routing } from "@/i18n/routing";
import { CustomLocales } from "@/services/interface/type";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  ),
  title: {
    template: "%s",
    default: "Kometa GE",
  },
  description:
    "Kometa GE provides international freight transportation and logistics services from Georgia — road, sea, air and rail freight, FTL, LTL, groupage cargo and heavy machinery logistics.",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    robots: "noai, noimageai",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", rel: "icon", sizes: "any" },
      { url: "/favicon.ico", rel: "icon", type: "image/ico", sizes: "32x32" },
    ],
    apple: [
      {
        url: "/favicon.ico.ioc",
        rel: "apple-touch-icon",
        sizes: "180x180",
        type: "image/ico",
      },
    ],
  },
};

const inter = Inter({
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin", "latin-ext"],
});

interface LocalLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocalLayout({
  children,
  params,
}: LocalLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className="scroll-smooth"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body
        className={`${inter.variable} dark-site bg-background text-foreground antialiased`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <MainLayoutProvider locale={locale as CustomLocales}>
            {children}
          </MainLayoutProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

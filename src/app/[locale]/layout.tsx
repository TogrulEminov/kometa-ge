import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Inter, DM_Sans } from "next/font/google";
import MainLayoutProvider from "../_provider/MainLayoutProvider";
import { routing } from "@/i18n/routing";
import { CustomLocales } from "@/services/interface/type";

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
        className={`${inter.variable} antialiased`}
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

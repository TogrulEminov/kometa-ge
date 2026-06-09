import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/src/i18n/routing";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Inter, DM_Sans } from "next/font/google";
const interSans = Inter({
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin", "latin-ext"],
});

const dmSans = DM_Sans({
  variable: "--font-dmsans",
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
    <html lang={locale} className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${interSans.variable} ${dmSans.variable} antialiased`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

"use client";

import NotFoundContainer from "@/components/notfound";
import "@/styles/globals.css";
import { CustomLocales } from "@/services/interface/type";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";

const inter = Inter({
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin", "latin-ext"],
});

export default function NotFound() {
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] as CustomLocales;
  const validLocale = ["en", "ka"].includes(locale) ? locale : "en";

  return (
    <html lang={validLocale} className="scroll-smooth">
      <body
        className={`${inter.variable} dark-site bg-background text-foreground antialiased`}
      >
        <NotFoundContainer locale={validLocale as CustomLocales} />
      </body>
    </html>
  );
}

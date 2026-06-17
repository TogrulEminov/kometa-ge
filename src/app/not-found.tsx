"use client";

import NotFoundContainer from "@/components/notfound";
import { CustomLocales } from "@/services/interface/type";
import { usePathname } from "next/navigation";

export default function NotFound() {
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] as CustomLocales;
  const validLocale = ["en", "ka"].includes(locale) ? locale : "en";
  return (
    <html lang="en" className="scroll-smooth">
      <body className="--font-inter --font-dmsans antialiased">
        <NotFoundContainer locale={validLocale as CustomLocales} />;
      </body>
    </html>
  );
}

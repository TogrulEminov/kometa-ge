"use client";

import ErrorView from "@/components/error/ErrorView";
import "@/styles/globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin", "latin-ext"],
});

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} dark-site bg-background text-foreground antialiased`}
      >
        <ErrorView locale="en" digest={error.digest} reset={reset} />
      </body>
    </html>
  );
}

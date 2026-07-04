"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BiHome, BiRefresh } from "react-icons/bi";

type ErrorViewProps = {
  locale: "en" | "ka";
  digest?: string;
  reset?: () => void;
};

const translations = {
  en: {
    title: "Something went wrong",
    description:
      "An unexpected error occurred. Please try again or return to the home page.",
    retry: "Try again",
    home: "Home Page",
    errorId: "Error ID",
  },
  ka: {
    title: "დაფიქსირდა შეცდომა",
    description:
      "მოულოდნელი შეცდომა მოხდა. გთხოვთ, სცადოთ ხელახლა ან დაბრუნდეთ მთავარ გვერდზე.",
    retry: "ხელახლა ცდა",
    home: "მთავარი გვერდი",
    errorId: "შეცდომის ID",
  },
};

export default function ErrorView({ locale, digest, reset }: ErrorViewProps) {
  const t = translations[locale];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8 sm:py-12">
      <div className="relative w-full max-w-lg text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="surface-card mx-auto mb-8 max-w-md p-8 sm:p-10"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl">
            ⚠️
          </div>

          <h1 className="mb-3 text-2xl font-bold text-foreground sm:text-3xl">
            {t.title}
          </h1>
          <p className="mb-6 text-sm leading-relaxed text-muted sm:text-base">
            {t.description}
          </p>

          {digest && (
            <div className="mb-6 rounded-xl border border-white/10 bg-surface-elevated px-4 py-3 text-left font-mono text-xs text-muted">
              <span className="font-semibold text-foreground">{t.errorId}:</span>{" "}
              {digest}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            {reset && (
              <button
                type="button"
                onClick={reset}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
              >
                <BiRefresh className="h-4 w-4" />
                {t.retry}
              </button>
            )}
            <Link
              href={`/${locale}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-surface-elevated px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-white/5"
            >
              <BiHome className="h-4 w-4" />
              {t.home}
            </Link>
          </div>
        </motion.div>

        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute -left-4 top-10 h-20 w-20 rounded-full bg-primary/20 blur-3xl sm:-left-10 sm:h-24 sm:w-24"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          className="absolute -right-4 bottom-10 h-24 w-24 rounded-full bg-primary/15 blur-3xl sm:-right-10 sm:h-32 sm:w-32"
        />
      </div>
    </div>
  );
}

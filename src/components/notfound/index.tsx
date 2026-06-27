"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import GoBack from "./button";
import { BiHome } from "react-icons/bi";

type NotFoundContainerProps = {
  locale: "en" | "ka";
};

const translations = {
  en: {
    title: "Page Not Found",
    description:
      "The page you are looking for does not exist or has been moved. Please return to the home page.",
    homeButton: "Home Page",
  },
  ka: {
    title: "გვერდი ვერ მოიძებნა",
    description:
      "გვერდი, რომელსაც ეძებთ, არ არსებობს ან გადატანილია. გთხოვთ, დაბრუნდეთ მთავარ გვერდზე.",
    homeButton: "მთავარი გვერდი",
  },
};

export default function NotFoundContainer({ locale }: NotFoundContainerProps) {
  const t = translations[locale];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8 sm:py-12">
      <div className="relative w-full max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative mb-6 sm:mb-8"
        >
          <h1 className="select-none text-[120px] font-bold leading-none text-primary/15 sm:text-[180px] md:text-[280px]">
            404
          </h1>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="h-24 w-24 rounded-full bg-primary/10 sm:h-32 sm:w-32 md:h-40 md:w-40" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 space-y-3 px-4 sm:mb-12 sm:space-y-4"
        >
          <h2 className="text-2xl font-bold leading-tight text-foreground sm:text-3xl md:text-4xl lg:text-5xl">
            {t.title}
          </h2>
          <p className="mx-auto max-w-md text-base leading-relaxed text-muted sm:text-lg md:text-xl">
            {t.description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12 flex flex-col items-center justify-center gap-3 px-4 sm:mb-16 sm:flex-row sm:gap-4"
        >
          <GoBack locale={locale} />
          <Link
            href={`/${locale}`}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-primary/90 hover:shadow-xl sm:w-auto sm:px-8 sm:py-4 sm:text-base"
          >
            <BiHome className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>{t.homeButton}</span>
          </Link>
        </motion.div>

        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute left-4 top-10 h-16 w-16 rounded-full bg-primary/20 blur-2xl sm:left-10 sm:top-20 sm:h-20 sm:w-20 sm:blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          className="absolute bottom-10 right-4 h-20 w-20 rounded-full bg-primary/15 blur-2xl sm:bottom-20 sm:right-10 sm:h-32 sm:w-32 sm:blur-3xl"
        />
      </div>
    </div>
  );
}

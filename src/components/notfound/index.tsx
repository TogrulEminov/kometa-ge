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
    popularLinks: "Popular pages:",
  },

  ka: {
    title: "გვერდი ვერ მოიძებნა",
    description:
      "გვერდი, რომელსაც ეძებთ, არ არსებობს ან გადატანილია. გთხოვთ, დაბრუნდეთ მთავარ გვერდზე.",
    homeButton: "მთავარი გვერდი",
    popularLinks: "პოპულარული გვერდები:",
  },
};

export default function NotFoundContainer({ locale }: NotFoundContainerProps) {
  const t = translations[locale];

  return (
    <div className="min-h-screen bg-20 flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="max-w-2xl w-full text-center relative">
        {/* 404 Text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative mb-6 sm:mb-8"
        >
          <h1 className="text-[120px] sm:text-[180px] md:text-[280px] font-bold text-26 leading-none select-none">
            404
          </h1>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-6/10" />
          </motion.div>
        </motion.div>

        {/* Title & Description */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-3 sm:space-y-4 mb-8 sm:mb-12 px-4"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-1 leading-tight">
            {t.title}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-12 max-w-md mx-auto leading-relaxed">
            {t.description}
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 mb-12 sm:mb-16"
        >
          <GoBack locale={locale} />
          <Link
            href={`/${locale}`}
            className="group flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-6 text-white bg-primary rounded-lg font-semibold hover:bg-7 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <BiHome className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">{t.homeButton}</span>
          </Link>
        </motion.div>
        {/* Decorative Elements */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-10 sm:top-20 left-4 sm:left-10 w-16 h-16 sm:w-20 sm:h-20 bg-6/20 rounded-full blur-2xl sm:blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          className="absolute bottom-10 sm:bottom-20 right-4 sm:right-10 w-20 h-20 sm:w-32 sm:h-32 bg-7/20 rounded-full blur-2xl sm:blur-3xl"
        />
      </div>
    </div>
  );
}

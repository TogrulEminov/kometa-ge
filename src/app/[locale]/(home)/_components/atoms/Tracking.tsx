"use client";

import { useTranslations } from "next-intl";
import { FaSearch } from "react-icons/fa";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";

const trackingUrl = process.env.NEXT_PUBLIC_TRACKING_WEBSITE_URL;

export default function Tracking() {
  const t = useTranslations("atoms");

  if (!trackingUrl) return null;

  return (
    <div className="lg:max-w-md">
      <a
        href={trackingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-white/15 bg-white/8 px-5 py-4 shadow-2xl shadow-black/25 backdrop-blur-xl transition-all duration-300 hover:border-white/30 hover:bg-white/12 hover:shadow-primary/20"
      >
        <span className="flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/90 text-white transition-colors group-hover:bg-primary">
            <FaSearch className="text-sm" />
          </span>
          <span className="text-left">
            <span className="block text-sm font-bold uppercase tracking-wider text-white">
              {t("components.tracking.button")}
            </span>
            <span className="mt-0.5 block text-xs text-white/50 transition-colors group-hover:text-white/70">
              {t("components.tracking.placeholder")}
            </span>
          </span>
        </span>
        <FaArrowUpRightFromSquare className="shrink-0 text-sm text-white/40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
      </a>
    </div>
  );
}

"use client"
import { useTranslations } from "next-intl";
import { FaSearch } from "react-icons/fa";
import { FaBox } from "react-icons/fa6";

export default function Tracking() {
    const t = useTranslations("atoms");
  return (
    <div className="lg:max-w-lg">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 md:px-2 shadow-2xl shadow-black/20">
        <form className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white">
              <FaBox className="text-lg" />
            </div>
            <input
              type="text"
              placeholder={t("components.tracking.placeholder")}
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-[15px] font-medium focus:outline-none focus:border-white/50 focus:bg-white/10 transition-all duration-300"
            />
          </div>
          <button
            type="submit"
            className="px-8 py-4 bg-linear-to-r bg-primary text-white font-bold text-base tracking-wider capitalize rounded-xl transition-all duration-300 hover:shadow-lg  disabled:opacity-60 disabled:cursor-not-allowed  flex items-center cursor-pointer justify-center gap-3 min-w-30"
          >
            <FaSearch className="text-sm" />
            {t("components.tracking.button")}
          </button>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useParams, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { useRef } from "react";
import { IoChevronDownOutline, IoGlobeOutline } from "react-icons/io5";
import useOutSideClick from "@/hooks/useOutsideClick";
import { CustomLocales } from "@/services/interface/type";

const languages = [
  { code: "en" as const, display: "En" },
  { code: "ka" as const, display: "Ge" },
];

const LOCALES = ["en", "ka"];

export default function Language() {
  const ref = useRef<HTMLDivElement>(null);
  const currentLocale = useLocale() as CustomLocales;
  const { handleToggle, open } = useOutSideClick({ ref });

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={handleToggle}
        className={`flex items-center capitalize gap-1.5 text-[13px] font-semibold duration-300 transition-all px-3 h-8 rounded-lg  bg-primary  md:bg-transparent  cursor-pointer disabled:opacity-50 text-white`}
      >
        <IoGlobeOutline size={15} />
        <span className="min-w-[20px]">{currentLocale.toUpperCase()}</span>
        <IoChevronDownOutline
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          size={12}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full pt-2 z-50">
          <div className="bg-white shadow-xl border border-gray-100 p-1.5 min-w-24 rounded-sm overflow-hidden">
            {languages
              .filter((l) => l.code !== currentLocale)
              .map((l) => (
                <button
                  key={l.code}
                  type="button"
                  className="w-full text-left px-4 py-1.5 text-[13px] font-semibold text-gray-600 hover:bg-primary hover:text-white transition-all duration-200 cursor-pointer rounded-sm disabled:opacity-50"
                >
                  {l.display}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

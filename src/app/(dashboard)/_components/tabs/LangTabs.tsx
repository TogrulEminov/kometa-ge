"use client";

import { createContext, useContext, ReactNode, useMemo, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

const LangContext = createContext<{
  activeLang: string;
  setLang: (v: string) => void;
} | null>(null);

function LangTabsInner({
  children,
  defaultLang = "az",
  className = "",
}: {
  children: ReactNode;
  defaultLang?: string;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeLang = useMemo(() => {
    return searchParams.get("locale") || defaultLang;
  }, [searchParams, defaultLang]);

  const setLang = (lang: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("locale", lang);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <LangContext.Provider value={{ activeLang, setLang }}>
      <div
        className={`flex gap-1 bg-gray-100 p-1 rounded-lg w-fit ${className}`}
      >
        {children}
      </div>
    </LangContext.Provider>
  );
}

function LangTabsSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`flex gap-1 bg-gray-100 p-1 rounded-lg w-fit ${className}`}>
      <div className="h-9 w-24 bg-gray-200 rounded-md animate-pulse" />
      <div className="h-9 w-24 bg-gray-200 rounded-md animate-pulse" />
      <div className="h-9 w-24 bg-gray-200 rounded-md animate-pulse" />
    </div>
  );
}

export function LangTabs({
  children,
  defaultLang = "az",
  className = "",
}: {
  children: ReactNode;
  defaultLang?: string;
  className?: string;
}) {
  return (
    <Suspense fallback={<LangTabsSkeleton className={className} />}>
      <LangTabsInner defaultLang={defaultLang} className={className}>
        {children}
      </LangTabsInner>
    </Suspense>
  );
}

export function LangItem({ value, label }: { value: string; label: string }) {
  const context = useContext(LangContext);
  if (!context) throw new Error("LangItem must be used within LangTabs");

  const isActive = context.activeLang === value;

  return (
    <button
      onClick={() => context.setLang(value)}
      className={`px-10 py-2.5 cursor-pointer text-sm font-medium rounded-md transition-colors duration-200 ${
        isActive
          ? "bg-white text-blue-600 shadow-sm"
          : "text-gray-500 hover:text-gray-700"
      }`}
    >
      {label}
    </button>
  );
}

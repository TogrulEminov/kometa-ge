"use client";

import { createContext, useContext, ReactNode, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// 1. Context Tipi
interface TabsContextType {
  activeTab: string;
  setActiveTab: (key: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context)
    throw new Error("Tabs components must be used within QueryTabs");
  return context;
};

// 2. QueryTabs (Əsas Provider)
export function QueryTabs({
  children,
  defaultTab,
  queryParam = "tab",
  preserveParams = [],
  className = "",
  onChange,
}: {
  children: ReactNode;
  defaultTab?: string;
  queryParam?: string;
  preserveParams?: string[];
  className?: string;
  onChange?: (key: string) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 🔥 STATE LƏĞV EDİLDİ. URL-dən aktiv tabı hesablayırıq.
  const activeTab = useMemo(() => {
    return searchParams.get(queryParam) || defaultTab || "";
  }, [searchParams, queryParam, defaultTab]);

  const handleTabChange = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // Digər parametrləri qoru (əgər preserveParams varsa)
    // Əgər bütün parametrləri qorumaq istəyirsinizsə, sadəcə params.set kifayətdir
    if (preserveParams.length > 0) {
      const filteredParams = new URLSearchParams();
      preserveParams.forEach((p) => {
        const val = params.get(p);
        if (val) filteredParams.set(p, val);
      });
      filteredParams.set(queryParam, key);
      router.push(`${pathname}?${filteredParams.toString()}`, {
        scroll: false,
      });
    } else {
      params.set(queryParam, key);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }

    onChange?.(key);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
      <div className={`w-full ${className}`}>{children}</div>
    </TabsContext.Provider>
  );
}

// 3. Digər Alt Komponentlər (Olduğu kimi qalır, lakin daha təmiz)

export function TabsList({
  children,
  className = "",
  variant = "default",
}: any) {
  const variantStyles = {
    default: "border-b border-gray-200",
    pills: "bg-gray-100 p-1 rounded-lg inline-flex gap-1",
    underline: "border-b-2 border-gray-200",
  };
  return (
    <div
      className={`flex gap-2 ${variantStyles[variant as keyof typeof variantStyles]} ${className}`}
    >
      {children}
    </div>
  );
}

export function TabsTitle({
  value,
  children,
  className = "",
  icon,
  disabled = false,
}: any) {
  const { activeTab, setActiveTab } = useTabs();
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => !disabled && setActiveTab(value)}
      disabled={disabled}
      className={`relative cursor-pointer px-4 py-2 font-medium transition-all ${isActive ? "text-blue-600" : "text-gray-600"} ${className}`}
    >
      <span className="flex items-center gap-2">
        {icon}
        {children}
      </span>
      {isActive && (
        <motion.div
          layoutId="activeTabUnderline"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
        />
      )}
    </button>
  );
}

export function TabsBody({ value, children, className = "" }: any) {
  const { activeTab } = useTabs();
  const isActive = activeTab === value;

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key={value}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
          className={className}
        >
          <div className="pt-4">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

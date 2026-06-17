"use client";

import { createContext, useContext, ReactNode, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion } from "framer-motion";
const RootContext = createContext<{
  activeTabs: Record<string, string>;
  update: (g: string, v: string) => void;
} | null>(null);
const GroupContext = createContext<string | null>(null);

export function MultiQueryTabs({
  children,
  defaultTabs = {},
  preserveParams = [],
}: {
  children: ReactNode;
  defaultTabs?: Record<string, string>;
  preserveParams?: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTabs = useMemo(() => {
    const params: Record<string, string> = { ...defaultTabs };

    searchParams.forEach((v, k) => {
      if (!preserveParams.includes(k)) {
        params[k] = v;
      }
    });

    return params;
  }, [searchParams, preserveParams, defaultTabs]);

  const update = (group: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(group, value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <RootContext.Provider value={{ activeTabs, update }}>
      {children}
    </RootContext.Provider>
  );
}

// 3. Group Wrapper (Artıq 'group' propunu bir dəfə yazırıq)
export function MultiTabGroup({
  group,
  children,
  className = "",
}: {
  group: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <GroupContext.Provider value={group}>
      <div className={className}>{children}</div>
    </GroupContext.Provider>
  );
}

// 4. Hook (Daxili istifadə üçün)
const useTabLogic = () => {
  const root = useContext(RootContext);
  const group = useContext(GroupContext);
  if (!root || !group)
    throw new Error("Must be used within MultiQueryTabs & MultiTabGroup");
  return {
    group,
    active: root.activeTabs[group],
    update: (v: string) => root.update(group, v),
  };
};

// 5. Alt Komponentlər
export function MultiTabsList({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`flex gap-4 border-b ${className}`}>{children}</div>;
}

export function MultiTabsTitle({
  value,
  children,
  className = "",
}: {
  value: string;
  children: ReactNode;
  className?: string;
}) {
  const { group, active, update } = useTabLogic();
  const isActive = active === value;

  return (
    <button
      onClick={() => update(value)}
      className={`relative px-4 py-2 text-sm font-medium ${isActive ? "text-blue-600" : "text-gray-500"} ${className}`}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId={`line-${group}`}
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
        />
      )}
    </button>
  );
}

export function MultiTabsBody({
  value,
  children,
}: {
  value: string;
  children: ReactNode;
}) {
  const { active } = useTabLogic();
  return active === value ? (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-4"
    >
      {children}
    </motion.div>
  ) : null;
}

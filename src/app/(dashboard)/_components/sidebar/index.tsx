"use client";
import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuArrowRight } from "react-icons/lu";
import { authClient } from "@/lib/auth/auth-client";
import { useToggleState } from "@/lib/rich-editor/zustand/functions";
import { getMenuSectionsForRole } from "@/app/(dashboard)/_type/constant";

const Sidebar = () => {
  const pathname = usePathname();
  const { useSession } = authClient;
  const { data: session } = useSession();
  const isSidebarOpen = useToggleState("admin-sidebar");

  const menuSections = useMemo(
    () => getMenuSectionsForRole(session?.user?.role),
    [session?.user?.role],
  );

  return (
    <div
      className={`fixed overflow-y-auto h-full z-40 bg-white pt-20 top-0 w-64 transition-transform duration-300 ease-in-out border-r border-gray-200 ${
        isSidebarOpen ? "-translate-x-full" : "translate-x-0"
      } scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent`}
    >
      <div className="flex flex-col gap-6 p-3">
        {menuSections.map((section) => (
          <div key={section.title}>
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-3 py-1">
              {section.title}
            </h3>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname?.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`group relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all ${
                          isActive
                            ? "bg-blue-700"
                            : "bg-gray-100 group-hover:bg-blue-50"
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 transition-colors ${
                            isActive
                              ? "text-white"
                              : "text-gray-500 group-hover:text-blue-600"
                          }`}
                        />
                      </div>
                      <span className="flex-1 truncate">{item.label}</span>
                      {isActive && (
                        <LuArrowRight className="w-4 h-4 text-white" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(Sidebar);

"use client";

import Link from "next/link";
import { useMemo } from "react";
import { BiPlus } from "react-icons/bi";
import { LuArrowRight, LuLayoutDashboard } from "react-icons/lu";
import { useAdminSession } from "@/app/(dashboard)/manage/AdminSessionProvider";
import {
  getCreateLinkForRoute,
  getMenuSectionsForRole,
} from "@/app/(dashboard)/_type/constant";
import WhiteBlockTitleArea from "../../_components/whiteBlockTitle";

export default function DashboardPage() {
  const { session, isPending } = useAdminSession();

  const menuSections = useMemo(
    () => getMenuSectionsForRole(session?.user?.role ?? undefined),
    [session?.user?.role],
  );

  const totalModules = menuSections.reduce(
    (sum, section) => sum + section.items.length,
    0,
  );

  return (
    <>
      <WhiteBlockTitleArea title="Dashboard" disabled />

      <div className="mb-6 rounded-2xl border border-blue-100 bg-linear-to-r from-blue-50 via-indigo-50 to-white px-6 py-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/30">
              <LuLayoutDashboard className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-600">Welcome back</p>
              <h2 className="text-2xl font-bold text-slate-900">
                {isPending ? "Loading..." : session?.user?.name ?? "Admin"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Role:{" "}
                <span className="font-semibold capitalize text-slate-700">
                  {session?.user?.role ?? "—"}
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="rounded-xl border border-white/80 bg-white/80 px-4 py-3 text-center shadow-sm">
              <p className="text-2xl font-bold text-slate-900">{menuSections.length}</p>
              <p className="text-xs font-medium text-slate-500">Sections</p>
            </div>
            <div className="rounded-xl border border-white/80 bg-white/80 px-4 py-3 text-center shadow-sm">
              <p className="text-2xl font-bold text-slate-900">{totalModules}</p>
              <p className="text-xs font-medium text-slate-500">Modules</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {menuSections.map((section) => (
          <section
            key={section.title}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  {section.title}
                </h3>
                <p className="text-sm text-slate-500">
                  {section.items.length} available modules
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {section.items.map((item) => {
                const Icon = item.icon;
                const createLink = getCreateLinkForRoute(item.href);

                return (
                  <div
                    key={item.href}
                    className="group rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition-all hover:border-blue-200 hover:bg-blue-50/40 hover:shadow-md"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm ring-1 ring-slate-200 transition-all group-hover:bg-blue-600 group-hover:text-white group-hover:ring-blue-200">
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {item.label}
                        </p>
                        <p className="mt-1 truncate text-xs text-slate-500">
                          {item.href}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <Link
                            href={item.href}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-blue-700"
                          >
                            Open
                            <LuArrowRight className="h-3.5 w-3.5" />
                          </Link>

                          {createLink ? (
                            <Link
                              href={createLink}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition-all hover:border-blue-200 hover:text-blue-600"
                            >
                              <BiPlus className="h-3.5 w-3.5" />
                              Create
                            </Link>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

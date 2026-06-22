"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import BranchModal from "./atoms/BranchModal";
import { AboutMainType, BranchItem, newInfoJson } from "@/services/interface/type";
import { findJsonSection } from "@/utils/findJsonSection";
import { sanitizeHtml } from "@/lib/domburify";
import { useTranslations } from "next-intl";

export default function BranchCards({
  aboutInfo,
}: {
  aboutInfo: AboutMainType;
}) {
  const t = useTranslations("atoms.components.branchModal");
  const aboutInfoTr = aboutInfo?.translations?.[0];
  const branches = aboutInfo?.branches ?? [];
  const branchesInfo = findJsonSection<newInfoJson>(
    aboutInfoTr?.description ?? "",
    "branches",
  );
  const [selected, setSelected] = useState<BranchItem | null>(null);
  if (!branchesInfo || !branches.length) return null;
  return (
    <div id="section-branches" className="reveal">
      <span className="text-sm font-medium text-primary mb-4 tracking-wide uppercase">
        {branchesInfo?.subTitle}
      </span>
      <h2
        title={branchesInfo?.title}
        className="font-display text-4xl font-bold mb-6"
      >
        {branchesInfo?.title}
      </h2>
      {branchesInfo?.description && (
        <article
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(branchesInfo?.description ?? ""),
          }}
          className="text-gray-500 leading-relaxed text-lg mb-10"
        />
      )}

      <div className="space-y-3">
        {branches.map((branch) => {
          const isActive = branch.status === "ACTIVE";
          const countryName = branch.translations[0]?.countryName ?? "";
          const officeCount = branch.offices.filter(
            (o) => o.type === "office",
          ).length;
          const warehouseCount = branch.offices.filter(
            (o) => o.type === "warehouse",
          ).length;

          return (
            <div
              key={branch.id}
              onClick={() => setSelected(branch)}
              className="border border-gray-200 hover:border-gray-300 hover:shadow-sm rounded-2xl p-5 flex items-center justify-between cursor-pointer transition-all duration-200 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-secondary">
                      {countryName}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">
                      {branch.isoCode}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    {branch.offices.length === 0
                      ? t("coming_soon")
                      : branch.offices.length === 1
                        ? t("one_location")
                        : t("locations_count", {
                            count: branch.offices.length,
                          })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {officeCount > 0 && (
                  <span className="hidden sm:inline-flex text-xs font-medium px-2.5 py-1 rounded-full bg-primary/8 text-primary">
                    {t("office_count", { count: officeCount })}
                  </span>
                )}
                {warehouseCount > 0 && (
                  <span className="hidden sm:inline-flex text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">
                    {t("warehouse_count", { count: warehouseCount })}
                  </span>
                )}
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    isActive
                      ? "bg-green-50 text-green-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {isActive ? t("active") : t("planned")}
                </span>
                <svg
                  className="w-4 h-4 text-gray-300 group-hover:text-gray-400 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {selected && (
          <BranchModal branch={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

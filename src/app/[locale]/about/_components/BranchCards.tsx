"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Branch } from "@/services/dto/branch.types";
import BranchModal from "./atoms/BranchModal";

const branches: Branch[] = [
  {
    id: "az",
    iso: "AZE",
    country: "Azərbaycan",
    subtitle: "Baş ofis",
    status: "ACTIVE",
    offices: [
      {
        id: "az-1",
        type: "office",
        city: "Bakı",
        address: "Bakı şəhəri, Nərimanov rayonu, Heydər Əliyev prospekti 152",
      },
    ],
  },
  {
    id: "cn",
    iso: "CHN",
    country: "Çin",
    subtitle: "3 məkan",
    status: "ACTIVE",
    offices: [
      {
        id: "cn-1",
        type: "warehouse",
        city: "Yiwu",
        address:
          "Çin, Cinhua şəhəri, Yiwu şəhəri, Xizhan prospekti 800, Çjezyan əyaləti",
      },
      {
        id: "cn-2",
        type: "warehouse",
        city: "Guangzhou",
        address:
          "Çin, Quançjou şəhəri, Baiyun rayonu, Shui She Nan küçəsindən 100 metr şimalda, Quançdun əyaləti",
      },
      {
        id: "cn-3",
        type: "warehouse",
        city: "Horgos",
        address: "Horgos Şəhəri İpək Yolu Rongteng Gömrük Nəzarət Anbarı",
      },
    ],
  },
  {
    id: "tr",
    iso: "TUR",
    country: "Türkiyə",
    subtitle: "Gözlənilir",
    status: "PLANNED",
    offices: [],
  },
  {
    id: "kz",
    iso: "KAZ",
    country: "Qazaxıstan",
    subtitle: "1 məkan",
    status: "ACTIVE",
    offices: [
      {
        id: "kz-1",
        type: "office",
        city: "Almatı",
        address: "Almatı Şəhəri, Seyfullin Prospekti 410/78, Qazaxıstan",
      },
    ],
  },
  {
    id: "ge",
    iso: "GEO",
    country: "Gürcüstan",
    subtitle: "1 məkan",
    status: "ACTIVE",
    offices: [
      {
        id: "ge-1",
        type: "office",
        city: "Tbilisi",
        address: "Tbilisi, Rustaveli prospekti 14, Gürcüstan",
      },
    ],
  },
];

export default function BranchCards() {
  const [selected, setSelected] = useState<Branch | null>(null);

  return (
    <div id="section-branches" className="reveal">
      <p className="text-sm font-medium text-primary mb-4 tracking-wide uppercase">
        04 / Filiallar
      </p>
      <h2 className="font-display text-4xl font-bold mb-6">
        Beynəlxalq filiallarımız
      </h2>
      <p className="text-gray-500 leading-relaxed text-lg mb-10">
        Dünyanın müxtəlif ölkələrində yerləşən filiallarımız vasitəsilə qlobal
        logistika şəbəkəmizi genişləndiririk.
      </p>

      <div className="space-y-3">
        {branches.map((branch) => {
          const isActive = branch.status === "ACTIVE";
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
                      {branch.country}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">
                      {branch.iso}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{branch.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {officeCount > 0 && (
                  <span className="hidden sm:inline-flex text-xs font-medium px-2.5 py-1 rounded-full bg-primary/8 text-primary">
                    {officeCount} ofis
                  </span>
                )}
                {warehouseCount > 0 && (
                  <span className="hidden sm:inline-flex text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">
                    {warehouseCount} anbar
                  </span>
                )}
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    isActive
                      ? "bg-green-50 text-green-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {isActive ? "Aktiv" : "Gözlənilir"}
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

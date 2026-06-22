"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BranchItem } from "@/services/interface/type";
import { useTranslations } from "next-intl";

interface Props {
  branch: BranchItem;
  onClose: () => void;
}

function getBranchSubtitle(
  branch: BranchItem,
  t: ReturnType<typeof useTranslations<"atoms.components.branchModal">>,
) {
  const total = branch.offices.length;
  if (total === 0) return t("coming_soon");
  if (total === 1) return t("one_location");
  return t("locations_count", { count: total });
}

export default function BranchModal({ branch, onClose }: Props) {
  const isActive = branch.status === "ACTIVE";
  const t = useTranslations("atoms.components.branchModal");
  const countryName = branch.translations[0]?.countryName ?? "";
  const subtitle = getBranchSubtitle(branch, t);
  const hasLocations = branch.offices.length > 0;
  const officeCount = branch.offices.filter((o) => o.type === "office").length;
  const warehouseCount = branch.offices.filter(
    (o) => o.type === "warehouse",
  ).length;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const LocationList = () => (
    <>
      {hasLocations ? (
        <div className="space-y-2">
          {branch.offices.map((office, i) => (
            <motion.div
              key={office.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.25 }}
              className="border border-gray-100 rounded-xl p-3.5"
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500 flex-shrink-0">
                  {i + 1}
                </span>
                <span className="text-sm font-semibold text-secondary">
                  {office.translations?.[0]?.city}
                </span>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ml-auto ${
                    office.type === "warehouse"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-primary/8 text-primary"
                  }`}
                >
                  {office.type === "warehouse" ? t("warehouse") : t("office")}
                </span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed pl-[34px]">
                {office.translations?.[0]?.address}
              </p>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
            <svg
              className="w-6 h-6 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-secondary mb-1">
            {t("no_locations")}
          </p>
          <p className="text-xs text-gray-400">{t("coming_soon_description")}</p>
        </motion.div>
      )}
    </>
  );

  const CloseIcon = () => (
    <svg
      className="w-4 h-4 text-gray-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-secondary/40 backdrop-blur-sm z-[1119]"
        onClick={onClose}
      />

      {/* Desktop modal */}
      <div
        key="desktop"
        className="hidden md:flex fixed inset-0 z-[1120] items-center justify-center p-4 pointer-events-none"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 10 }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
          className="pointer-events-auto w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[80vh]"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-mono font-semibold text-primary">
                {branch.isoCode}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-secondary">{countryName}</p>
              <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors flex-shrink-0"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto flex-1 px-6 py-5">
            <LocationList />
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {officeCount > 0 && (
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/8 text-primary">
                  {t("office_count", { count: officeCount })}
                </span>
              )}
              {warehouseCount > 0 && (
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">
                  {t("warehouse_count", { count: warehouseCount })}
                </span>
              )}
            </div>
            <span
              className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                isActive
                  ? "bg-green-50 text-green-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {isActive && (
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              )}
              {isActive ? t("active") : t("planned")}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Mobile bottom sheet */}
      <div
        key="mobile"
        className="md:hidden fixed inset-x-0 bottom-0 z-[101] flex flex-col"
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 350, damping: 32 }}
          className="bg-white rounded-t-3xl shadow-xl flex flex-col max-h-[85vh] overflow-hidden"
        >
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-2" onClick={onClose}>
            <div className="w-10 h-1 rounded-full bg-gray-200" />
          </div>

          {/* Header */}
          <div className="px-5 pb-4 border-b border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-mono font-semibold text-primary">
                {branch.isoCode}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-secondary">{countryName}</p>
              <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Badges */}
          {(officeCount > 0 || warehouseCount > 0) && (
            <div className="px-5 pt-3 flex gap-2">
              {officeCount > 0 && (
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/8 text-primary">
                  {t("office_count", { count: officeCount })}
                </span>
              )}
              {warehouseCount > 0 && (
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">
                  {t("warehouse_count", { count: warehouseCount })}
                </span>
              )}
            </div>
          )}

          {/* Body */}
          <div className="overflow-y-auto flex-1 px-5 py-4">
            <LocationList />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

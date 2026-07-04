"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BranchItem } from "@/services/interface/type";
import { useTranslations } from "next-intl";

interface Props {
  branch: BranchItem;
  onClose: () => void;
}

const MODAL_BG = "#141824";
const MODAL_ELEVATED = "#1a2030";
const MODAL_TEXT = "#f1f5f9";
const MODAL_MUTED = "#94a3b8";

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
              className="rounded-xl border border-white/10 p-3.5"
              style={{ backgroundColor: MODAL_ELEVATED }}
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-medium"
                  style={{ backgroundColor: MODAL_BG, color: MODAL_MUTED }}
                >
                  {i + 1}
                </span>
                <span
                  className="text-sm font-semibold"
                  style={{ color: MODAL_TEXT }}
                >
                  {office.translations?.[0]?.city}
                </span>
                <span
                  className={`ml-auto ${
                    office.type === "warehouse"
                      ? "badge-branch-warehouse"
                      : "badge-branch-office"
                  }`}
                >
                  {office.type === "warehouse" ? t("warehouse") : t("office")}
                </span>
              </div>
              <p
                className="pl-[34px] text-xs leading-relaxed"
                style={{ color: MODAL_MUTED }}
              >
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
          <div
            className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{ backgroundColor: MODAL_ELEVATED }}
          >
            <svg
              className="h-6 w-6"
              style={{ color: MODAL_MUTED }}
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
          <p className="mb-1 text-sm font-medium" style={{ color: MODAL_TEXT }}>
            {t("no_locations")}
          </p>
          <p className="text-xs" style={{ color: MODAL_MUTED }}>
            {t("coming_soon_description")}
          </p>
        </motion.div>
      )}
    </>
  );

  const CloseIcon = () => (
    <svg
      className="h-4 w-4"
      style={{ color: MODAL_MUTED }}
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

  const modalShellClass =
    "pointer-events-auto flex w-full max-w-md flex-col overflow-hidden rounded-2xl border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.45)]";

  const Header = () => (
    <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
        <span className="text-xs font-mono font-semibold text-primary">
          {branch.isoCode}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold" style={{ color: MODAL_TEXT }}>
          {countryName}
        </p>
        <p className="mt-0.5 text-xs" style={{ color: MODAL_MUTED }}>
          {subtitle}
        </p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-white/10"
        style={{ backgroundColor: MODAL_ELEVATED }}
      >
        <CloseIcon />
      </button>
    </div>
  );

  const Footer = () => (
    <div className="flex items-center justify-between border-t border-white/10 px-6 py-4">
      <div className="flex items-center gap-2">
        {officeCount > 0 && (
          <span className="badge-branch-office">
            {t("office_count", { count: officeCount })}
          </span>
        )}
        {warehouseCount > 0 && (
          <span className="badge-branch-warehouse">
            {t("warehouse_count", { count: warehouseCount })}
          </span>
        )}
      </div>
      <span
        className={`flex items-center gap-1.5 ${
          isActive ? "badge-branch-active" : "badge-branch-planned"
        }`}
      >
        {isActive && (
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
        )}
        {isActive ? t("active") : t("planned")}
      </span>
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[1119] bg-black/65 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        key="desktop"
        className="pointer-events-none fixed inset-0 z-[1120] hidden items-center justify-center p-4 md:flex"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 10 }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
          className={`${modalShellClass} max-h-[80vh]`}
          style={{ backgroundColor: MODAL_BG, color: MODAL_TEXT }}
        >
          <Header />
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <LocationList />
          </div>
          <Footer />
        </motion.div>
      </div>

      <div
        key="mobile"
        className="fixed inset-x-0 bottom-0 z-[1120] flex flex-col md:hidden"
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 350, damping: 32 }}
          className="flex max-h-[85vh] flex-col overflow-hidden rounded-t-3xl border border-white/10 shadow-xl"
          style={{ backgroundColor: MODAL_BG, color: MODAL_TEXT }}
        >
          <div className="flex justify-center pt-3 pb-2" onClick={onClose}>
            <div className="h-1 w-10 rounded-full bg-white/20" />
          </div>
          <div className="flex items-center gap-3 border-b border-white/10 px-5 pb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <span className="text-xs font-mono font-semibold text-primary">
                {branch.isoCode}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold" style={{ color: MODAL_TEXT }}>
                {countryName}
              </p>
              <p className="mt-0.5 text-xs" style={{ color: MODAL_MUTED }}>
                {subtitle}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: MODAL_ELEVATED }}
            >
              <CloseIcon />
            </button>
          </div>
          {(officeCount > 0 || warehouseCount > 0) && (
            <div className="flex gap-2 px-5 pt-3">
              {officeCount > 0 && (
                <span className="badge-branch-office">
                  {t("office_count", { count: officeCount })}
                </span>
              )}
              {warehouseCount > 0 && (
                <span className="badge-branch-warehouse">
                  {t("warehouse_count", { count: warehouseCount })}
                </span>
              )}
            </div>
          )}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <LocationList />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

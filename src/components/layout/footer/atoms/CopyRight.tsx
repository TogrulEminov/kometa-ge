"use client";
import { useTranslations } from "next-intl";

export default function CopyRight() {
  const t = useTranslations("atoms.components.footer");
  const currentYear = new Date().getFullYear();

  return (
    <p className="text-white/40 text-sm font-medium">
      {t("copy_right", { year: currentYear })}
    </p>
  );
}

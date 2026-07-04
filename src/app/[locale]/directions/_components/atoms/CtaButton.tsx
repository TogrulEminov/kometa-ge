"use client";
import { useToggleStore } from "@/hooks/useToggleStore";
import { shipmentModalKey } from "@/services/interface/constant-keys";
import { useTranslations } from "next-intl";

export default function CtaButton() {
  const t = useTranslations("atoms.buttons");
  const { open } = useToggleStore();
  return (
    <button
      type="button"
      className="bg-primary cursor-pointer text-white font-bold py-4 px-8 rounded-xl hover:bg-primary/90 transition-colors duration-300"
      onClick={() => open(shipmentModalKey)}
    >
      {t("get_a_quote")}
    </button>
  );
}

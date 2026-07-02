"use client";

import { fetchSocialsByKey } from "@/actions/ui/main.controller";
import { clearPhoneRegex } from "@/lib/domburify";
import { SocialMediaKey } from "@/services/interface/type";
import { useTranslations } from "next-intl";
import { FaWhatsapp } from "react-icons/fa6";

export  default async function StickyWhatsApp() {
  const t = useTranslations("atoms.components.contactInfo");
  const whatsapp =await fetchSocialsByKey({ key: SocialMediaKey.whatsapp });
  if (!whatsapp?.socialLink) {
    return null;
  }
  return (
    <a
      href={whatsapp.socialLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("whatsapp")}
      title={t("whatsapp")}
      className="group fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-[1000] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/25 transition-all duration-300 hover:scale-105 hover:bg-[#20bd5a] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <span
        aria-hidden
        className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping group-hover:opacity-0"
      />
      <FaWhatsapp className="relative h-7 w-7" />
    </a>
  );
}

"use client"
import { Button } from "antd";
import { useTranslations } from "next-intl";
import { FaPaperPlane } from "react-icons/fa6";

export default function CtaButton() {
    const t = useTranslations("atoms.components.cta");
  return (
    <Button
      type="primary"
      size="large"
      className="!mt-10 !h-14 !w-full !rounded-xl !bg-[#b11226] !text-sm !font-bold uppercase tracking-[0.08em] !text-white hover:!bg-[#8f0e1f] hover:!shadow-xl hover:!shadow-[#b11226]/20 transition-all duration-300"
    >
      <FaPaperPlane className="mr-2" />
      {t("send_request")}
    </Button>
  );
}

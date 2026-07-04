 
import { FaPhoneAlt } from "react-icons/fa";
import SectionContentComponent from "@/components/SectionContent";
import { CustomLocales } from "@/services/interface/type";
import {
  fetchContactInformation,
  fetchSectionByKeys,
} from "@/actions/ui/main.controller";
import { clearPhoneRegex } from "@/lib/domburify";
import { getTranslations } from "next-intl/server";
import CtaButton from "./atoms/CtaButton";
import { FaEnvelope, FaMap, FaWhatsapp } from "react-icons/fa6";

export default async function CTASection({
  locale,
}: {
  locale: CustomLocales;
}) {
  const sectionContent = await fetchSectionByKeys({
    key: "contact",
    locale: locale as CustomLocales,
  });
  const t = await getTranslations("atoms.components.cta");
  const contactInfoData = await fetchContactInformation(locale);
  const contactInfoTr = contactInfoData?.translations?.[0];
  const sectionContentTr = sectionContent?.translations?.[0];
  if (!sectionContentTr || !contactInfoTr) return null;
  const contactInfo = [
    {
      icon: <FaPhoneAlt />,
      label: t("phone"),
      value: contactInfoData?.phone ?? "",
      href: `tel:${clearPhoneRegex(contactInfoData?.phone ?? "")}`,
    },
    {
      icon: <FaEnvelope />,
      label: t("email"),
      value: contactInfoData?.email ?? "",
      href: `mailto:${contactInfoData?.email ?? ""}`,
    },
    {
      icon: <FaMap />,
      label: t("address"),
      value: contactInfoTr?.adress ?? "",
      href: contactInfoData?.adressLink ?? "",
    },
    {
      icon: <FaWhatsapp />,
      label: t("whatsapp"),
      value: contactInfoData?.whatsapp ?? "",
      href: `https://wa.me/${clearPhoneRegex(contactInfoData?.whatsapp ?? "")}`,
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-background py-10 lg:py-20">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionContentComponent
          subTitle={sectionContentTr?.subTitle ?? ""}
          title={sectionContentTr?.title ?? ""}
          type="vertical"
          description={sectionContentTr?.description ?? ""}
        />

        <div className="grid items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Left — Contact Info Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {contactInfo.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="group flex flex-col items-start gap-4 rounded-2xl border border-white/10 bg-surface p-6 transition-all duration-300 hover:border-primary/30 hover:bg-surface-elevated hover:shadow-xl hover:shadow-primary/10"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#b11226]/[0.08] text-lg text-[#b11226] transition-all duration-300 group-hover:bg-[#b11226] group-hover:text-white group-hover:scale-105">
                  {item.icon}
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm font-bold text-foreground leading-snug">
                    {item.value}
                  </p>
                </div>
              </a>
            ))}
          </div>

          {/* Right — Dark CTA Card */}
          <div className="relative overflow-hidden rounded-2xl bg-[#1c1e29] p-8 sm:p-10">
            {/* Background glow effects */}
            <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-[#b11226]/[0.12] blur-[100px]" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[#b11226]/[0.06] blur-[80px]" />
            <div className="absolute top-0 right-0 h-px w-full bg-gradient-to-l from-[#b11226]/20 via-transparent to-transparent" />

            <div className="relative">
              {/* Icon */}
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#b11226] text-2xl text-white shadow-lg shadow-[#b11226]/20">
                <FaPhoneAlt />
              </div>

              <h3 className="mt-7 text-2xl font-black text-white leading-tight">
                {t("request_a_callback")}
              </h3>

              <p className="mt-3 text-sm leading-[1.7] text-white/40">
                {t("leave_your_phone_number")}
              </p>

              {/* CTA Button */}
              <CtaButton />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

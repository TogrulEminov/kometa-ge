"use client";

import { clearPhoneRegex } from "@/lib/domburify";
import {
  IContactInformation,
  newInfoJson,
  Social,
} from "@/services/interface/type";
import { renderSocialIcon } from "@/utils/renderSocialIcon";
import { useTranslations } from "next-intl";
import { FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa6";

export default function StickySidebar({
  descriptionTitles,
  contactInfo,
  socials,
}: {
  descriptionTitles: newInfoJson[];
  contactInfo: IContactInformation;
  socials: Social[];
}) {
  return (
    <div className="lg:sticky lg:top-30   space-y-6">
      {/* Navigation */}
      {descriptionTitles && (
        <Navigation descriptionTitles={descriptionTitles} />
      )}
      <ContactInfo contactInfo={contactInfo} socials={socials} />
    </div>
  );
}

export function Navigation({
  descriptionTitles,
}: {
  descriptionTitles: newInfoJson[];
}) {
  const t = useTranslations("atoms.components.stickySidebar");
  return (
    <div className="surface-card rounded-2xl p-6 lg:p-8">
      <h3 className="font-bold text-foreground mb-5 text-lg">{t("table_of_contents")}</h3>
      <ul className="space-y-2.5">
        {descriptionTitles.map((item) => (
          <li key={item.type}>
            <a
              href={`#section-${item.type}`}
              className="text-sm text-muted hover:text-primary transition-colors flex items-center gap-2.5 py-1.5 group"
            >
              <span className="w-1.5 h-1.5 bg-white/20 group-hover:bg-primary rounded-full transition-colors" />
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
export function ContactInfo({
  contactInfo,
  socials,
}: {
  contactInfo: IContactInformation;
  socials: Social[];
}) {
  const t = useTranslations("atoms.components.contactInfo");
  const constactData = [
    {
      icon: <FaPhoneAlt />,
      label: t("phone"),
      value: contactInfo?.phone,
      sub: t("support"),
      href: `tel:${clearPhoneRegex(contactInfo?.phone)}`,
    },
    {
      icon: <FaEnvelope />,
      label: t("email"),
      value: contactInfo?.email,
      sub: contactInfo?.email,
      href: `mailto:${contactInfo?.email}`,
    },
    {
      icon: <FaMapMarkerAlt />,
      label: t("address"),
      value: contactInfo?.translations?.[0]?.adress,
      sub: contactInfo?.translations?.[0]?.adress,
      href: contactInfo?.adressLink ?? "",
    },
  ];

  return (
    <div className="bg-secondary rounded-2xl p-6 lg:p-8 text-white lg:block hidden">
      <h4 className="font-bold text-lg mb-1">{t("contact_us")}</h4>
      <p className="text-sm text-gray-400 mb-6">
        {t("contact_us_description")}
      </p>
      <div className="space-y-4 mb-6">
        {constactData.map((item, i) => (
          <a
            key={i}
            href={item.href}
            className="flex items-start gap-3 group hover:bg-white/5 rounded-xl p-2 -mx-2 transition-colors"
          >
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary/30 transition-colors">
              <span className="text-primary">{item.icon}</span>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-0.5">{item.label}</div>
              <div className="text-sm font-medium text-white group-hover:text-primary transition-colors">
                {item.value}
              </div>
              <div className="text-xs text-gray-500">{item.sub}</div>
            </div>
          </a>
        ))}
      </div>
      {contactInfo?.whatsapp && (
        <a
          href={`https://wa.me/${clearPhoneRegex(contactInfo?.whatsapp ?? "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-[#25D366]/25 mb-6"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          {t("whatsapp")}
        </a>
      )}
      {socials.length > 0 && (
        <div className="pt-5 border-t border-white/10">
          <div className="text-xs text-gray-400 mb-3 uppercase tracking-wider font-medium">
            {t("social_networks")}
          </div>
          <div className="flex flex-wrap gap-2">
            {socials.map((social) => (
              <a
                key={social.id}
                href={social.socialLink ?? ""}
                target="_blank"
                rel="noopener noreferrer"
                className={`size-10 shrink-0 rounded-xl bg-white/10 flex items-center justify-center text-gray-400 transition-all duration-300  hover:bg-primary hover:text-white`}
                title={social.socialName}
              >
                {renderSocialIcon({
                  iconName: social.iconName,
                })}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

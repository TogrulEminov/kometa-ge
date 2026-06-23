"use client";

import { Link } from "@/i18n/navigation";
import { directionDetailHref } from "@/i18n/href";
import { clearPhoneRegex } from "@/lib/domburify";
import {
  DirectionsType,
  IContactInformation,
  Social,
} from "@/services/interface/type";
import { renderSocialIcon } from "@/utils/renderSocialIcon";
import { useTranslations } from "next-intl";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaWhatsapp,
} from "react-icons/fa";

export default function LeftSidebar({
  directionCollections,
  contactInfo,
  socials,
}: {
  directionCollections: DirectionsType[];
  contactInfo: IContactInformation;
  socials: Social[];
}) {
  const t = useTranslations("atoms.components.stickySidebar");
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-secondary font-bold text-lg mb-5 flex items-center gap-2">
          <span className="w-1 h-5 bg-primary rounded-full" />
          {t("directions_titles")}
        </h3>
        <div className="space-y-2">
          {directionCollections?.map((direction) => {
            const directionTr = direction.translations?.[0];
            return (
              <Link
                href={directionDetailHref(directionTr?.slug ?? "")}
                key={direction.id}
                className="px-4 py-3.5 w-full block rounded-xl bg-primary text-white shadow-lg text-sm font-medium"
              >
                {directionTr?.navTitle ?? directionTr?.title}
              </Link>
            );
          })}
        </div>
      </div>
      <ContactBox />
      <ContactInformationBox contactInfo={contactInfo} />
      <SocialsBox socials={socials} />
    </div>
  );
}
export function ContactBox() {
  const t = useTranslations("atoms.components.stickySidebar");
  return (
    <div className="bg-linear-to-br from-primary to-[#8a0d1e] rounded-2xl p-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      <h3 className="text-white font-bold text-lg mb-2 relative z-10">
        {t("contact.title")}
      </h3>
      <p className="text-white/70 text-sm mb-5 relative z-10">
        {t("contact.description")}
      </p>
      <Link
        href="/contact"
        className="w-full flex items-center justify-center gap-2 bg-white text-primary font-bold py-3 px-4 rounded-xl hover:bg-tertiary transition-colors duration-300 relative z-10"
      >
        <FaPhoneAlt className="w-4 h-4" />
        {t("contact.button")}
      </Link>
    </div>
  );
}
export function ContactInformationBox({
  contactInfo,
}: {
  contactInfo: IContactInformation;
}) {
  const t = useTranslations("atoms.components.stickySidebar");
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
      <h3 className="text-secondary font-bold text-lg mb-4">
        {t("contact.name")}
      </h3>
      <div className="space-y-3">
        {contactInfo?.phone && (
          <div className="flex items-center gap-3 text-secondary/70 text-sm">
            <div className="w-9 h-9 rounded-lg bg-tertiary flex items-center justify-center text-primary text-xs font-bold">
              <FaPhoneAlt className="w-4 h-4" />
            </div>
            <a
              href={`tel:${clearPhoneRegex(contactInfo?.phone)}`}
              className="hover:underline"
            >
              {contactInfo?.phone}
            </a>
          </div>
        )}
        {contactInfo?.email && (
          <div className="flex items-center gap-3 text-secondary/70 text-sm">
            <div className="w-9 h-9 rounded-lg bg-tertiary flex items-center justify-center text-primary text-xs font-bold">
              <FaEnvelope className="w-4 h-4" />
            </div>
            <a href={`mailto:${contactInfo?.email}`} className="hover:underline">
              {contactInfo?.email}
            </a>
          </div>
        )}
        {contactInfo?.translations?.[0]?.adress && (
          <div className="flex items-center gap-3 text-secondary/70 text-sm">
            <div className="w-9 h-9 rounded-lg bg-tertiary flex items-center justify-center text-primary text-xs font-bold">
              <FaMapMarkerAlt className="w-4 h-4" />
            </div>
            {contactInfo?.adressLink ? (
              <a href={contactInfo?.adressLink} className="hover:underline">
                {contactInfo?.translations?.[0]?.adress}
              </a>
            ) : (
              <span>{contactInfo?.translations?.[0]?.adress}</span>
            )}
          </div>
        )}
        {contactInfo?.whatsapp && (
          <div className="flex items-center gap-3 text-secondary/70 text-sm">
            <div className="w-9 h-9 rounded-lg bg-tertiary flex items-center justify-center text-primary text-xs font-bold">
              <FaWhatsapp className="w-4 h-4" />
            </div>
            <a
              href={`https://wa.me/${clearPhoneRegex(contactInfo?.whatsapp)}`}
              className="hover:underline"
            >
              {contactInfo?.whatsapp}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
export function SocialsBox({ socials }: { socials: Social[] }) {
  const t = useTranslations("atoms.components");
  return (
    <div className="bg-secondary rounded-2xl p-6 shadow-xl">
      <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">
        {t("stickySidebar.social_networks")}
      </h3>
      <div className="flex gap-3">
        {socials.map((social) => (
          <a
            key={social.id}
            href={social.socialLink ?? ""}
            target="_blank"
            rel="noopener noreferrer"
            className="size-10 p-3 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary transition-colors duration-300"
          >
            {renderSocialIcon({
              iconName: social.iconName,
            })}
          </a>
        ))}
      </div>
    </div>
  );
}

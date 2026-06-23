import { clearPhoneRegex } from "@/lib/domburify";
import { IContactInformation } from "@/services/interface/type";
import { useTranslations } from "next-intl";
import React from "react";
import {
  FaClock,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";


export default function InfoxBox({ contactInfo }: { contactInfo: IContactInformation }) {
  const t=useTranslations("atoms.components.contactInfo");
  const contactInfoData = [
    {
      icon: FaPhoneAlt,
      label: t("phone"), 
      value: contactInfo?.phone,
      href: `tel:${clearPhoneRegex(contactInfo?.phone)}`,  
    },
    {
      icon: FaEnvelope,
      label: t("email"),
      value: contactInfo?.email,
      href: `mailto:${contactInfo?.email}`,
    },
    {
      icon: FaMapMarkerAlt,
      label: t("address"), 
      value: contactInfo?.translations?.[0]?.adress,
      href: contactInfo?.adressLink ?? "",
    },
    {
      icon: FaClock,
      label: t("whatsapp"),
      value: contactInfo?.whatsapp,
      href: `https://wa.me/${clearPhoneRegex(contactInfo?.whatsapp)}`,
    },
  ];
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
      {contactInfoData.map((item, i) => (
        <a
          key={i}
          href={item.href}
          className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
        >
          <div className="w-12 h-12 bg-gray-50 group-hover:bg-primary rounded-2xl flex items-center justify-center mb-4 transition-all duration-300">
            <item.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
          </div>
          <div className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">
            {item.label}
          </div>
          <div className="text-base font-semibold text-secondary group-hover:text-primary transition-colors duration-300">
            {item.value}
          </div>
        </a>
      ))}
    </div>
  );
}

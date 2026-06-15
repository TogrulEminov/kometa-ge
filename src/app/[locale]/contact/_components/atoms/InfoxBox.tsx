import React from "react";
import {
  FaClock,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";

const contactInfo = [
  {
    icon: FaPhoneAlt,
    label: "Phone",
    value: "+994 55 262 40 37",
    href: "tel:+994552624037",
  },
  {
    icon: FaEnvelope,
    label: "Email",
    value: "info@kometa.ge",
    href: "mailto:info@kometa.ge",
  },
  {
    icon: FaMapMarkerAlt,
    label: "Address",
    value: "Baku, Azerbaijan",
    href: "#",
  },
  {
    icon: FaClock,
    label: "Working Hours",
    value: "Mon - Fri: 09:00 - 18:00",
    href: "#",
  },
];

export default function InfoxBox() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
      {contactInfo.map((item, i) => (
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

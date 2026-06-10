"use client";
import Link from "next/link";
import Logo from "@/components/Logo";
import { FaPhoneAlt, FaEnvelope, FaClock, FaMap } from "react-icons/fa";
import { availableIcons, renderSocialIcon } from "@/utils/renderSocialIcon";
const mainLinks = [
  { name: "About Us", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Directions", href: "/directions" },
  { name: "Photo Gallery", href: "/media/photo-gallery" },
  { name: "Video Gallery", href: "/media/video-gallery" },
];

const serviceLinks = [
  { name: "Road Freight Transport", href: "/services/road-freight" },
  { name: "Sea Freight Transport", href: "/services/sea-freight" },
  { name: "Air Freight Transport", href: "/services/air-freight" },
  { name: "Heavy Cargo Transport", href: "/services/heavy-cargo" },
  { name: "Rail Freight Transport", href: "/services/rail-freight" },
];

const directionLinks = [
  { name: "Azerbaijan - Asia", href: "/directions/azerbaijan-asia" },
  { name: "Asia - Azerbaijan", href: "/directions/asia-azerbaijan" },
  {
    name: "Kazakhstan - Azerbaijan",
    href: "/directions/kazakhstan-azerbaijan",
  },
  { name: "Georgia - Azerbaijan", href: "/directions/georgia-azerbaijan" },
];

const contactInfo = [
  {
    icon: <FaPhoneAlt className="text-sm" />,
    text: "+994 55 262 40 37",
    href: "tel:+994552624037",
  },
  {
    icon: <FaEnvelope className="text-sm" />,
    text: "togruleminov3@gmail.com",
    href: "mailto:togruleminov3@gmail.com",
  },
  {
    icon: <FaMap className="text-sm" />,
    text: "Tbilisi, Georgia",
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-secondary text-white">
      {/* ===== TOP SECTION: Logo + Social ===== */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex flex-col sm:flex-row items-center justify-between py-8 gap-6">
            {/* Logo */}
            <Logo isRedWhite={true} />

            {/* Social Icons */}
            <ul className="flex items-center gap-3">
              {availableIcons?.slice(0, 4).map((item) => (
                <li key={item.label}>
                  <Link
                    href=""
                    target="_blank"
                    className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-[#C8102E] hover:border-[#C8102E] transition-all duration-300 hover:scale-110"
                  >
                    {renderSocialIcon({
                      iconName: item.value,
                      fill: "currentColor",
                      className: "w-[18px] h-[18px]",
                    })}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ===== MIDDLE SECTION: Grid Columns ===== */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Column 1: Main Links */}
          <div>
            <h4 className="text-sm font-bold tracking-[2px] uppercase text-white mb-6">
              Main Links
            </h4>
            <ul className="space-y-3.5">
              {mainLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/60  hover:text-[#C8102E] text-[15px] font-medium transition-all duration-300 hover:pl-2"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Services */}
          <div>
            <h4 className="text-sm font-bold tracking-[2px] uppercase text-white mb-6">
              Services
            </h4>
            <ul className="space-y-3.5">
              {serviceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-[#C8102E] text-[15px] font-medium transition-all duration-300 hover:pl-2"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Directions */}
          <div>
            <h4 className="text-sm font-bold tracking-[2px] uppercase text-white mb-6">
              Directions
            </h4>
            <ul className="space-y-3.5">
              {directionLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-[#C8102E] text-[15px] font-medium transition-all duration-300 hover:pl-2"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="text-sm font-bold tracking-[2px] uppercase text-white mb-6">
              Contact
            </h4>
            <ul className="space-y-4">
              {contactInfo.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-lg bg-[#C8102E]/10 border border-[#C8102E]/20 flex items-center justify-center text-[#C8102E] flex-shrink-0 mt-0.5">
                    {item.icon}
                  </span>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-white/60 hover:text-[#C8102E] text-[15px] font-medium transition-colors duration-300 leading-relaxed"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span className="text-white/60 text-[15px] font-medium leading-relaxed">
                      {item.text}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ===== BOTTOM SECTION: Copyright ===== */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex flex-col sm:flex-row items-center justify-between py-6 gap-4">
            <p className="text-white/40 text-sm font-medium">
              © {currentYear} Kometa GE. Copyright all reserved
            </p>
            <p className="text-white/40 text-sm font-medium">
              Site by
              <span className="text-white ml-1 hover:text-[#C8102E] transition-colors duration-300 cursor-pointer">
                TogrulEminov
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

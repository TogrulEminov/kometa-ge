import { Link } from "@/i18n/navigation";
import Logo from "@/components/Logo";
import { FaPhoneAlt, FaEnvelope, FaMap } from "react-icons/fa";
import { renderSocialIcon } from "@/utils/renderSocialIcon";
import CopyRight from "./atoms/CopyRight";
import {
  CustomLocales,
  DirectionsType,
  IContactInformation,
  ServicesType,
} from "@/services/interface/type";
import {
  fetchContactInformation,
  fetchDirections,
  fetchServices,
  fetchSocials,
} from "@/actions/ui/main.controller";
import { clearPhoneRegex } from "@/lib/domburify";
import { getTranslations } from "next-intl/server";
import { Suspense, type ReactNode } from "react";

type FooterLink = {
  id: string;
  name: string;
  href: string;
};

function buildServiceLinks(services: ServicesType[]): FooterLink[] {
  return services.flatMap((service) => {
    const translation = service.translations?.[0];
    if (!translation?.slug || !translation.title) return [];

    return [
      {
        id: service.id,
        name: translation.title,
        href: `/services/${translation.slug}`,
      },
    ];
  });
}

function buildDirectionLinks(directions: DirectionsType[]): FooterLink[] {
  return directions.flatMap((direction) => {
    const translation = direction.translations?.[0];
    if (!translation?.slug || !translation.navTitle) return [];

    return [
      {
        id: direction.id,
        name: translation.navTitle,
        href: `/directions/${translation.slug}`,
      },
    ];
  });
}

function buildContactItems(contactInfo: IContactInformation | null) {
  if (!contactInfo) return [];

  const items: {
    icon: ReactNode;
    text: string;
    href?: string;
  }[] = [];

  if (contactInfo?.phone) {
    items.push({
      icon: <FaPhoneAlt className="text-sm" />,
      text: contactInfo?.phone,
      href: clearPhoneRegex(contactInfo?.phone),
    });
  }

  if (contactInfo?.email) {
    items.push({
      icon: <FaEnvelope className="text-sm" />,
      text: contactInfo?.email,
      href: `mailto:${contactInfo?.email}`,
    });
  }

  const address = contactInfo?.translations?.[0]?.adress;
  if (address) {
    items.push({
      icon: <FaMap className="text-sm" />,
      text: address,
      href: contactInfo?.adressLink ?? undefined,
    });
  }

  return items;
}

export default async function Footer({ locale }: { locale: CustomLocales }) {
  const t = await getTranslations("atoms.components.footer");
  const contactData = await fetchContactInformation(locale);
  const socials = await fetchSocials();
  const directions = await fetchDirections({ pageNumber: 1, locale });
  const services = await fetchServices({ pageNumber: 1, locale });

  const mainLinks: FooterLink[] = [
    { id: "about", name: t("main_links.about"), href: "/about" },
    { id: "services", name: t("main_links.services"), href: "/services" },
    { id: "directions", name: t("main_links.directions"), href: "/directions" },
    {
      id: "photo-gallery",
      name: t("main_links.photo_gallery"),
      href: "/photo-gallery",
    },
    {
      id: "video-gallery",
      name: t("main_links.video_gallery"),
      href: "/video-gallery",
    },
    { id: "contact", name: t("main_links.contact"), href: "/contact" },
  ];

  const serviceLinks = buildServiceLinks(
    services.data as unknown as ServicesType[],
  );
  const directionLinks = buildDirectionLinks(
    directions.data as unknown as DirectionsType[],
  );
  const contactItems = buildContactItems(
    contactData as unknown as IContactInformation | null,
  );

  return (
    <footer className="w-full bg-secondary text-white">
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex flex-col sm:flex-row items-center justify-between py-8 gap-6">
            <Logo isRedWhite={true} />

            <ul className="flex items-center gap-3">
              {socials?.map((item) => {
                if (!item.iconName) return null;
                return (
                  <li key={item.id}>
                    <a
                      href={item.socialLink || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-[#C8102E] hover:border-[#C8102E] transition-all duration-300 hover:scale-110"
                    >
                      {renderSocialIcon({
                        iconName: item.iconName,
                        fill: "currentColor",
                        className: "w-[18px] h-[18px]",
                      })}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          <div>
            <h4 className="text-sm font-bold tracking-[2px] uppercase text-white mb-6">
              {t("main_links_title")}
            </h4>
            <ul className="space-y-3.5">
              {mainLinks.map((link) => (
                <li key={link.id}>
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

          <div>
            <h4 className="text-sm font-bold tracking-[2px] uppercase text-white mb-6">
              {t("services_title")}
            </h4>
            <ul className="space-y-3.5">
              {serviceLinks.map((link) => (
                <li key={link.id}>
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

          <div>
            <h4 className="text-sm font-bold tracking-[2px] uppercase text-white mb-6">
              {t("directions_title")}
            </h4>
            <ul className="space-y-3.5">
              {directionLinks.map((link) => (
                <li key={link.id}>
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

          <div>
            <h4 className="text-sm font-bold tracking-[2px] uppercase text-white mb-6">
              {t("contact_title")}
            </h4>
            <ul className="space-y-4">
              {contactItems.map((item, i) => (
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

      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex flex-col sm:flex-row items-center justify-between py-6 gap-4">
            <Suspense fallback={null}>
              <CopyRight />
            </Suspense>
            <p className="text-white/40 text-sm font-medium">
              {t("site_by")}
              <a
                href="https://www.linkedin.com/in/togruleminov/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white ml-1 hover:text-[#C8102E] transition-colors duration-300 cursor-pointer"
              >
                TogrulEminov
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

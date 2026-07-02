"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { serviceMainHref, serviceSubHref } from "@/i18n/href";
import { clearPhoneRegex } from "@/lib/domburify";
import {
  IContactInformation,
  ServicesType,
  Social,
} from "@/services/interface/type";
import { DynamicIcon } from "@/utils/DynamicIcon";
import { renderSocialIcon } from "@/utils/renderSocialIcon";
import {
  findExpandedServiceId,
  isServiceCategoryActive,
  isSubServicePathActive,
} from "@/utils/serviceStickyBar";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import {
  FaChevronDown,
  FaChevronRight,
  FaEnvelope,
  FaWhatsapp,
} from "react-icons/fa6";

export default function StickyBarDetail({
  services,
  category,
  contactInfo,
  socials,
}: {
  services: ServicesType[];
  category: string;
  contactInfo: IContactInformation;
  socials: Social[];
}) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const t = useTranslations("atoms.components");

  useEffect(() => {
    setIsMounted(true);
    const activeServiceId = findExpandedServiceId(services, pathname, category);
    if (activeServiceId) {
      setExpandedService(activeServiceId);
    }
  }, [services, pathname, category]);

  const toggleService = (id: string) => {
    setExpandedService(expandedService === id ? null : id);
  };

  const isSubServiceActive = (parentSlug: string, subSlug?: string | null) =>
    isMounted &&
    Boolean(
      parentSlug &&
        subSlug &&
        isSubServicePathActive(pathname, parentSlug, subSlug),
    );

  const getServiceButtonClassName = (
    isActive: boolean,
    isExpanded: boolean,
  ) => {
    if (isActive) {
      return "bg-primary text-white shadow-primary/20";
    }

    if (isExpanded) {
      return "bg-white/10 text-white";
    }

    return "text-gray-400 hover:text-white hover:bg-white/5";
  };

  const getSubServiceLinkClassName = (
    parentSlug: string,
    subSlug?: string | null,
  ) =>
    isSubServiceActive(parentSlug, subSlug)
      ? "bg-primary text-white"
      : "text-gray-400 hover:text-white hover:bg-white/5";

  const contactInfoData = [
    {
      id: "phone",
      icon: FaPhoneAlt,
      value: contactInfo?.phone,
      href: `tel:${clearPhoneRegex(contactInfo?.phone)}`,
    },
    {
      id: "email",
      icon: FaEnvelope,
      value: contactInfo?.email,
      href: `mailto:${contactInfo?.email}`,
    },
    {
      id: "address",
      icon: FaMapMarkerAlt,
      value: contactInfo?.translations?.[0]?.adress,
      href: contactInfo?.adressLink ?? "",
    },
    {
      id: "whatsapp",
      icon: FaWhatsapp,
      value: contactInfo?.whatsapp,
      href: `https://wa.me/${clearPhoneRegex(contactInfo?.whatsapp)}`,
    },
  ].filter((item) => Boolean(item.value));

  return (
    <div className="lg:sticky lg:top-25 space-y-6">
      <div className="bg-secondary rounded-2xl p-6 shadow-xl">
        <strong className="text-white font-bold text-lg mb-5 flex items-center gap-2">
          <span className="w-1 h-5 bg-primary rounded-full" />
          {t("stickySidebar.services_titles")}
        </strong>
        <nav className="space-y-1">
          {services.map((service) => {
            const serviceSlug = service.translations[0]?.slug ?? "";
            const hasSubServices = Boolean(service.subServices?.length);
            const hasActiveChild =
              isMounted &&
              (service.subServices?.some((child) =>
                isSubServiceActive(serviceSlug, child.translations[0]?.slug),
              ) ??
                false);
            const isActive =
              isMounted &&
              (isServiceCategoryActive(pathname, serviceSlug) || hasActiveChild);
            const isExpanded =
              isMounted &&
              (expandedService === service.id || hasActiveChild);
            const rowClassName = `flex items-center gap-1 rounded-xl text-sm font-medium transition-all duration-300 ${getServiceButtonClassName(
              isActive,
              isExpanded,
            )}`;

            return (
              <div key={service.id}>
                {hasSubServices ? (
                  <div className={rowClassName}>
                    <Link
                      href={serviceMainHref(serviceSlug)}
                      className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3"
                    >
                      {service.iconUrl && (
                        <span className="text-lg">
                          <DynamicIcon iconName={service.iconUrl} />
                        </span>
                      )}
                      <span className="flex-1 text-left">
                        {service.translations[0]?.title}
                      </span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => toggleService(service.id)}
                      aria-expanded={isExpanded}
                      aria-label={`Toggle ${service.translations[0]?.title}`}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-inherit transition-colors hover:bg-white/10"
                    >
                      <FaChevronDown
                        className={`h-3 w-3 transition-transform duration-300 ${
                          isExpanded ? "rotate-180" : "-rotate-90"
                        }`}
                      />
                    </button>
                  </div>
                ) : (
                  <Link
                    href={serviceMainHref(serviceSlug)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${getServiceButtonClassName(
                      isActive,
                      false,
                    )}`}
                  >
                    {service.iconUrl && (
                      <span className="text-lg">
                        <DynamicIcon iconName={service.iconUrl} />
                      </span>
                    )}
                    <span className="flex-1 text-left">
                      {service.translations[0]?.title}
                    </span>
                    <FaChevronRight className="h-3 w-3 opacity-50" />
                  </Link>
                )}

                {hasSubServices && isExpanded ? (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-primary/30 pl-4">
                    {service.subServices.map((child) => {
                      const servicesTr = child.translations[0];
                      return (
                        <Link
                          key={child.id}
                          href={serviceSubHref(
                            serviceSlug,
                            servicesTr.slug ?? "",
                          )}
                          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-300 ${getSubServiceLinkClassName(
                            serviceSlug,
                            servicesTr.slug,
                          )}`}
                        >
                          <span className="text-base">
                            <DynamicIcon iconName={child.iconsUrl} />
                          </span>
                          <span>{servicesTr.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>
      </div>

      <div className="bg-linear-to-br from-primary to-[#8a0d1e] rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <strong className="text-white block font-bold text-lg mb-2 relative z-10">
          {t("stickySidebar.contact.title")}
        </strong>
        <p className="text-white/70 text-sm mb-5 relative z-10">
          {t("stickySidebar.contact.description")}
        </p>
        <button
          type="button"
          className="w-full bg-foreground text-primary font-bold py-3 px-4 rounded-xl hover:bg-foreground/90 transition-colors duration-300 flex items-center justify-center gap-2 relative z-10"
        >
          <FaPhoneAlt className="w-4 h-4" />
          {t("stickySidebar.contact.button")}
        </button>
      </div>

      <div className="surface-card p-6">
        <h3 className="text-foreground font-bold text-lg mb-4">
          {t("stickySidebar.contact.name")}
        </h3>
        <div className="space-y-3">
          {contactInfoData.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="flex items-center gap-3 text-muted text-sm hover:text-foreground transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-surface-elevated flex items-center justify-center text-primary">
                <item.icon className="w-4 h-4" />
              </div>
              <span>{item.value}</span>
            </a>
          ))}
        </div>
      </div>

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
    </div>
  );
}

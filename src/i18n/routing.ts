import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ka"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeDetection: false,
  pathnames: {
    "/": "/",
    "/about": {
      en: "/about",
      ka: "/chvens-shesaxeb",
    },
    "/services": {
      en: "/services",
      ka: "/servisebi",
    },
    "/services/[category]": {
      en: "/services/[category]",
      ka: "/servisebi/[category]",
    },
    "/services/[category]/[slug]": {
      en: "/services/[category]/[slug]",
      ka: "/servisebi/[category]/[slug]",
    },
    "/directions": {
      en: "/directions",
      ka: "/martvis-mzadebebi",
    },
    "/directions/[slug]": {
      en: "/directions/[slug]",
      ka: "/martvis-mzadebebi/[slug]",
    },
    "/contact": {
      en: "/contact",
      ka: "/kontakti",
    },
    "/certificates": {
      en: "/certificates",
      ka: "/sertifikatebi",
    },
    "/photo-gallery": {
      en: "/photo-gallery",
      ka: "/foto-galeria",
    },
    "/video-gallery": {
      en: "/video-gallery",
      ka: "/video-galeria",
    },
  },
});

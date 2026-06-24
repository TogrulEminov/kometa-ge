import { AppHref, directionDetailHref, serviceMainHref } from "@/i18n/href";
import { DirectionsType, ServicesType } from "@/services/interface/type";

export type NavChild = {
  id: string;
  href: AppHref;
  key?: string;
  name?: string;
};

export type NavItem = {
  id: string;
  key: string;
  href?: AppHref;
  name?: string;
  children?: NavChild[];
};

export function getNavbar(
  services: ServicesType[],
  directions: DirectionsType[],
): NavItem[] {
  const serviceChildren: NavChild[] = services?.flatMap((service) => {
    const translation = service.translations?.[0];
    if (!translation?.slug || !translation.title) return [];

    return [
      {
        id: service.id,
        name: translation.title,
        href: serviceMainHref(translation.slug),
      },
    ];
  });

  const directionChildren: NavChild[] = directions?.flatMap((direction) => {
    const translation = direction.translations?.[0];
    if (!translation?.slug || !translation.navTitle) return [];

    return [
      {
        id: direction.id,
        name: translation.navTitle,
        href: directionDetailHref(translation.slug),
      },
    ];
  });

  return [
    {
      id: "nav-1",
      key: "about",
      href: "/about",
      children: [
        {
          id: "certificates",
          key: "certificates",
          href: "/certificates",
        },
      ],
    },
    {
      id: "nav-2",
      key: "services",
      href: "/services",
      children: serviceChildren,
    },
    {
      id: "nav-3",
      key: "directions",
      href: "/directions",
      children: directionChildren,
    },
    {
      id: "nav-4",
      key: "media",
      children: [
        {
          id: "photo-gallery",
          key: "photoGallery",
          href: "/photo-gallery",
        },
        {
          id: "video-gallery",
          key: "videoGallery",
          href: "/video-gallery",
        },
      ],
    },
    {
      id: "nav-5",
      key: "contact",
      href: "/contact",
    },
  ];
}

export function hrefToPath(href: AppHref): string {
  if (typeof href === "string") return href;
  return href.pathname ?? "/";
}

export function isActivePath(pathname: string, href?: AppHref): boolean {
  if (!href) return false;

  const path = hrefToPath(href);
  return pathname === path || pathname.startsWith(`${path}/`);
}

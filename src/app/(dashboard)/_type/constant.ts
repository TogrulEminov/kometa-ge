import type { IconType } from "react-icons";
import {
  LuFileCheck,
  LuMail,
  LuBriefcase,
  LuUsers,
  LuVideo,
  LuImage,
  LuMonitor,
} from "react-icons/lu";
import { Role } from "@/services/interface/type";
import { GiKnightBanner } from "react-icons/gi";

export type DashboardRole = typeof Role.ADMIN | typeof Role.MODERATOR;

export interface MenuItem {
  href: string;
  label: string;
  icon: IconType;
  roles?: DashboardRole[];
}

export interface MenuSection {
  title: string;
  roles?: DashboardRole[];
  items: MenuItem[];
}

export const DASHBOARD_ROLES: DashboardRole[] = [Role.ADMIN, Role.MODERATOR];

export const pageRoutes = {
  categories: {
    root: "/manage/categories",
    single: "categories",
    create: "/manage/categories/create?locale=en",
    link: "manage/categories",
    updateImage({ id }: { id: string }) {
      return `/manage/categories/update/${id}/image`;
    },
    updateContent({ id }: { id: string }) {
      return `/manage/categories/update/${id}/content`;
    },
  },
  sectionContent: {
    root: "/manage/section-content",
    single: "section-content",
    create: "/manage/section-content/create?locale=en",
    link: "manage/section-content",
    updateContent({ id }: { id: string }) {
      return `/manage/section-content/update/${id}/content`;
    },
  },
  contact: {
    root: "/manage/contact",
  },
  services: {
    root: "/manage/services-main",
    create: "/manage/services-main/create?locale=en",
  },
  youtubeMedia: {
    root: "/manage/youtube-media",
    link: "manage/youtube-media",
    single: "youtube-media",
    create: "/manage/youtube-media/create?locale=en",
    updateImage({ id }: { id: string }) {
      return `/manage/youtube-media/update/${id}/image`;
    },
    updateContent({ id }: { id: string }) {
      return `/manage/youtube-media/update/${id}/content`;
    },
  },
  aboutHome: {
    root: "/manage/about-home",
  },
  heroInfos: {
    root: "/manage/hero-info",
  },
  enum: {
    root: "/manage/enum",
    single: "enum",
    create: "/manage/enum/create?locale=en",
    link: "manage/enum",
    updateContent({ id }: { id: string }) {
      return `/manage/enum/update/${id}/content`;
    },
  },
  socials: {
    root: "/manage/socials",
  },

  users: "/manage/users",
};

export const menuSections: MenuSection[] = [
  {
    title: "Əsas səhifələr",
    items: [
      {
        href: pageRoutes.categories.root,
        label: "Meta information",
        icon: LuFileCheck,
      },
      { href: pageRoutes.contact.root, label: "Contact", icon: LuMail },
      {
        href: pageRoutes.youtubeMedia.root,
        label: "Youtube videos",
        icon: LuVideo,
      },
    ],
  },
  {
    title: "Main pages",
    items: [
      {
        href: pageRoutes.heroInfos.root,
        label: "Hero info",
        icon: GiKnightBanner,
      },
    ],
  },
  {
    title: "Components",
    items: [
      {
        href: pageRoutes.enum.root,
        label: "System types",
        icon: LuBriefcase,
      },
      {
        href: pageRoutes.socials.root,
        label: "Social networks",
        icon: LuUsers,
      },
      {
        href: pageRoutes.sectionContent.root,
        label: "Section titles",
        icon: LuFileCheck,
      },
    ],
  },
  // {
  //   title: "System",
  //   roles: [Role.ADMIN],
  //   items: [
  //     {
  //       href: pageRoutes.users,
  //       label: "Users",
  //       icon: LuUsers,
  //       roles: [Role.ADMIN],
  //     },
  //   ],
  // },
];

function canAccess(
  allowedRoles: DashboardRole[] | undefined,
  userRole?: string,
): boolean {
  if (!userRole || !DASHBOARD_ROLES.includes(userRole as DashboardRole)) {
    return false;
  }

  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  return allowedRoles.includes(userRole as DashboardRole);
}

export function getMenuSectionsForRole(userRole?: string): MenuSection[] {
  return menuSections
    .filter((section) => canAccess(section.roles, userRole))
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => canAccess(item.roles, userRole)),
    }))
    .filter((section) => section.items.length > 0);
}

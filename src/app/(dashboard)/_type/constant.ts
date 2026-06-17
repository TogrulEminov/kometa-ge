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
    create: "/manage/categories/create?locale=en",
    link: "manage/categories",
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
    create: "/manage/youtube-media/create?locale=en",
  },
  aboutHome: {
    root: "/manage/about-home",
  },
  enum: {
    root: "/manage/enum",
    create: "/manage/enum/create?locale=en",
  },
  socials: {
    root: "/manage/socials",
    create: "/manage/socials/create?locale=en",
  },
  sectionContent: {
    root: "/manage/section-content",
    create: "/manage/section-content/create?locale=en",
  },
  users: "/manage/users",
};

export const menuSections: MenuSection[] = [
  {
    title: "Əsas səhifələr",
    items: [
      {
        href: pageRoutes.categories.root,
        label: "Meta məlumatlar",
        icon: LuFileCheck,
      },
      { href: pageRoutes.contact.root, label: "Əlaqə", icon: LuMail },
      { href: pageRoutes.services.root, label: "Xidmətlər", icon: LuMonitor },
      {
        href: pageRoutes.youtubeMedia.root,
        label: "Youtube videolarımız",
        icon: LuVideo,
      },
    ],
  },
  {
    title: "Ana səhifə",
    items: [
      {
        href: pageRoutes.aboutHome.root,
        label: "Haqqımızda",
        icon: LuImage,
      },
    ],
  },
  {
    title: "Komponentlər",
    items: [
      {
        href: pageRoutes.enum.root,
        label: "Sistem tipləri",
        icon: LuBriefcase,
      },
      {
        href: pageRoutes.socials.root,
        label: "Sosial şəbəkələr",
        icon: LuUsers,
      },
      {
        href: pageRoutes.sectionContent.root,
        label: "Bölüm başlıqları",
        icon: LuFileCheck,
      },
    ],
  },
  {
    title: "Sistem",
    roles: [Role.ADMIN],
    items: [
      {
        href: pageRoutes.users,
        label: "İstifadəçilər",
        icon: LuUsers,
        roles: [Role.ADMIN],
      },
    ],
  },
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

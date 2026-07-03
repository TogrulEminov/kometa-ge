import type { IconType } from "react-icons";
import {
  LuFileCheck,
  LuMail,
  LuBriefcase,
  LuUsers,
  LuVideo,
  LuFolderOpen,
  LuRoute,
  LuBuilding,
  LuTrash2,
  LuInbox,
} from "react-icons/lu";
import { Role } from "@/services/interface/type";
import { GiKnightBanner } from "react-icons/gi";
import { FaNetworkWired, FaQuestion, FaServicestack } from "react-icons/fa6";
import { BsFileSlides, BsInfo } from "react-icons/bs";
import { IoIosStarHalf } from "react-icons/io";
import { IoInformation } from "react-icons/io5";
import { AiOutlineBranches } from "react-icons/ai";

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
  dashboard: {
    root: "/manage/dashboard",
  },
  categories: {
    root: "/manage/categories",
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
    create: "/manage/section-content/create?locale=en",
    link: "manage/section-content",
    updateContent({ id }: { id: string }) {
      return `/manage/section-content/update/${id}/content`;
    },
  },
  contact: {
    root: "/manage/contact",
  },
  formSubmissions: {
    root: "/manage/form-submissions",
  },
  servicesMain: {
    root: "/manage/services-main",
    create: "/manage/services-main/create?locale=en",
    link: "manage/services-main",
    updateImage({ id }: { id: string }) {
      return `/manage/services-main/update/${id}/image`;
    },
    updateContent({ id }: { id: string }) {
      return `/manage/services-main/update/${id}/content`;
    },
    updateGallery({ id }: { id: string }) {
      return `/manage/services-main/update/${id}/gallery`;
    },
  },
  photoGallery: {
    root: "/manage/photo-gallery",
    create: "/manage/photo-gallery/create?locale=en",
    link: "manage/photo-gallery",
    updateImage({ id }: { id: string }) {
      return `/manage/photo-gallery/update/${id}/image`;
    },
    updateGallery({ id }: { id: string }) {
      return `/manage/photo-gallery/update/${id}/gallery`;
    },
    updateContent({ id }: { id: string }) {
      return `/manage/photo-gallery/update/${id}/content`;
    },
  },
  subServices: {
    root: "/manage/sub-services",
    create: "/manage/sub-services/create?locale=en",
    link: "manage/sub-services",
    updateImage({ id }: { id: string }) {
      return `/manage/sub-services/update/${id}/image`;
    },
    updateContent({ id }: { id: string }) {
      return `/manage/sub-services/update/${id}/content`;
    },
    updateGallery({ id }: { id: string }) {
      return `/manage/sub-services/update/${id}/gallery`;
    },
  },
  youtubeMedia: {
    root: "/manage/youtube-media",
    link: "manage/youtube-media",
    create: "/manage/youtube-media/create?locale=en",
    updateImage({ id }: { id: string }) {
      return `/manage/youtube-media/update/${id}/image`;
    },
    updateContent({ id }: { id: string }) {
      return `/manage/youtube-media/update/${id}/content`;
    },
  },
  directions: {
    root: "/manage/directions",
    create: "/manage/directions/create?locale=en",
    link: "manage/directions",
    updateImage({ id }: { id: string }) {
      return `/manage/directions/update/${id}/image`;
    },
    updateContent({ id }: { id: string }) {
      return `/manage/directions/update/${id}/content`;
    },
  },

  aboutPage: {
    root: "/manage/about-page",
  },
  heroInfos: {
    root: "/manage/hero-info",
  },
  aboutSection: {
    root: "/manage/about-section",
  },
  workProcess: {
    root: "/manage/work-process",
  },
  features: {
    root: "/manage/features",
  },
  enum: {
    root: "/manage/enum",
    create: "/manage/enum/create?locale=en",
    link: "manage/enum",
    updateContent({ id }: { id: string }) {
      return `/manage/enum/update/${id}/content`;
    },
  },
  certificates: {
    root: "/manage/certificates",
    create: "/manage/certificates/create?locale=en",
    link: "manage/certificates",
    updateImage({ id }: { id: string }) {
      return `/manage/certificates/update/${id}/image`;
    },
    updateGallery({ id }: { id: string }) {
      return `/manage/certificates/update/${id}/gallery`;
    },
    updateContent({ id }: { id: string }) {
      return `/manage/certificates/update/${id}/content`;
    },
  },
  branches: {
    root: "/manage/branches",
    create: "/manage/branches/create?locale=en",
    link: "manage/branches",
    updateContent({ id }: { id: string }) {
      return `/manage/branches/update/${id}/content`;
    },
  },
  offices: {
    root: "/manage/offices",
    create: "/manage/offices/create?locale=en",
    link: "manage/offices",
    updateContent({ id }: { id: string }) {
      return `/manage/offices/update/${id}/content`;
    },
  },
  faq: {
    root: "/manage/faq",
    create: "/manage/faq/create?locale=en",
    link: "manage/faq",
    updateContent({ id }: { id: string }) {
      return `/manage/faq/update/${id}/content`;
    },
  },
  socials: {
    root: "/manage/socials",
  },

  cleanup: {
    root: "/manage/cleanup",
  },

  users: "/manage/users",
};

export const pageModels = {
  services: "service",
  faq: "faq",
  enum: "enum",
  subServices: "subServices",
  youtube: "youtube",
  sectionContent: "sectionContent",
  categories: "categories",
  directions: "directions",
  branches: "branch",
  offices: "office",
  photoGallery: "photoGallery",
  certificates: "certificates",
};
export const menuSections: MenuSection[] = [
  {
    title: "Main Pages",
    items: [
      {
        href: pageRoutes.categories.root,
        label: "Meta information",
        icon: LuFileCheck,
      },
      { href: pageRoutes.contact.root, label: "Contact", icon: LuMail },
      {
        href: pageRoutes.formSubmissions.root,
        label: "Form Messages",
        icon: LuInbox,
      },
      { href: pageRoutes.aboutPage.root, label: "About", icon: IoInformation },
      {
        href: pageRoutes.youtubeMedia.root,
        label: "Youtube videos",
        icon: LuVideo,
      },
      {
        href: pageRoutes.directions.root,
        label: "Directions",
        icon: LuRoute,
      },
      {
        href: pageRoutes.photoGallery.root,
        label: "Photo Gallery",
        icon: BsFileSlides,
      },
      {
        href: pageRoutes.certificates.root,
        label: "Certificates",
        icon: LuFileCheck,
      },
    ],
  },
  {
    title: "Home page",
    items: [
      {
        href: pageRoutes.heroInfos.root,
        label: "Hero info",
        icon: GiKnightBanner,
      },
      {
        href: pageRoutes.aboutSection.root,
        label: "About Section",
        icon: BsInfo,
      },
      {
        href: pageRoutes.workProcess.root,
        label: "Work Process",
        icon: FaNetworkWired,
      },
      {
        href: pageRoutes.features.root,
        label: "Features",
        icon: IoIosStarHalf,
      },
      {
        href: pageRoutes.faq.root,
        label: "FAQ",
        icon: FaQuestion,
      },
    ],
  },
  {
    title: "Services",
    items: [
      {
        href: pageRoutes.servicesMain.root,
        label: "Services main",
        icon: FaServicestack,
      },
      {
        href: pageRoutes.subServices.root,
        label: "Sub Services",
        icon: LuFolderOpen,
      },
    ],
  },
  {
    title: "Global areas",
    items: [
      {
        href: pageRoutes.branches.root,
        label: "Branches",
        icon: AiOutlineBranches,
      },
      {
        href: pageRoutes.offices.root,
        label: "Offices",
        icon: LuBuilding,
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
  {
    title: "System",
    roles: [Role.ADMIN],
    items: [
      {
        href: pageRoutes.users,
        label: "Users",
        icon: LuUsers,
        roles: [Role.ADMIN],
      },
      {
        href: pageRoutes.cleanup.root,
        label: "System cleanup",
        icon: LuTrash2,
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

export function getCreateLinkForRoute(root: string): string | undefined {
  for (const route of Object.values(pageRoutes)) {
    if (
      typeof route === "object" &&
      "root" in route &&
      route.root === root &&
      "create" in route &&
      typeof route.create === "string"
    ) {
      return route.create;
    }
  }

  return undefined;
}

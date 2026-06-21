import Logo from "@/components/Logo";
import { Link } from "@/i18n/navigation";
import { IoMdMenu } from "react-icons/io";
import { IoChevronDown } from "react-icons/io5";
import Language from "./Language";
import { cn } from "@/utils/cn";
import { Dispatch, SetStateAction, useMemo } from "react";
import { DirectionsType, ServicesType } from "@/services/interface/type";
import { useTranslations } from "next-intl";

type NavChild = {
  id: string;
  href: string;
  key?: string;
  name?: string;
};

type NavItem = {
  id: string;
  key: string;
  href?: string;
  name?: string;
  children?: NavChild[];
};

function getNavbar(
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
        href: `/services/${translation.slug}`,
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
        href: `/directions/${translation.slug}`,
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

function DropdownItem({
  item,
  getLabel,
}: {
  item: NavItem;
  getLabel: (item: { key?: string; name?: string }) => string;
}) {
  const label = getLabel(item);

  if (!item.children?.length) {
    return (
      <li>
        <Link
          href={item.href ?? "/"}
          className="text-white font-medium text-sm hover:text-white/60 transition-colors duration-200"
        >
          {label}
        </Link>
      </li>
    );
  }

  return (
    <li className="relative group">
      {item.href ? (
        <Link
          href={item.href}
          className="flex items-center gap-1 leading-10 text-white font-medium text-sm transition-colors duration-200"
        >
          {label}
          <IoChevronDown
            className="transition-transform duration-200 group-hover:rotate-180"
            size={14}
          />
        </Link>
      ) : (
        <span className="flex items-center gap-1 leading-10 text-white font-medium text-sm transition-colors duration-200 cursor-default">
          {label}
          <IoChevronDown
            className="transition-transform duration-200 group-hover:rotate-180"
            size={14}
          />
        </span>
      )}

      <ul className="absolute group-hover:block hidden top-full left-0 mt-0 w-56 bg-[#1C1E29] border border-white/10 rounded-lg shadow-xl z-50 py-1 overflow-hidden">
        {item.children.map((child) => (
          <li key={child.id}>
            <Link
              href={child.href}
              className="block px-4 py-2.5  text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-150"
            >
              {getLabel(child)}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}

export default function HeaderBottom({
  isSticky,
  setIsOpen,
  directions,
  services,
}: {
  isSticky: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  directions: DirectionsType[];
  services: ServicesType[];
}) {
  const t = useTranslations("atoms.components.header");
  const navbar = useMemo(
    () => getNavbar(services, directions),
    [services, directions],
  );

  const getLabel = (item: { key?: string; name?: string }) => {
    if (item.name) return item.name;
    if (item.key) return t(`pages.${item.key}` as "pages.about");
    return "";
  };

  return (
    <div
      className={cn(
        "border-b border-white/10 py-3",
        isSticky ? "backdrop-blur-2xl! bg-black/40" : "bg-white/5!",
      )}
    >
      <div className="container flex items-center justify-between">
        <Logo isRedWhite={true} />
        {/* Desktop nav */}
        <nav className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {navbar.map((item) => (
              <DropdownItem key={item.id} item={item} getLabel={getLabel} />
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Language />

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="hidden sm:inline-flex items-center px-4 py-2 bg-[#B11226] hover:bg-[#8f0e1e] text-white text-sm font-medium rounded-lg transition-colors duration-200"
          >
            {t("button")}
          </button>

          <button className="lg:hidden text-white p-1" aria-label="Toggle menu">
            {<IoMdMenu size={36} />}
          </button>
        </div>
      </div>
    </div>
  );
}

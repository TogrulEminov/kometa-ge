"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { IoChevronDown, IoClose } from "react-icons/io5";
import { Link, usePathname } from "@/i18n/navigation";
import Logo from "@/components/Logo";
import Language from "@/components/layout/header/Language";
import {
  getNavbar,
  isActivePath,
  type NavChild,
  type NavItem,
} from "@/components/layout/header/navConfig";
import { useToggleState, useToggleStore } from "@/hooks/useToggleStore";
import {
  shipmentModalKey,
  sideMenuKey,
} from "@/services/interface/constant-keys";
import { cn } from "@/utils/cn";
import { DirectionsType, ServicesType } from "@/services/interface/type";

type SidebarProps = {
  directions: DirectionsType[];
  services: ServicesType[];
};

function NavLink({
  href,
  label,
  isActive,
  onNavigate,
  nested = false,
}: {
  href: NavChild["href"];
  label: string;
  isActive: boolean;
  onNavigate: () => void;
  nested?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "block rounded-lg text-sm font-medium transition-colors duration-200",
        nested ? "px-4 py-2.5" : "px-3 py-3",
        isActive
          ? "bg-primary text-white"
          : "text-white/75 hover:bg-white/10 hover:text-white",
      )}
    >
      {label}
    </Link>
  );
}

function AccordionItem({
  item,
  getLabel,
  pathname,
  onNavigate,
}: {
  item: NavItem;
  getLabel: (item: { key?: string; name?: string }) => string;
  pathname: string;
  onNavigate: () => void;
}) {
  const hasChildren = Boolean(item.children?.length);
  const isParentActive =
    isActivePath(pathname, item.href) ||
    item.children?.some((child) => isActivePath(pathname, child.href));
  const [isExpanded, setIsExpanded] = useState(isParentActive);

  useEffect(() => {
    if (isParentActive) {
      setIsExpanded(true);
    }
  }, [isParentActive]);

  if (!hasChildren) {
    return (
      <li>
        <NavLink
          href={item.href ?? "/"}
          label={getLabel(item)}
          isActive={isActivePath(pathname, item.href)}
          onNavigate={onNavigate}
        />
      </li>
    );
  }

  return (
    <li className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
      <div className="flex items-center">
        {item.href ? (
          <Link
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex-1 px-3 py-3 text-sm font-semibold transition-colors duration-200",
              isActivePath(pathname, item.href)
                ? "text-white"
                : "text-white/90 hover:text-white",
            )}
          >
            {getLabel(item)}
          </Link>
        ) : (
          <span className="flex-1 px-3 py-3 text-sm font-semibold text-white/90">
            {getLabel(item)}
          </span>
        )}
        <button
          type="button"
          aria-expanded={isExpanded}
          aria-label={`Toggle ${getLabel(item)}`}
          onClick={() => setIsExpanded((prev) => !prev)}
          className="mr-2 flex size-9 cursor-pointer items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <IoChevronDown
            size={18}
            className={cn(
              "transition-transform duration-200",
              isExpanded && "rotate-180",
            )}
          />
        </button>
      </div>

      <ul
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          isExpanded
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="space-y-0.5 px-2 pb-2">
            {item.children?.map((child) => (
              <NavLink
                key={child.id}
                href={child.href}
                label={getLabel(child)}
                isActive={isActivePath(pathname, child.href)}
                onNavigate={onNavigate}
                nested
              />
            ))}
          </div>
        </div>
      </ul>
    </li>
  );
}

export default function Sidebar({ directions, services }: SidebarProps) {
  const t = useTranslations("atoms.components.header");
  const pathname = usePathname();
  const isOpen = useToggleState(sideMenuKey);
  const { close, open } = useToggleStore();

  const navbar = useMemo(
    () => getNavbar(services, directions),
    [services, directions],
  );

  const getLabel = (item: { key?: string; name?: string }) => {
    if (item.name) return item.name;
    if (item.key) return t(`pages.${item.key}` as "pages.about");
    return "";
  };

  const handleClose = () => close(sideMenuKey);

  const handleQuoteClick = () => {
    handleClose();
    open(shipmentModalKey);
  };

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close(sideMenuKey);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, close]);

  return (
    <>
      <div
        aria-hidden={!isOpen}
        onClick={handleClose}
        className={cn(
          "fixed inset-0 z-1200 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        aria-hidden={!isOpen}
        className={cn(
          "fixed top-0 right-0 z-1300 flex h-dvh w-[min(100vw,20rem)] flex-col bg-[#1C1E29] shadow-2xl transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
          <Logo isRedWhite />
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close menu"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <IoClose size={28} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-2">
            {navbar.map((item) => (
              <AccordionItem
                key={item.id}
                item={item}
                getLabel={getLabel}
                pathname={pathname}
                onNavigate={handleClose}
              />
            ))}
          </ul>
        </nav>

        <div className="space-y-3 border-t border-white/10 p-4">
          <button
            type="button"
            onClick={handleQuoteClick}
            className="w-full rounded-xl cursor-pointer bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#8f0e1e]"
          >
            {t("button")}
          </button>
        </div>
      </aside>
    </>
  );
}

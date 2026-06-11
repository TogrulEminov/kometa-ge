import Logo from "@/components/Logo";
import { Link } from "@/i18n/navigation";
import { IoMdMenu } from "react-icons/io";
import { IoChevronDown } from "react-icons/io5";
import Language from "./Language";
import { cn } from "@/utils/cn";
import { Dispatch, SetStateAction } from "react";

const navbar = [
  {
    id: "nav-1",
    name: "About",
    key: "about",
    href: "/about",
    children: [
      {
        id: "certificates",
        key: "certificates",
        name: "Certificates",
        href: "/about/certificates",
      },
    ],
  },
  {
    id: "nav-2",
    name: "Services",
    key: "services",
    href: "/services",
    children: [
      {
        id: "services-child-1",
        name: "International Road Freight",
        href: "/services/road",
      },
      {
        id: "services-child-2",
        name: "International Sea Freight",
        href: "/services/sea",
      },
      {
        id: "services-child-3",
        name: "International Air Freight",
        href: "/services/air",
      },
      {
        id: "services-child-4",
        name: "International Rail Freight",
        href: "/services/rail",
      },
    ],
  },
  {
    id: "nav-3",
    name: "Directions",
    key: "directions",
    href: "/directions",
    children: [
      {
        id: "direction-1",
        name: "China → Azerbaijan",
        href: "/directions/china",
      },
      {
        id: "direction-2",
        name: "Russia → Azerbaijan",
        href: "/directions/russia",
      },
      {
        id: "direction-3",
        name: "Kazakhstan → Azerbaijan",
        href: "/directions/kazakhstan",
      },
    ],
  },
  {
    id: "nav-4",
    name: "Media",
    key: "media",
    href: "/media",
    children: [
      {
        id: "photo-gallery",
        key: "photoGallery",
        name: "Photo Gallery",
        href: "/media/photos",
      },
      {
        id: "video-gallery",
        key: "videoGallery",
        name: "Video Gallery",
        href: "/media/videos",
      },
    ],
  },
  {
    id: "nav-5",
    name: "Contact",
    key: "contact",
    href: "/contact",
  },
];

type NavItem = (typeof navbar)[number];

function DropdownItem({ item }: { item: NavItem }) {
  if (!item.children) {
    return (
      <li>
        <Link
          href={item.href ?? "/"}
          className="text-white font-medium text-sm hover:text-white/60 transition-colors duration-200"
        >
          {item.name}
        </Link>
      </li>
    );
  }

  return (
    <li className="relative group">
      <Link
        href={item.href}
        className="flex items-center gap-1 text-white font-medium text-sm   transition-colors duration-200"
      >
        {item.name}
        <IoChevronDown
          className={`transition-transform duration-200  group-hover:rotate-180`}
          size={14}
        />
      </Link>

      <ul className="absolute group-hover:block hidden top-full left-0 mt-2 w-56 bg-[#1C1E29] border border-white/10 rounded-lg shadow-xl z-50 py-1 overflow-hidden">
        {item.children.map((child) => (
          <li key={child.id}>
            <Link
              href={"href" in child ? (child.href ?? "/") : "/"}
              className="block px-4 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-150"
            >
              {child.name}
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
}: {
  isSticky: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
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
              <DropdownItem key={item.id} item={item} />
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
            Request a quote
          </button>

          <button className="lg:hidden text-white p-1" aria-label="Toggle menu">
            {<IoMdMenu size={36} />}
          </button>
        </div>
      </div>
    </div>
  );
}

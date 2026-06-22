"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { cn } from "@/utils/cn";
import HeaderTop from "./HeaderTop";
import HeaderBottom from "./HeaderBottom";
import {
  DirectionsType,
  IContactInformation,
  ServicesType,
  Social,
} from "@/services/interface/type";

const ShipmentModal = dynamic(
  () => import("@/app/[locale]/(home)/_components/atoms/FormModal"),
  { ssr: false },
);

export default function Header({
  contactInfo,
  socials,
  directions,
  services,
}: {
  contactInfo: IContactInformation;
  socials: Social[];
  directions: DirectionsType[];
  services: ServicesType[];
}) {
  const { scrollY } = useScroll();
  const [isSticky, setIsSticky] = useState(false);
  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (current > previous && current > 150) {
      setIsSticky(true);
    } else if (current === 0) {
      setIsSticky(false);
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header
        className={cn("top-0 w-full z-1100", isSticky ? "fixed" : "absolute")}
      >
        <HeaderTop
          isSticky={isSticky}
          contactInfo={contactInfo}
          socials={socials}
        />
        <HeaderBottom
          isSticky={isSticky}
          setIsOpen={setIsOpen}
          directions={directions}
          services={services}
        />
      </header>
      <ShipmentModal open={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

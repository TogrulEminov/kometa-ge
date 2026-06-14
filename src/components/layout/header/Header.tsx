"use client";

import { useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { cn } from "@/utils/cn";
import HeaderTop from "./HeaderTop";
import HeaderBottom from "./HeaderBottom";
import ShipmentModal from "@/app/[locale]/(home)/_components/atoms/FormModal";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
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
        className={cn("top-0 w-full z-99", isSticky ? "fixed" : "absolute")}
      >
        <HeaderTop isSticky={isSticky} />
        <HeaderBottom isSticky={isSticky} setIsOpen={setIsOpen} />
      </header>
      <ShipmentModal open={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

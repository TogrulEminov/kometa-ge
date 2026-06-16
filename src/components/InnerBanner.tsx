"use client";
import { useRef, useState } from "react";
import {
  useInView,
  Variants,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import CustomImage from "@/globalElement/CustomImage";
import { MotionDiv, MotionNav } from "@/lib/motion";
import { Link } from "@/i18n/navigation";
import innerBanner from "@public/assets/inner-banner.png";
import { FaAngleLeft } from "react-icons/fa";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface InnerBannerProps {
  title: string;
  subtitle?: string;
  breadcrumbs: BreadcrumbItem[];
  variant?: "red" | "dark" | "gradient" | "image";
}

const EASE_CUBIC: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: EASE_CUBIC,
    },
  },
};

export default function InnerBanner({
  title,
  subtitle,
  breadcrumbs,
  variant = "red",
}: InnerBannerProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const [showStickyBack, setShowStickyBack] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const bannerHeight = sectionRef.current?.offsetHeight ?? 280;
    setShowStickyBack(latest > bannerHeight * 0.6);
  });

  const backLink =
    breadcrumbs.length > 1
      ? breadcrumbs[breadcrumbs.length - 2]?.href || "/"
      : "/";

  const bgStyles = {
    red: "bg-primary",
    dark: "bg-[#0F172A]",
    gradient: "bg-gradient-to-br from-primary via-secondary to-[#0F172A]",
    image: "relative",
  };

  const overlayStyles = {
    red: "bg-gradient-to-b from-black/10 via-transparent to-black/20",
    dark: "bg-gradient-to-b from-black/20 via-transparent to-black/30",
    gradient: "bg-gradient-to-b from-black/10 via-transparent to-black/20",
    image: "",
  };

  return (
    <>
      <div
        ref={sectionRef}
        className={`relative ${
          variant === "image" ? "" : bgStyles[variant]
        } pt-34 pb-16 sm:pb-20 overflow-hidden`}
      >
        {/* Image Background */}
        {variant === "image" && (
          <>
            <CustomImage
              src={innerBanner}
              title={title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-[#0F172A]/85" />
          </>
        )}

        {variant !== "image" && (
          <div className={`absolute inset-0 ${overlayStyles[variant]}`} />
        )}

        {/* Grid pattern */}
        <div
          className={`absolute inset-0 opacity-[0.04] ${
            variant === "image" ? "hidden" : ""
          }`}
        >
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern
                id="grid-inner"
                width="8"
                height="8"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 8 0 L 0 0 0 8"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.4"
                />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid-inner)" />
          </svg>
        </div>

        {/* Glow blobs */}
        <MotionDiv
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute top-0 right-0 w-72 h-72 sm:w-96 sm:h-96 md:w-md md:h-112 bg-white/4 rounded-full blur-3xl"
        />
        <MotionDiv
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          className="absolute bottom-0 left-0 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-white/3 rounded-full blur-3xl"
        />

        {/* Vertical lines */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-linear-to-b from-transparent via-white/8 to-transparent hidden md:block" />
        <div className="absolute top-0 right-1/3 w-px h-full bg-linear-to-b from-transparent via-white/5 to-transparent hidden md:block" />

        {/* Content */}
        <div className="relative z-10 container">
          <MotionDiv
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="space-y-5 lg:space-y-4"
          >
            {/* Breadcrumb — mobiledə gizli, desktop-da görünür */}
            <MotionNav variants={itemVariants} className="hidden sm:block">
              <ol className="flex items-center flex-wrap gap-1.5 sm:gap-2.5 text-xs sm:text-sm">
                <li className="flex items-center gap-1.5 sm:gap-2.5">
                  <Link
                    href={"/"}
                    className="text-white/50 hover:text-white/90 transition-colors duration-300 hover:underline underline-offset-4 decoration-white/30"
                  >
                    Home
                  </Link>
                  <svg
                    className="w-3.5 h-3.5 text-white/30 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </li>
                {breadcrumbs.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-1.5 sm:gap-2.5"
                  >
                    {index > 0 && (
                      <svg
                        className="w-3.5 h-3.5 text-white/30 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    )}
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="text-white/50 hover:text-white/90 transition-colors duration-300 hover:underline underline-offset-4 decoration-white/30"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span className="text-white font-semibold tracking-wide">
                        {item.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </MotionNav>

            {/* Title + subtitle */}
            <MotionDiv variants={itemVariants}>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] tracking-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-white/60 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed font-light mt-3">
                  {subtitle}
                </p>
              )}
            </MotionDiv>

            {/* Decorative lines */}
            <MotionDiv
              variants={itemVariants}
              className="mt-8 sm:mt-10 md:mt-12 flex items-center gap-2 sm:gap-3"
            >
              <div className="h-0.5 w-16 sm:w-20 md:w-24 bg-white/40 rounded-full" />
              <div className="h-0.5 w-6 sm:w-8 md:w-10 bg-white/20 rounded-full" />
              <div className="h-0.5 w-3 sm:w-4 md:w-5 bg-white/10 rounded-full" />
            </MotionDiv>
          </MotionDiv>
        </div>
      </div>
    </>
  );
}

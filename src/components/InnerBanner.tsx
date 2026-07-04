"use client";

import { useRef } from "react";
import { useInView, Variants } from "framer-motion";
import CustomImage from "@/globalElement/CustomImage";
import { MotionDiv, MotionNav } from "@/lib/motion";
import { Link } from "@/i18n/navigation";
import { AppHref } from "@/i18n/href";
import innerBanner from "@public/assets/inner-banner.png";

interface BreadcrumbItem {
  label: string;
  href?: AppHref;
}

interface InnerBannerProps {
  title: string;
  subtitle?: string;
  breadcrumbs: BreadcrumbItem[];
  image?: string;
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
  image,
}: InnerBannerProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const bannerImage = image ?? innerBanner;

  return (
    <div
      ref={sectionRef}
      className="relative overflow-hidden pt-34 pb-16 sm:pb-20"
    >
      <CustomImage
        src={bannerImage}
        title={title}
        fill
        className="object-cover"
        priority
      />

      <div className="absolute inset-0 bg-[#0b0f1a]/40" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-[#0b0f1a]/35 to-[#0b0f1a]/85" />
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(177,18,38,0.35), transparent)",
        }}
      />
      <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-[#0b0f1a]/90 to-transparent" />

      <div className="relative z-10 container">
        <MotionDiv
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="space-y-5 lg:space-y-4"
        >
          <MotionNav variants={itemVariants} className="hidden sm:block">
            <ol className="flex items-center flex-wrap gap-1.5 sm:gap-2.5 text-xs sm:text-sm">
              <li className="flex items-center gap-1.5 sm:gap-2.5">
                <Link
                  href="/"
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

          <MotionDiv variants={itemVariants}>
            <strong className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] tracking-tight">
              {title}
            </strong>
            {subtitle && (
              <p className="text-white/60 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed font-light mt-3">
                {subtitle}
              </p>
            )}
          </MotionDiv>

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
  );
}

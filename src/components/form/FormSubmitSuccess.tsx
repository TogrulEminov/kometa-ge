"use client";

import { motion } from "framer-motion";
import { FaCheck } from "react-icons/fa6";
import { cn } from "@/utils/cn";

type FormSubmitSuccessVariant = "default" | "hero" | "modal";

type FormSubmitSuccessProps = {
  title: string;
  description: string;
  resetLabel?: string;
  onReset?: () => void;
  variant?: FormSubmitSuccessVariant;
  className?: string;
};

const variantStyles: Record<
  FormSubmitSuccessVariant,
  {
    wrapper: string;
    iconWrap: string;
    icon: string;
    title: string;
    description: string;
    button: string;
  }
> = {
  default: {
    wrapper: "py-10",
    iconWrap: "bg-primary/10 text-primary",
    icon: "text-primary",
    title: "text-foreground",
    description: "text-muted",
    button:
      "border border-white/10 bg-surface-elevated text-foreground hover:border-primary/40 hover:bg-white/5",
  },
  hero: {
    wrapper: "py-8",
    iconWrap: "bg-white/15 text-white",
    icon: "text-white",
    title: "text-white",
    description: "text-white/70",
    button: "bg-white text-[#B11226] hover:bg-white/90",
  },
  modal: {
    wrapper: "py-12",
    iconWrap: "bg-green-500/15 text-green-400",
    icon: "text-green-400",
    title: "text-[#f1f5f9]",
    description: "text-[#94a3b8]",
    button:
      "border border-white/10 bg-[#1a2030] text-[#f1f5f9] hover:border-primary/40",
  },
};

export default function FormSubmitSuccess({
  title,
  description,
  resetLabel,
  onReset,
  variant = "default",
  className,
}: FormSubmitSuccessProps) {
  const styles = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cn(
        "flex flex-col items-center justify-center text-center",
        styles.wrapper,
        className,
      )}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 380, damping: 22, delay: 0.05 }}
        className={cn(
          "mb-5 flex h-16 w-16 items-center justify-center rounded-full",
          styles.iconWrap,
        )}
      >
        <FaCheck className={cn("h-7 w-7", styles.icon)} />
      </motion.div>

      <h3 className={cn("mb-2 text-xl font-bold sm:text-2xl", styles.title)}>
        {title}
      </h3>
      <p
        className={cn(
          "mb-6 max-w-sm text-sm leading-relaxed sm:text-base",
          styles.description,
        )}
      >
        {description}
      </p>

      {onReset && resetLabel && (
        <button
          type="button"
          onClick={onReset}
          className={cn(
            "cursor-pointer rounded-xl px-6 py-3 text-sm font-semibold transition-colors",
            styles.button,
          )}
        >
          {resetLabel}
        </button>
      )}
    </motion.div>
  );
}

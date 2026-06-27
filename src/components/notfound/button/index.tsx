"use client";

import { CustomLocales } from "@/services/interface/type";
import { useRouter } from "next/navigation";
import { BsArrowLeft } from "react-icons/bs";

type GoBackProps = {
  locale: (typeof CustomLocales)[keyof typeof CustomLocales];
};

const buttonTexts = {
  en: "Go Back",
  ka: "უკან დაბრუნება",
};

export default function GoBack({ locale }: GoBackProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 bg-surface-elevated px-6 py-3 text-sm font-semibold text-foreground transition-all duration-300 hover:border-primary/40 hover:bg-white/5 sm:w-auto sm:px-8 sm:py-4 sm:text-base"
    >
      <BsArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 sm:h-5 sm:w-5" />
      <span>{buttonTexts[locale]}</span>
    </button>
  );
}

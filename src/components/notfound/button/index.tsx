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
      onClick={() => router.back()}
      className="group flex items-center cursor-pointer justify-center gap-2 w-full bg-secondary sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-white text-ui-1 border-2 border-ui-2 rounded-lg font-semibold hover:bg-ui-5 hover:border-ui-4 transition-all duration-300"
    >
      <BsArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
      <span className="text-sm sm:text-base">{buttonTexts[locale]}</span>
    </button>
  );
}

"use client";

import { getSmartRedirectUrl } from "@/actions/client/locale/slug.actions";
import useOutSideClick from "@/hooks/useOutsideClick";
import { detectLocaleContentType } from "@/i18n/locale-routing";
import { usePathname, useRouter } from "@/i18n/navigation";
import { CustomLocales } from "@/services/interface/type";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useRouter as useNextRouter } from "next/navigation";
import { useRef, useTransition } from "react";
import { IoChevronDownOutline, IoGlobeOutline } from "react-icons/io5";

const languages = [
  { code: "en" as const, display: "En" },
  { code: "ka" as const, display: "Ge" },
];

export default function Language() {
  const ref = useRef<HTMLDivElement>(null);
  const currentLocale = useLocale() as CustomLocales;
  const router = useRouter();
  const nextRouter = useNextRouter();
  const pathname = usePathname();
  const params = useParams();
  const { handleToggle, open, handleClose } = useOutSideClick({ ref });
  const [isPending, startTransition] = useTransition();

  const handleChangeLanguage = (newLocale: CustomLocales) => {
    if (currentLocale === newLocale || isPending) return;
    handleClose();

    startTransition(async () => {
      const category = params.category as string | undefined;
      const slug = params.slug as string | undefined;
      const contentType = detectLocaleContentType(pathname, { category, slug });

      if (contentType) {
        const url = await getSmartRedirectUrl({
          slug: (slug || category) as string,
          category: contentType === "sub-services" ? category : undefined,
          locale: newLocale,
          type: contentType,
        });

        if (url) {
          nextRouter.push(url);
          return;
        }

        const fallbackPath =
          contentType === "directions" ? "/directions" : "/services";
        router.replace(fallbackPath, { locale: newLocale });
        return;
      }

      router.replace(pathname as Parameters<typeof router.replace>[0], {
        locale: newLocale,
      });
    });
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={handleToggle}
        disabled={isPending}
        className="flex h-8 cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-3 text-[13px] font-semibold text-white transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 md:bg-transparent"
        aria-label="Select language"
      >
        <IoGlobeOutline size={15} />
        <span className="min-w-[20px] uppercase">
          {currentLocale === "ka" ? "Ge" : currentLocale}
        </span>
        <IoChevronDownOutline
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          size={12}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 pt-2">
          <div className="min-w-24 overflow-hidden rounded-sm border border-gray-100 bg-white p-1.5 shadow-xl">
            {languages
              .filter((language) => language.code !== currentLocale)
              .map((language) => (
                <button
                  key={language.code}
                  type="button"
                  onClick={() => handleChangeLanguage(language.code)}
                  disabled={isPending}
                  className="w-full cursor-pointer rounded-sm px-4 py-1.5 text-left text-[13px] font-semibold text-gray-600 transition-all duration-200 hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={`Change language to ${language.display}`}
                >
                  {isPending ? "..." : language.display}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

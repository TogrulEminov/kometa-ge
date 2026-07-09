import CustomImage from "@/globalElement/CustomImage";
import { Link } from "@/i18n/navigation";
import { FileType, HeroInfo, SectionLocale } from "@/services/interface/type";
import CallAction from "./CallAction";
import { fetchHeroInfo } from "@/actions/ui/main.controller";
import { getTranslations } from "next-intl/server";
import { getForCards } from "@/utils/getFullimageUrl";
import Tracking from "./atoms/Tracking";
import HeroVideoPlay from "./atoms/HeroVideoPlay";
import { Suspense } from "react";

const ourBranches = [
  {
    href: "https://profitransport.az",
    path: "/assets/profi.svg",
    title: "Profi Transport",
  },
  {
    href: "https://kometa.kz/",
    path: "/assets/kometa-kz.svg",
    title: "Kometa KZ",
  },
];

export default async function HomeHeroComponent({ locale }: SectionLocale) {
  const heroInfo = await fetchHeroInfo({ locale });
  const t = await getTranslations("atoms");
  const translations = heroInfo?.translations?.[0] ?? null;
  const videoUrl = getForCards(heroInfo?.videoUrl as FileType);
  const heroImageUrl = getForCards(heroInfo?.imageUrl as FileType);

  return (
    <>
      {heroImageUrl ? (
        <link rel="preload" as="image" href={heroImageUrl} fetchPriority="high" />
      ) : null}
      <section className="relative lg:h-200 flex flex-col justify-start items-start">
        <div className="absolute inset-0 z-0">
          <CustomImage
            width={1920}
            height={1080}
            className="w-full h-full object-cover"
            title={translations?.title}
            src={heroImageUrl}
            priority
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10  h-full flex-1 container flex justify-start items-start">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-10 lg:gap-12 w-full pt-36 lg:pt-45 pb-16">
            {/* Left */}
            <article className="flex flex-col justify-center  max-w-2xl space-y-6">
              {translations?.subTitle && (
                <span className="inline-block w-fit bg-[#B11226] text-white text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full">
                  {translations?.subTitle}
                </span>
              )}
              <h1
                title={translations?.title}
                className="text-white text-2xl lg:text-4xl font-bold leading-tight uppercase"
              >
                {translations?.title}
              </h1>

              <div className="flex items-center gap-4 pt-2">
                <Link
                  href="/contact"
                  className="flex items-center gap-2 bg-[#B11226] hover:bg-[#8f0e1e] text-white text-sm font-semibold uppercase tracking-wider px-6 py-3.5 rounded transition-colors duration-200"
                >
                  {t("buttons.contact_us")}
                  <span className="text-base">›</span>
                </Link>

                {videoUrl && (
                  <HeroVideoPlay
                    videoUrl={videoUrl}
                    mimeType={heroInfo?.videoUrl?.mimeType}
                  />
                )}
              </div>
            </article>

            {/* Right */}
            <div className="flex flex-col justify-center space-y-4">
              {/* Avatars */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {ourBranches.map((src, i) => (
                    <a
                      key={i}
                      href={src?.href || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="size-12 p-2 border-2 border-white rounded-full bg-white flex items-center justify-center"
                    >
                      <img
                        src={src?.path}
                        alt={src?.title}
                        className="object-contain"
                        loading="lazy"
                        decoding="async"
                      />
                    </a>
                  ))}
                  <div className="size-12 rounded-full border-2 border-white bg-[#B11226] flex items-center justify-center text-white font-bold text-lg">
                    +
                  </div>
                </div>
              </div>

              {translations?.description && (
                <p className="text-white/80 text-sm leading-relaxed max-w-md">
                  {translations?.description}
                </p>
              )}
              <Suspense fallback={null}>
                <Tracking />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
      <CallAction
        className="lg:block hidden"
        heroInfo={heroInfo as unknown as HeroInfo}
      />
    </>
  );
}

import { FaArrowRight } from "react-icons/fa";
import CustomImage from "@/globalElement/CustomImage";
import Accordion from "./atoms/Accordion";
import { fetchFeaturesInfo } from "@/actions/ui/main.controller";
import {
  CustomLocales,
  newInfoJson,
  SectionLocale,
} from "@/services/interface/type";
import { findJsonSection } from "@/utils/findJsonSection";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { FaShield } from "react-icons/fa6";
import { getForCards } from "@/utils/getFullimageUrl";
import { Suspense } from "react";

export default async function WhyChooseUs({ locale }: SectionLocale) {
  const features = await fetchFeaturesInfo({ locale: locale as CustomLocales });
  const featuresTr = features?.translations?.[0] ?? null;
  const t = await getTranslations("atoms");
  const imageUrl = getForCards(features?.imageUrl);
  const benefits = findJsonSection<newInfoJson>(
    featuresTr?.description as unknown,
    "benefits",
  );
  const reliableDeliveryDesc = findJsonSection<newInfoJson>(
    featuresTr?.description as unknown,
    "reliable_delivery_desc",
  );
  const main = findJsonSection<newInfoJson>(
    featuresTr?.description as unknown,
    "main",
  );
  if (!features) return null;
  return (
    <section className="w-full pt-5 pb-20 bg-white">
      <div className="container space-y-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            {featuresTr?.subTitle && (
              <span className="inline-flex items-center px-5 py-2 bg-primary text-white text-xs font-bold tracking-[2px] uppercase rounded-full mb-6">
                {featuresTr?.subTitle}
              </span>
            )}
            {featuresTr?.title && (
              <h2
                title={featuresTr?.title}
                className="text-4xl md:text-5xl lg:text-[56px] font-bold text-secondary leading-[1.1] tracking-tight"
              >
                {featuresTr?.title}
              </h2>
            )}
          </div>
          <Link
            href="/about"
            className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white text-sm font-bold tracking-wider uppercase rounded-lg hover:bg-[#A00D24] transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 flex-shrink-0 self-start md:self-auto"
          >
            {t("buttons.get_started")}
            <FaArrowRight className="text-xs" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits?.items?.slice(0, 3).map((feature, i) => (
            <div key={i} className="group">
              {/* Icon */}
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/30">
                <span className="text-white">
                  <FaShield />
                </span>
              </div>

              {/* Title */}
              <strong className="text-lg font-bold text-secondary tracking-wide mb-4">
                {feature?.itemTitle}
              </strong>

              {/* Description */}
              <p className="text-[#64748B] text-[15px] leading-relaxed mb-6">
                {feature?.itemDescription}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="relative">
            <div className="relative h-104 rounded-2xl overflow-hidden">
              {imageUrl ? (
                <CustomImage
                  src={imageUrl}
                  title={featuresTr?.title as string}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 rounded-2xl" />
              )}
            </div>

            {/* Floating Card */}
            {main && (
              <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-auto bg-white rounded-xl p-6 md:p-8 shadow-2xl max-w-sm">
                <span className="inline-flex items-center px-4 py-1.5 bg-primary text-white text-[11px] font-bold tracking-[2px] uppercase rounded-full mb-4">
                  {main?.subTitle}
                </span>
                <h4 className="text-xl font-bold text-secondary">
                  {main?.title}
                </h4>
              </div>
            )}
          </div>

          {/* Right: Accordion */}
          <div className="flex flex-col gap-4">
            <Suspense fallback={null}>
              <Accordion items={reliableDeliveryDesc?.items ?? []} />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}

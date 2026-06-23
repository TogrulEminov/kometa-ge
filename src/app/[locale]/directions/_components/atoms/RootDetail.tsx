import CustomImage from "@/globalElement/CustomImage";
import { sanitizeHtml } from "@/lib/domburify";
import { DirectionsType, newInfoJson } from "@/services/interface/type";
import { findJsonSection } from "@/utils/findJsonSection";
import { getForCards } from "@/utils/getFullimageUrl";
import InteractiveRouteMap from "../InteractiveRouteMap";
import Link from "next/link";
import CtaButton from "./CtaButton";
import { getTranslations } from "next-intl/server";

export default async function RootDetail({ data }: { data: DirectionsType }) {
  const routeData = data?.route;

  const dataTr = data?.translations?.[0];

  const mainData = findJsonSection(dataTr?.description, "main");
  const faqData = findJsonSection(dataTr?.description, "faq");
  const featuresData = findJsonSection(dataTr?.description, "features");
  const advantagesData = findJsonSection(dataTr?.description, "advantages");
  const ctaData = findJsonSection(dataTr?.description, "cta");

  return (
    <div className="space-y-8">
      <MainInfo data={data} mainData={mainData as newInfoJson} />
      <InteractiveRouteMap fromIso={routeData.from} toIso={routeData.to} />
      <KeyFeatures data={featuresData as newInfoJson} />
      <WhyThisRoute data={advantagesData as newInfoJson} />
      <CommonQuestions data={faqData as newInfoJson} />
      <CtaComponent data={ctaData as newInfoJson} />
    </div>
  );
}
export function MainInfo({
  data,
  mainData,
}: {
  data: DirectionsType;
  mainData: newInfoJson;
}) {
  const dataTr = data?.translations?.[0];
  const imageUrl = getForCards(data?.imageUrl);
  return (
    <div className="space-y-8">
      <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-100">
        {imageUrl ? (
          <CustomImage
            width={1200}
            height={500}
            className="w-full h-80 object-cover"
            src={imageUrl}
            title={dataTr?.title}
          />
        ) : (
          <div className="w-full h-80 bg-gray-100 rounded-lg" />
        )}
      </div>

      <div className="space-y-4">
        {mainData?.subTitle && (
          <span className="text-primary text-sm font-bold tracking-wider uppercase">
            {mainData?.subTitle}
          </span>
        )}
        {dataTr?.title && (
          <h1
            title={dataTr?.title}
            className="text-secondary text-3xl md:text-4xl font-bold mt-2"
          >
            {dataTr?.title}
          </h1>
        )}
        <div className="w-16 h-1 bg-primary rounded-full mt-4" />
      </div>

      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <h2 className="text-secondary font-bold text-xl mb-4">
          {mainData?.title}
        </h2>
        <article
          className="text-secondary/70 leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(mainData?.description ?? ""),
          }}
        />
      </div>
    </div>
  );
}
export function KeyFeatures({ data }: { data: newInfoJson }) {
  if (!data) return null;
  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
      <h2 className="text-secondary font-bold text-xl mb-6">{data.title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.items.map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-4 py-2 px-3 bg-tertiary rounded-sm"
          >
            <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
            <span className="text-secondary/80 text-sm font-medium leading-relaxed">
              {item.itemTitle as string}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
export function WhyThisRoute({ data }: { data: newInfoJson }) {
  if (!data) return null;
  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
      <h2 className="text-secondary font-bold text-xl mb-6">{data.title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.items.map((item, i) => (
          <div key={i} className="p-6 bg-tertiary rounded-2xl">
            <h3 className="text-secondary font-bold text-base mb-2">
              {item.itemTitle as string}
            </h3>
            <p className="text-secondary/60 text-sm leading-relaxed">
              {item.itemDescription as string}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
export function CommonQuestions({ data }: { data: newInfoJson }) {
  if (!data) return null;
  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
      <h2 title={data.title} className="text-secondary font-bold text-xl mb-6">
        {data.title}
      </h2>
      <div className="space-y-4">
        {data.items.map((item, i) => {
          if (!item.itemDescription || !item.itemTitle) return null;
          return (
            <details
              key={i}
              className="border border-gray-100 rounded-xl overflow-hidden"
            >
              <summary className="flex items-center justify-between p-5 cursor-pointer list-none select-none">
                <span className="text-secondary font-bold text-sm">
                  {item.itemTitle as string}
                </span>
                <span className="text-primary text-lg font-bold">+</span>
              </summary>
              <div className="px-5 pb-5">
                <div className="border-t border-gray-100 pt-4">
                  <article
                    className="text-secondary/60 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtml(item.itemDescription as string),
                    }}
                  />
                </div>
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
export async function CtaComponent({ data }: { data: newInfoJson }) {
  const t = await getTranslations("atoms.buttons");
  if (!data) return null;
  return (
    <div className="bg-secondary rounded-2xl p-8 text-center">
      <strong
        title={data.title}
        className="text-white text-2xl block font-bold mb-3"
      >
        {data.title}
      </strong>
      <p className="text-white/70 text-sm mb-6 max-w-lg mx-auto">
        {data.description}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <CtaButton />
        <Link
          href={"/contact"}
          className="bg-white hover:bg-white/90 text-secondary font-bold py-4 px-8 rounded-xl hover:bg-tertiary transition-colors duration-300"
        >
          {t("contact_us")}
        </Link>
      </div>
    </div>
  );
}

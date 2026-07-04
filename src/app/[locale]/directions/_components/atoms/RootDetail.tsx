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
      {routeData?.from && routeData?.to && (
        <InteractiveRouteMap fromIso={routeData.from} toIso={routeData.to} />
      )}
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
      <div className="surface-card overflow-hidden">
        {imageUrl ? (
          <CustomImage
            width={1200}
            height={500}
            className="w-full h-80 object-cover"
            src={imageUrl}
            title={dataTr?.title}
          />
        ) : (
          <div className="w-full h-80 bg-surface-elevated" />
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
            className="text-foreground text-3xl md:text-4xl font-bold mt-2"
          >
            {dataTr?.title}
          </h1>
        )}
        <div className="w-16 h-1 bg-primary rounded-full mt-4" />
      </div>

      <div className="surface-card p-8">
        <h2 className="text-foreground font-bold text-xl mb-4">
          {mainData?.title}
        </h2>
        <article
          className="text-muted leading-relaxed [&_a]:text-primary [&_a]:underline"
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
    <div className="surface-card p-8">
      <h2 className="text-foreground font-bold text-xl mb-6">{data.title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.items.map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-4 py-2 px-3 bg-surface-elevated/60 rounded-sm"
          >
            <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
            <span className="text-foreground/80 text-sm font-medium leading-relaxed">
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
    <div className="surface-card p-8">
      <h2 className="text-foreground font-bold text-xl mb-6">{data.title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.items.map((item, i) => (
          <div key={i} className="p-6 bg-surface-elevated/60 rounded-2xl">
            <h3 className="text-foreground font-bold text-base mb-2">
              {item.itemTitle as string}
            </h3>
            <p className="text-muted text-sm leading-relaxed">
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
    <div className="surface-card p-8">
      <h2 title={data.title} className="text-foreground font-bold text-xl mb-6">
        {data.title}
      </h2>
      <div className="space-y-4">
        {data.items.map((item, i) => {
          if (!item.itemDescription || !item.itemTitle) return null;

          return (
            <details
              key={i}
              className="border border-white/10 rounded-xl overflow-hidden bg-surface-elevated/40"
            >
              <summary className="flex items-center justify-between p-5 cursor-pointer list-none select-none">
                <span className="text-foreground font-bold text-sm">
                  {item.itemTitle as string}
                </span>
                <span className="text-primary text-lg font-bold">+</span>
              </summary>
              <div className="px-5 pb-5">
                <div className="border-t border-white/10 pt-4">
                  <article
                    className="text-muted text-sm leading-relaxed [&_a]:text-primary"
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
    <div className="rounded-2xl border border-white/10 bg-linear-to-br from-primary to-[#8a0d1e] p-8 text-center shadow-xl">
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
          href="/contact"
          className="border border-white/20 bg-surface-elevated hover:bg-surface text-foreground font-bold py-4 px-8 rounded-xl transition-colors duration-300"
        >
          {t("contact_us")}
        </Link>
      </div>
    </div>
  );
}

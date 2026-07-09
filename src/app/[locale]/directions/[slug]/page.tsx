import InnerBanner from "@/components/InnerBanner";
import DirectionsDetailContainer from "../_components/DirectionsDetailContainer";
import {
  fetchCategoriesByKey,
  fetchContactInformation,
  fetchDirections,
  fetchDirectionsDetailMain,
  fetchSocials,
} from "@/actions/ui/main.controller";
import {
  CategoryKey,
  CustomLocales,
  DirectionsType,
  IContactInformation,
  Social,
} from "@/services/interface/type";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Metadata } from "next";
import { generatePageMetadata } from "@/utils/metadata-generator";
import { DetailPageFallback } from "@/components/fallbacks";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  return generatePageMetadata({
    locale,
    customPath: "directions",
    dataType: "directions",
    slug,
    detail: true,
  });
}

export default async function DirectionsDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const directionData = await fetchDirectionsDetailMain({
    locale: locale as CustomLocales,
    slug: slug,
  });
  const directionTr = directionData?.translations?.[0];
  const categoryData = await fetchCategoriesByKey({
    locale: locale as CustomLocales,
    key: CategoryKey.directions,
  });
  const categoryTr = categoryData?.translations?.[0];

  if (!directionTr) return notFound();
  return (
    <>
      <InnerBanner
        title={directionTr?.title ?? ""}
        subtitle={directionTr?.shortDescription ?? ""}
        breadcrumbs={[
          { label: categoryTr?.title ?? "", href: "/directions" },
          { label: directionTr?.title ?? "" },
        ]}
      />
      <Suspense fallback={<DetailPageFallback />}>
        <Content
          data={directionData as unknown as DirectionsType}
          locale={locale as CustomLocales}
        />
      </Suspense>
    </>
  );
}

async function Content({
  data,
  locale,
}: {
  data: DirectionsType;
  locale: CustomLocales;
}) {
  const socials = await fetchSocials();
  const contactInfo = await fetchContactInformation(locale as CustomLocales);
  const directionCollections = await fetchDirections({
    pageNumber: 1,
    locale: locale as CustomLocales,
  });
  return (
    <DirectionsDetailContainer
      socials={socials as unknown as Social[]}
      contactInfo={contactInfo as unknown as IContactInformation}
      data={data as unknown as DirectionsType}
      directionCollections={directionCollections?.data as unknown as DirectionsType[]}
    />
  );
}

import InnerBanner from "@/components/InnerBanner";
import DirectionsContainer from "./_components/DirectionsContainer";
import { fetchCategoriesByKey, fetchDirections } from "@/actions/ui/main.controller";
import { CategoryKey, CustomLocales, DirectionsType, newInfoJson, PaginationItem } from "@/services/interface/type";
import { findJsonSection } from "@/utils/findJsonSection";
import { Suspense } from "react";
interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | number | boolean }>;
}
export default async function DirectionsPage({
  params,
  searchParams,
}: PageProps) {
  const locale = (await params).locale;
  const categoryData = await fetchCategoriesByKey({
    locale: locale as CustomLocales,
    key: CategoryKey.directions,
  });
  const categoryTr = categoryData?.translations?.[0];
  const bannerDescription = findJsonSection<newInfoJson>(
    categoryTr?.description,
    "banner",
  );
  const sectionContent = findJsonSection<newInfoJson>(
    categoryTr?.description,
    "sectionContent",
  );
  return (
    <>
      <InnerBanner
        title={categoryTr?.title ?? ""}
        subtitle={bannerDescription?.description ?? ""}
        breadcrumbs={[{ label: categoryTr?.title ?? "" }]}
        variant="dark"
      />
      <Suspense fallback={null}>
        <CardArea
          searchParams={searchParams}
          sectionContent={sectionContent}
          locale={locale as CustomLocales}
        />
      </Suspense>
    </>
  );
}
async function CardArea({
  searchParams,
  sectionContent,
  locale,
}: {
  searchParams: Promise<{ [key: string]: string | number | boolean }>;
  sectionContent: newInfoJson | undefined;
  locale: CustomLocales;
}) {
  const searchParamsData = await searchParams;
  const { page = 1 } = searchParamsData;

  const services = await fetchDirections({
    pageNumber: Number(page),
    locale: locale as CustomLocales,
  });
  return (
    <DirectionsContainer
      data={services?.data as unknown as DirectionsType[]}
      sectionContent={sectionContent as newInfoJson}
      paginations={services.paginations as PaginationItem}
    />
  );
}

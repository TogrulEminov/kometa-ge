import InnerBanner from "@/components/InnerBanner";
import CertificatesContainer from "./_components/CertificatesContainer";
import {
  fetchCategoriesByKey,
  fetchCertificates,
} from "@/actions/ui/main.controller";
import {
  CategoryKey,
  CertificatesType,
  CustomLocales,
  newInfoJson,
  PaginationItem,
} from "@/services/interface/type";
import { findJsonSection } from "@/utils/findJsonSection";
import { Suspense } from "react";
import { Metadata } from "next";
import { generatePageMetadata } from "@/utils/metadata-generator";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | number | boolean }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return generatePageMetadata({
    locale,
    customPath: "certificates",
    categoryKey: CategoryKey.certificates,
  });
}

export default async function CertificatesPage({
  params,
  searchParams,
}: PageProps) {
  const locale = (await params).locale;
  const categoryData = await fetchCategoriesByKey({
    locale: locale as CustomLocales,
    key: CategoryKey.certificates,
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

  const services = await fetchCertificates({
    pageNumber: Number(page),
    locale: locale as CustomLocales,
  });
  return (
    <CertificatesContainer
      data={services?.data as unknown as CertificatesType[]}
      sectionContent={sectionContent as newInfoJson}
      paginations={services.paginations as PaginationItem}
    />
  );
}

import "leaflet/dist/leaflet.css";
import InnerBanner from "@/components/InnerBanner";
import ContactSection from "./_components/ContactSection";
import {
  CategoryKey,
  CustomLocales,
  IContactInformation,
  newInfoJson,
  Social,
} from "@/services/interface/type";
import {
  fetchCategoriesByKey,
  fetchContactInformation,
  fetchSocials,
} from "@/actions/ui/main.controller";
import { findJsonSection } from "@/utils/findJsonSection";
import { Suspense } from "react";
import { Metadata } from "next";
import { generatePageMetadata } from "@/utils/metadata-generator";
import { ContactSectionFallback } from "@/components/fallbacks";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return generatePageMetadata({
    locale,
    customPath: "contact",
    categoryKey: CategoryKey.contact,
  });
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  const categoryData = await fetchCategoriesByKey({
    locale: locale as CustomLocales,
    key: CategoryKey.contact,
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
      <Suspense fallback={<ContactSectionFallback />}>
        <CardArea
          sectionContent={sectionContent}
          locale={locale as CustomLocales}
        />
      </Suspense>
    </>
  );
}

async function CardArea({
  sectionContent,
  locale,
}: {
  sectionContent: newInfoJson | undefined;
  locale: CustomLocales;
}) {
  const contactInfo = await fetchContactInformation(locale);
  const socials = await fetchSocials();
  return (
    <ContactSection
      data={contactInfo as unknown as IContactInformation}
      sectionContent={sectionContent as newInfoJson}
      socials={socials as unknown as Social[]}
    />
  );
}

import HeroSection from "./_components/HeroSection";
import StickySidebar from "./_components/StickySidebar";
import AboutContent from "./_components/AboutContent";
import GeographyGrid from "./_components/GeographyGrid";
import BranchCards from "./_components/BranchCards";
import FAQSection from "./_components/FAQSection";
import ServicesList from "./_components/ServicesList";
import CTASection from "../(home)/_components/CtaSection";
import InnerBanner from "@/components/InnerBanner";
import {
  fetchAboutMainInfo,
  fetchCategoriesByKey,
  fetchContactInformation,
  fetchSocials,
} from "@/actions/ui/main.controller";
import {
  AboutMainType,
  CategoryKey,
  CustomLocales,
  IContactInformation,
  newInfoJson,
  Social,
} from "@/services/interface/type";
import { findJsonSection } from "@/utils/findJsonSection";
import { parseJSON } from "@/utils/parseJson";
import { Suspense } from "react";
import { Metadata } from "next";
import { generatePageMetadata } from "@/utils/metadata-generator";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return generatePageMetadata({
    locale,
    customPath: "about",
    categoryKey: CategoryKey.about,
  });
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  const aboutInfo = await fetchAboutMainInfo({
    locale: locale as CustomLocales,
  });
  const aboutCategories = await fetchCategoriesByKey({
    locale: locale as CustomLocales,
    key: "about",
  });

  const aboutCategoriesTr = aboutCategories?.translations?.[0];
  const catDescription = findJsonSection<newInfoJson>(
    aboutCategoriesTr?.description,
    "banner",
  );

  const aboutInfoTr = aboutInfo?.translations?.[0];
  const contactInfo = await fetchContactInformation(locale as CustomLocales);
  const socials = await fetchSocials();
  return (
    <>
      <InnerBanner
        title={aboutCategoriesTr?.title ?? ""}
        subtitle={catDescription?.description ?? ""}
        breadcrumbs={[{ label: aboutCategoriesTr?.title ?? "" }]}
      />
      <HeroSection aboutInfo={aboutInfo as unknown as AboutMainType} />
      <Suspense fallback={null}>
        <section className="bg-background py-10 lg:py-20 border-b border-white/10">
          <div className="container">
            <div className="grid lg:grid-cols-12 gap-12">
              <div className="lg:col-span-4 order-2 lg:order-1">
                <StickySidebar
                  socials={socials as unknown as Social[]}
                  descriptionTitles={
                    parseJSON<newInfoJson>(aboutInfoTr?.description ?? "")
                      ?.data ?? []
                  }
                  contactInfo={contactInfo as unknown as IContactInformation}
                />
              </div>
              <div className="lg:col-span-8 space-y-20 lg:order-2 order-1">
                <AboutContent
                  aboutInfo={aboutInfo as unknown as AboutMainType}
                />
                <Suspense fallback={null}>
                  <GeographyGrid
                    aboutInfo={aboutInfo as unknown as AboutMainType}
                  />
                </Suspense>
                <Suspense fallback={null}>
                  <FAQSection
                    aboutInfo={aboutInfo as unknown as AboutMainType}
                  />
                </Suspense>
                <Suspense fallback={null}>
                  <ServicesList
                    aboutInfo={aboutInfo as unknown as AboutMainType}
                  />
                </Suspense>
                <Suspense fallback={null}>
                  <BranchCards
                    aboutInfo={aboutInfo as unknown as AboutMainType}
                  />
                </Suspense>
              </div>
            </div>
          </div>
        </section>
      </Suspense>
      <Suspense fallback={null}>
        <CTASection locale={locale as CustomLocales} />
      </Suspense>
    </>
  );
}

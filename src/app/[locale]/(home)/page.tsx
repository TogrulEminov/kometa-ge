import HomeHeroComponent from "./_components/Hero";
import HomeAboutComponent from "./_components/AboutSection";
import HomeServicesSection from "./_components/Services";
import WhyChooseUs from "./_components/ChooseUs";
import HomeDirectionsSection from "./_components/Directions";
import FAQSection from "./_components/FagSection";
import MediaSection from "./_components/MediaCard";
import HowItWorksHome from "./_components/HowItWorks";
import CTASectionV1 from "./_components/CtaSection";
import { CustomLocales } from "@/services/interface/type";
import { Suspense } from "react";
interface PageProps {
  params: Promise<{ locale: string }>;
}
export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;

  return (
    <>
      <HomeHeroComponent locale={locale as CustomLocales} />
      <Suspense fallback={null}>
        <HomeServicesSection locale={locale as CustomLocales} />
      </Suspense>
      <Suspense fallback={null}>
        <HomeAboutComponent locale={locale as CustomLocales} />
      </Suspense>
      <Suspense fallback={null}>
        <HomeDirectionsSection locale={locale as CustomLocales} />
      </Suspense>
      <Suspense fallback={null}>
        <WhyChooseUs locale={locale as CustomLocales} />
      </Suspense>
      <Suspense fallback={null}>
        <HowItWorksHome locale={locale as CustomLocales} />
      </Suspense>
      <Suspense fallback={null}>
        <MediaSection locale={locale as CustomLocales} />
      </Suspense>
      <Suspense fallback={null}>
        <FAQSection locale={locale as CustomLocales} />
      </Suspense>
      <Suspense fallback={null}>
        <CTASectionV1 locale={locale as CustomLocales} />
      </Suspense>
    </>
  );
}

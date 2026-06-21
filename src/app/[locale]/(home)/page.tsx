import HomeHeroComponent from "./_components/Hero";
import CallAction from "./_components/CallAction";
import HomeAboutComponent from "./_components/AboutSection";
import HomeServicesSection from "./_components/Services";
import WhyChooseUs from "./_components/ChooseUs";
import HomeDirectionsSection from "./_components/Directions";
import FAQSection from "./_components/FagSection";
import MediaSection from "./_components/MediaCard";
import HowItWorksHome from "./_components/HowItWorks";
import CTASectionV1 from "./_components/CtaSection";
import { CustomLocales } from "@/services/interface/type";
interface PageProps {
  params: Promise<{ locale: string }>;
}
export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;

  return (
    <>
      <HomeHeroComponent locale={locale as CustomLocales} />

      <HomeServicesSection locale={locale as CustomLocales} />
      {/*  <HomeAboutComponent locale={locale} />
      <HomeDirectionsSection locale={locale} />
      <WhyChooseUs locale={locale} />
      <HowItWorksHome locale={locale} />
      <MediaSection locale={locale} />
      <FAQSection locale={locale} />
      <CTASectionV1 locale={locale} /> */}
    </>
  );
}

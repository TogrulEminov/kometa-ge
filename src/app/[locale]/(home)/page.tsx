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
export default function HomePage() {
  return (
    <>
      <HomeHeroComponent />
      <CallAction className="lg:block hidden" />
      <HomeServicesSection />
      <HomeAboutComponent />
      <HomeDirectionsSection />
      <WhyChooseUs />
      <HowItWorksHome />
      <MediaSection />
      <FAQSection />
      <CTASectionV1 />
    </>
  );
}

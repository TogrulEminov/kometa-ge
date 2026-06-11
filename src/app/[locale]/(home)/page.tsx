import HomeHeroComponent from "./_container/Hero";
import CallAction from "./_container/CallAction";
import HomeAboutComponent from "./_container/AboutSection";
import HomeServicesSection from "./_container/Services";
import WhyChooseUs from "./_container/ChooseUs";
import HomeDirectionsSection from "./_container/Directions";
import FAQSection from "./_container/FagSection";
import MediaSection from "./_container/MediaCard";
import HowItWorksHome from "./_container/HowItWorks";
import CTASectionV1 from "./_container/CtaSection";
import ShipmentModal from "./_container/atoms/FormModal";
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

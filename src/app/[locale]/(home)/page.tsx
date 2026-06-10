import React from "react";
import HomeHeroComponent from "./_container/Hero";
import CallAction from "./_container/CallAction";
import HomeAboutComponent from "./_container/AboutSection";
import HomeServicesSection from "./_container/Services";
import WhyChooseUs from "./_container/ChooseUs";
import HomeDirectionsSection from "./_container/Directions";
import FAQSection from "./_container/FagSection";
import MediaSection from "./_container/MediaCard";

export default function page() {
  return (
    <>
      <HomeHeroComponent />
      <CallAction className="lg:block hidden" />
      <HomeServicesSection/>
      <HomeAboutComponent />
      <HomeDirectionsSection/>
      <WhyChooseUs/>
      <MediaSection/>
      <FAQSection/>
    </>
  );
}

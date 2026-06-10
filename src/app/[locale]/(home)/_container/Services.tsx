import SectionContentComponent from "@/components/SectionContent";
import ServiceCard from "@/globalElement/cards/ServicesCard";
import MySwiper from "@/lib/swiper";
import React from "react";

export default function HomeServicesSection() {
  return (
    <section className="py-10 lg:py-20">
      <div className="container">
        <SectionContentComponent
          title="Our Services "
          type="vertical"
          rootClass="[&_article]:max-w-4xl!"
          subTitle={"Transportation services"}
          description={
            "We handle the international transportation of heavy machinery and various goods with our own vehicles and professional team. Every transportation process, whether by road, rail, or other logistics solutions, is executed with high precision and security."
          }
        />

        <div className="grid lg:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((item, i) => {
            return <ServiceCard key={i} />;
          })}
        </div>
      </div>
    </section>
  );
}

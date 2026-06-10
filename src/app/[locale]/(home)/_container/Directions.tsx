import SectionContentComponent from "@/components/SectionContent";
import DirectionsCard from "@/globalElement/cards/DirectionsCard";
import ServiceCard from "@/globalElement/cards/ServicesCard";

export default function HomeDirectionsSection() {
  return (
    <section className="pt-0 pb-20">
      <div className="container">
        <SectionContentComponent
          title="Our International Transport Network"
          type="vertical"
          rootClass="[&_article]:max-w-4xl!"
          subTitle={"Directions"}
          description={
            "Kometa KZ operates a broad logistics network, carrying out road and rail transportation between Asia and Europe. We provide flexible solutions for FTL, LTL, and heavy cargo transport, ensuring safe and timely delivery of goods to various destinations."
          }
        />

        <div className="grid lg:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((item, i) => {
            return <DirectionsCard key={i} />;
          })}
        </div>
      </div>
    </section>
  );
}

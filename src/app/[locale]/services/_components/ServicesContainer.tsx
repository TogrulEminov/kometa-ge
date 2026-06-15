import SectionContentComponent from "@/components/SectionContent";
import ServiceCard from "@/globalElement/cards/ServicesCard";


export default function ServicesContainer() {
  return (
    <section className="lg:py-20 py-10">
      <div className="container space-y-10">
        <SectionContentComponent
          highlightWord={"Logistics Services"}
          rootClass="max-w-full [&_article]:max-w-full"
          title="International Cargo Transportation & Logistics Services"
          description="Kometa GE provides professional international logistics and cargo transportation solutions. We organize the delivery of goods across different countries via road, sea, air, and rail transport. Every shipment is carefully planned to ensure safe, reliable, and timely delivery to its destination.

Our company offers comprehensive logistics solutions for groupage cargo, oversized shipments, and transport requiring special handling equipment. With an experienced team, we manage route planning, documentation, and full coordination of the transportation process, delivering efficient and dependable service to our clients."
          type="vertical"
          heading="h2"
        />
        <div className="grid lg:grid-cols-3 gap-5 sm:grid-cols-2 grid-cols-1">
          {Array.from({ length: 12 }).map((_, index) => {
            return <ServiceCard key={index} />;
          })}
        </div>
      </div>
    </section>
  );
}

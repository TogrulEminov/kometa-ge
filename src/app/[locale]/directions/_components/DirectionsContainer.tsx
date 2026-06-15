import SectionContentComponent from "@/components/SectionContent";
import DirectionsCard from "@/globalElement/cards/DirectionsCard";

export default function DirectionsContainer() {
  return (
    <section className="lg:py-20 py-10">
      <div className="container space-y-10">
        <SectionContentComponent
          highlightWord={"Global Network"}
          rootClass="max-w-full [&_article]:max-w-full"
          title="Transportation Directions & Coverage"
          description="Kometa GE operates across a wide range of international routes, connecting businesses with key markets throughout Europe, Asia, and neighboring regions. Through our extensive transportation network, we ensure seamless cargo movement regardless of destination.

          Whether transporting goods to nearby countries or managing long-distance international shipments, our team selects the most efficient routes and transportation methods to optimize delivery times and costs. We are committed to providing flexible, secure, and reliable logistics solutions tailored to the unique requirements of every client."
          type="vertical"
          heading="h2"
        />
        <div className="grid lg:grid-cols-3 gap-5 sm:grid-cols-2 grid-cols-1">
          {Array.from({ length: 12 }).map((_, index) => {
            return <DirectionsCard key={index} />;
          })}
        </div>
      </div>
    </section>
  );
}

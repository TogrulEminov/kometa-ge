import InnerBanner from "@/components/InnerBanner";
import DirectionsContainer from "./_components/DirectionsContainer";

export default function DirectionsPage() {
  return (
    <>
      <InnerBanner
        title="Directions"
        subtitle="Your trusted partner in global logistics and freight transportation"
        breadcrumbs={[{ label: "Directions" }]}
        variant="dark"
      />
      <DirectionsContainer />
    </>
  );
}

import InnerBanner from "@/components/InnerBanner";
import DirectionsDetailContainer from "../_components/DirectionsDetailContainer";

export default function DirectionsDetailPage() {
  return (
    <>
      <InnerBanner
        title="Directions Detail"
        subtitle="Your trusted partner in global logistics and freight transportation"
        breadcrumbs={[
          { label: "Directions", href: "/directions" },
          { label: "Directions Detail" },
        ]}
        variant="dark"
      />
      <DirectionsDetailContainer />
    </>
  );
}

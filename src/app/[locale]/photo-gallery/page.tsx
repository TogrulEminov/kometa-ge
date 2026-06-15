import InnerBanner from "@/components/InnerBanner";
import ServicesContainer from "./_components/PhotoGalleryContainer";

export default function page() {
  return (
    <>
      <InnerBanner
        title="Photo Gallery"
        subtitle="Explore moments from our logistics operations, transportation projects, and fleet in action"
        breadcrumbs={[{ label: "Photo Gallery" }]}
        variant="dark"
      />
      <ServicesContainer />
    </>
  );
}

import InnerBanner from "@/components/InnerBanner";
import ServicesContainer from "./_components/ServicesContainer";

export default function page() {
  return (
    <>
      <InnerBanner
        title="Services"
        subtitle="Your trusted partner in global logistics and freight transportation"
        breadcrumbs={[{ label: "Services" }]}
        variant="dark"
      />
      <ServicesContainer />
    </>
  );
}

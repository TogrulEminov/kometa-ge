import InnerBanner from "@/components/InnerBanner";
import ServicesCategoryDetail from "../_components/detail/ServicesCategoryDetail";

export default function ServicesCategory() {
  return (
    <>
      <InnerBanner
        title="Services Category"
        subtitle="Your trusted partner in global logistics and freight transportation"
        breadcrumbs={[
          { label: "Services", href: "/services" },
          { label: "Services Category" },
        ]}
        variant="dark"
      />
      <ServicesCategoryDetail />
    </>
  );
}

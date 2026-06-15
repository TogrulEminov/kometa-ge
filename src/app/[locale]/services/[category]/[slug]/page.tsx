import InnerBanner from "@/components/InnerBanner";
import FTL_LTL_Page from "../../_components/detail/ServicesSlugDetail";

export default function ServicesPage() {
  return (
    <>
      <InnerBanner
        title="Services Slug detail"
        subtitle="Your trusted partner in global logistics and freight transportation"
        breadcrumbs={[
          { label: "Services", href: "/services" },
          { label: "Services Category" },
        ]}
        variant="dark"
      />
      <FTL_LTL_Page />
    </>
  );
}

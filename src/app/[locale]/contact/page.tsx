import "leaflet/dist/leaflet.css";
import InnerBanner from "@/components/InnerBanner";
import ContactSection from "./_components/ContactSection";

export default function ContactPage() {
  return (
    <>
      <InnerBanner
        title="Contact Us"
        subtitle="Your trusted partner in global logistics and freight transportation"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
        variant="dark"
      />
      <ContactSection />
    </>
  );
}

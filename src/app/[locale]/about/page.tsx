import HeroSection from "./_components/HeroSection";
import StickySidebar from "./_components/StickySidebar";
import AboutContent from "./_components/AboutContent";
import GeographyGrid from "./_components/GeographyGrid";
import BranchCards from "./_components/BranchCards";
import FAQSection from "./_components/FAQSection";
import ServicesList from "./_components/ServicesList";
import CTASection from "../(home)/_components/CtaSection";
import InnerBanner from "@/components/InnerBanner";

export default function AboutPage() {
  return (
    <>
      <InnerBanner
        title="About Us"
        subtitle="Your trusted partner in global logistics and freight transportation"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
        variant="image"
      />
      <HeroSection />

      {/* Main Content with Sidebar */}
      <section className="py-10 lg:py-20 lg:border-b-transparent border-b border-b-tertiary">
        <div className="container">
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4 order-2 lg:order-1">
              <StickySidebar />
            </div>
            <div className="lg:col-span-8 space-y-20 lg:order-2 order-1">
              <AboutContent />
              <GeographyGrid />
              <BranchCards />
              <FAQSection />
              <ServicesList />
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}

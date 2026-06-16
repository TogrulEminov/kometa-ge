import SectionContentComponent from "@/components/SectionContent";
import CertificateCardV5 from "@/globalElement/cards/CertificatesCard";
import ReactFancyBox from "@/lib/fancybox";

export default function CertificatesContainer() {
  return (
    <section className="lg:py-20 py-10">
      <div className="container space-y-10">
        <SectionContentComponent
          highlightWord={"Certificates"}
          rootClass="max-w-full [&_article]:max-w-full"
          title="Certificates"
          description="Discover the certificates and official recognitions that demonstrate Kometa GE's dedication to excellence, compliance, and professional service standards."
          type="vertical"
          heading="h2"
        />
        <ReactFancyBox className="grid lg:grid-cols-3 gap-5 sm:grid-cols-2 grid-cols-1">
          {Array.from({ length: 12 }).map((_, index) => {
            return <CertificateCardV5 key={index} />;
          })}
        </ReactFancyBox>
      </div>
    </section>
  );
}

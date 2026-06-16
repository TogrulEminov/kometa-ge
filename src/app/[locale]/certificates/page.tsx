import InnerBanner from "@/components/InnerBanner";
import CertificatesContainer from "./_components/CertificatesContainer";

export default function CertificatesPage() {
  return (
    <>
      <InnerBanner
        title="Certificates"
        subtitle="Explore our certifications and recognitions that reflect our commitment to quality, reliability, and international standards."
        breadcrumbs={[{ label: "Certificates" }]}
        variant="dark"
      />
      <CertificatesContainer />
    </>
  );
}

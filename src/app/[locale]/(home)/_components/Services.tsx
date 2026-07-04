import {
  fetchSectionByKeys,
  fetchServices,
} from "@/actions/ui/main.controller";
import SectionContentComponent from "@/components/SectionContent";
import { CustomLocales, ServicesType } from "@/services/interface/type";
import ServicesSlider from "./atoms/ServicesSlider";
import ServicesSliderFallback from "./fallbacks/ServicesSliderFallback";
import { Suspense } from "react";

export default async function HomeServicesSection({
  locale,
}: {
  locale: CustomLocales;
}) {
  const services = await fetchServices({ pageNumber: 1, locale });
  const sectionInfo = await fetchSectionByKeys({ key: "services", locale });
  const sectionTr = sectionInfo?.translations?.[0];
  if (!services?.data?.length || !sectionInfo?.translations?.length)
    return null;
  return (
    <section className="py-10 lg:py-20">
      <div className="container">
        <SectionContentComponent
          title={sectionTr?.title ?? ""}
          type="vertical"
          rootClass="[&_article]:max-w-4xl!"
          subTitle={sectionTr?.subTitle}
          description={sectionTr?.description ?? ""}
        />

        <Suspense fallback={<ServicesSliderFallback />}>
          <ServicesSlider
            data={services?.data as unknown as ServicesType[]}
          />
        </Suspense>
      </div>
    </section>
  );
}

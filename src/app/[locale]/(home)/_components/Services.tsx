import {
  fetchSectionByKeys,
  fetchServices,
} from "@/actions/ui/main.controller";
import SectionContentComponent from "@/components/SectionContent";
import ServiceCard from "@/globalElement/cards/ServicesCard";
import { CustomLocales, ServicesType } from "@/services/interface/type";

export default async function HomeServicesSection({
  locale,
}: {
  locale: CustomLocales;
}) {
  const services = await fetchServices({ pageNumber: 1, locale });
  const sectionInfo = await fetchSectionByKeys({ key: "services", locale });
  const sectionTr = sectionInfo?.translations?.[0];
  if (!services || !sectionInfo?.translations?.length) return null;
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

        <div className="grid lg:grid-cols-3 gap-5">
          {services?.data?.map((item, i) => {
            return <ServiceCard key={i}  item={item as ServicesType}/>;
          })}
        </div>
      </div>
    </section>
  );
}

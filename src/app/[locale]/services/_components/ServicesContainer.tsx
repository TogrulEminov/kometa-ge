import NoDataComponent from "@/components/NoData";
import PaginationContainer from "@/components/Pagination";
import SectionContentComponent from "@/components/SectionContent";
import ServiceCard from "@/globalElement/cards/ServicesCard";
import {
  newInfoJson,
  PaginationItem,
  ServicesType,
} from "@/services/interface/type";

interface Props {
  services: ServicesType[];
  sectionContent: newInfoJson | undefined;
  paginations: PaginationItem;
}
export default function ServicesContainer({
  services,
  sectionContent,
  paginations,
}: Props) {
  return (
    <section className="lg:py-20 py-10">
      <div className="container space-y-10">
        <SectionContentComponent
          highlightWord={
            sectionContent?.highlightWord as string | null | undefined
          }
          rootClass="max-w-full [&_article]:max-w-full"
          title={sectionContent?.title ?? ""}
          description={sectionContent?.description ?? ""}
          type="vertical"
          heading="h2"
        />
        <div className="grid lg:grid-cols-3 gap-5 sm:grid-cols-2 grid-cols-1">
          {services?.length > 0 ? (
            services.map((item, index) => {
              return <ServiceCard key={index} item={item as ServicesType} />;
            })
          ) : (
            <NoDataComponent className="col-span-12" />
          )}
            <PaginationContainer paginations={paginations} className="col-span-12" />
        </div>
      </div>
    </section>
  );
}

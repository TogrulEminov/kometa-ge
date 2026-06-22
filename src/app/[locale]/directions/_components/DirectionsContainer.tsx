import NoDataComponent from "@/components/NoData";
import PaginationContainer from "@/components/Pagination";
import SectionContentComponent from "@/components/SectionContent";
import DirectionsCard from "@/globalElement/cards/DirectionsCard";
import {
  DirectionsType,
  newInfoJson,
  PaginationItem,
} from "@/services/interface/type";

interface Props {
  data: DirectionsType[];
  sectionContent: newInfoJson | undefined;
  paginations: PaginationItem;
}
export default function DirectionsContainer({
  data,
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
          heading="h1"
        />
        <div className="grid lg:grid-cols-3 gap-5 sm:grid-cols-2 grid-cols-1">
          {data?.length > 0 ? (
            data?.map((item, index) => {
              return <DirectionsCard key={index} item={item} heading="h3" />;
            })
          ) : (
            <NoDataComponent className="col-span-12" />
          )}
          <PaginationContainer
            paginations={paginations}
            className="col-span-12"
          />
        </div>
      </div>
    </section>
  );
}

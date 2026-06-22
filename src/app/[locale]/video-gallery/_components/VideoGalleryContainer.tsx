import NoDataComponent from "@/components/NoData";
import PaginationContainer from "@/components/Pagination";
import SectionContentComponent from "@/components/SectionContent";
import VideoCard from "@/globalElement/cards/VideoGallery";
import {
  newInfoJson,
  PaginationItem,
  YoutubeItems,
} from "@/services/interface/type";
interface Props {
  data: YoutubeItems[];
  sectionContent: newInfoJson;
  paginations: PaginationItem;
}
export default function VideoGalleryContainer({
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
              return <VideoCard key={index} item={item as YoutubeItems} />;
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

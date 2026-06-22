import NoDataComponent from "@/components/NoData";
import PaginationContainer from "@/components/Pagination";
import SectionContentComponent from "@/components/SectionContent";
import GalleryCardV2EB from "@/globalElement/cards/PhotoGallery";
import ReactFancyBox from "@/lib/fancybox";
import {
  newInfoJson,
  PaginationItem,
  PhotoGalleryType,
} from "@/services/interface/type";
interface Props {
  data: PhotoGalleryType[];
  sectionContent: newInfoJson;
  paginations: PaginationItem;
}
export default function PhotoGalleryContainer({
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
        <ReactFancyBox className="grid lg:grid-cols-3 gap-5 sm:grid-cols-2 grid-cols-1">
          {data?.length > 0 ? (
            data?.map((item, index) => {
              return (
                <GalleryCardV2EB key={index} item={item as PhotoGalleryType} />
              );
            })
          ) : (
            <NoDataComponent className="col-span-12" />
          )}
          <PaginationContainer
            paginations={paginations}
            className="col-span-12"
          />
        </ReactFancyBox>
      </div>
    </section>
  );
}

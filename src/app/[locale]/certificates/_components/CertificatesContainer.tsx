import NoDataComponent from "@/components/NoData";
import PaginationContainer from "@/components/Pagination";
import SectionContentComponent from "@/components/SectionContent";
import CertificateCardV5 from "@/globalElement/cards/CertificatesCard";
import ReactFancyBox from "@/lib/fancybox";
import {
  CertificatesType,
  newInfoJson,
  PaginationItem,
} from "@/services/interface/type";

interface Props {
  data: CertificatesType[];
  sectionContent: newInfoJson | undefined;
  paginations: PaginationItem;
}
export default function CertificatesContainer({
  data,
  sectionContent,
  paginations,
}: Props) {
  return (
    <section className="bg-background lg:py-20 py-10">
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
        <ReactFancyBox className="grid lg:grid-cols-3 gap-5 sm:grid-cols-2 grid-cols-1">
          {data?.length > 0 ? (
            data?.map((item, index) => {
              return (
                <CertificateCardV5
                  key={index}
                  item={item as unknown as CertificatesType}
                />
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

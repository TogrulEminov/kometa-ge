import SectionContentComponent from "@/components/SectionContent";
import ReactFancyBox from "@/lib/fancybox";
import GalleryCardV2EB from "@/globalElement/cards/PhotoGallery";
import {
  CustomLocales,
  PhotoGalleryType,
  SectionLocale,
} from "@/services/interface/type";
import {
  fetchPhotoGallery,
  fetchSectionByKeys,
} from "@/actions/ui/main.controller";

export default async function MediaSection({ locale }: SectionLocale) {
  const media = await fetchPhotoGallery({
    pageNumber: 1,
    locale: locale as CustomLocales,
  });
  const mediaData = media.data;
  const sectionContent = await fetchSectionByKeys({
    key: "media",
    locale: locale as CustomLocales,
  });
  const sectionContentTr = sectionContent?.translations?.[0];
  if (!mediaData?.length || !sectionContentTr) return null;
  return (
    <section className="w-full pb-10  pt-10 lg:pt-20 border-t border-t-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <SectionContentComponent
          title={sectionContentTr?.title ?? ""}
          description={sectionContentTr?.description ?? ""}
          subTitle={sectionContentTr?.subTitle ?? ""}
          type="vertical"
          rootClass="[&_article]:max-w-4xl!"
        />
        <ReactFancyBox className="grid gap-5 grid-cols-3">
          {mediaData?.map((item) => {
            return (
              <GalleryCardV2EB key={item.id} item={item as PhotoGalleryType} />
            );
          })}
        </ReactFancyBox>
      </div>
    </section>
  );
}

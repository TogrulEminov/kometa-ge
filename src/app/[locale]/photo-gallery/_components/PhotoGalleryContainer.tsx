import SectionContentComponent from "@/components/SectionContent";
import GalleryCardV2EB from "@/globalElement/cards/PhotoGallery";
export default function PhotoGalleryContainer() {
  return (
    <section className="lg:py-20 py-10">
      <div className="container space-y-10">
        <SectionContentComponent
          highlightWord={"Photo Gallery"}
          rootClass="max-w-full [&_article]:max-w-full"
          title="Moments from Our Logistics Journey"
          description="Discover highlights from our operations, transportation projects, and the dedicated team behind Kometa GE."
          type="vertical"
          heading="h2"
        />
        <div className="grid lg:grid-cols-3 gap-5 sm:grid-cols-2 grid-cols-1">
          {Array.from({ length: 12 }).map((_, index) => {
            return <GalleryCardV2EB key={index} />;
          })}
        </div>
      </div>
    </section>
  );
}

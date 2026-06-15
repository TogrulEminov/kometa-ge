import SectionContentComponent from "@/components/SectionContent";
import VideoCard from "@/globalElement/cards/VideoGallery";

export default function VideoGalleryContainer() {
  return (
    <section className="lg:py-20 py-10">
      <div className="container space-y-10">
        <SectionContentComponent
          highlightWord={"Video Gallery"}
          rootClass="max-w-full [&_article]:max-w-full"
          title="Video Gallery"
          description="Watch Kometa GE in action through our logistics operations, transportation projects, and fleet activities."
          type="vertical"
          heading="h2"
        />
        <div className="grid lg:grid-cols-3 gap-5 sm:grid-cols-2 grid-cols-1">
          {Array.from({ length: 12 }).map((_, index) => {
            return <VideoCard key={index} />;
          })}
        </div>
      </div>
    </section>
  );
}

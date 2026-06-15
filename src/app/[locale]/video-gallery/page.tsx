import InnerBanner from "@/components/InnerBanner";
import VideoGalleryContainer from "./_components/VideoGalleryContainer";

export default function VideoGalleryPage() {
  return (
    <>
      <InnerBanner
        title="Video Gallery"
        subtitle="Watch our logistics operations, fleet, and transportation projects in action"
        breadcrumbs={[{ label: "Video Gallery" }]}
        variant="dark"
      />
      <VideoGalleryContainer />
    </>
  );
}

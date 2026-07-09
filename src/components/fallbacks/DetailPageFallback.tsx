import DetailContentSkeleton from "./skeletons/DetailContentSkeleton";
import StickySidebarSkeleton from "./skeletons/StickySidebarSkeleton";

export default function DetailPageFallback() {
  return (
    <div className="bg-background py-10 lg:py-20" aria-hidden>
      <div className="container">
        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="order-2 shrink-0 lg:order-1 lg:w-[30%]">
            <div className="lg:sticky lg:top-25">
              <StickySidebarSkeleton />
            </div>
          </aside>
          <div className="order-1 min-w-0 lg:order-2 lg:w-[70%]">
            <DetailContentSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}

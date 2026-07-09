import SectionContentSkeleton from "./skeletons/SectionContentSkeleton";
import DirectionsCardSkeleton from "./skeletons/DirectionsCardSkeleton";

type Props = {
  count?: number;
};

export default function DirectionsGridFallback({ count = 6 }: Props) {
  return (
    <section className="bg-background py-10 lg:py-20" aria-hidden>
      <div className="container space-y-10">
        <SectionContentSkeleton />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: count }).map((_, index) => (
            <DirectionsCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

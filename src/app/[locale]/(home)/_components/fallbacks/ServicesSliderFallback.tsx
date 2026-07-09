import ServicesCardSkeleton from "@/components/fallbacks/skeletons/ServicesCardSkeleton";

export default function ServicesSliderFallback() {
  return (
    <div
      className="flex snap-x snap-mandatory gap-6 overflow-x-auto overflow-y-hidden scrollbar-none"
      aria-hidden
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="h-full shrink-0 grow-0 basis-full snap-start md:basis-[calc(50%-0.75rem)] lg:basis-[calc(33.333%-1rem)]"
        >
          <ServicesCardSkeleton />
        </div>
      ))}
    </div>
  );
}

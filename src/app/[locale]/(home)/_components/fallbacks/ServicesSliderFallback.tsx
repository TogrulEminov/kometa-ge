function ServicesCardSkeleton() {
  return (
    <div className="surface-card animate-pulse overflow-hidden rounded-none">
      <div className="relative aspect-4/3 overflow-hidden bg-surface-elevated" />

      <div className="relative z-10 mx-auto -mt-10 size-24 rounded-lg border-2 border-white/10 bg-surface" />

      <div className="relative overflow-hidden px-6 pb-8 pt-4 text-center">
        <div className="mx-auto mb-4 h-6 w-3/4 rounded-md bg-surface-elevated" />
        <div className="mx-auto h-14 space-y-2">
          <div className="h-3 w-full rounded bg-surface-elevated" />
          <div className="mx-auto h-3 w-5/6 rounded bg-surface-elevated" />
        </div>
      </div>
    </div>
  );
}

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

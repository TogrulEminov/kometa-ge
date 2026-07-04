function DirectionsCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="relative mx-4">
        <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-surface-elevated" />
        <div className="absolute -bottom-5 left-4 size-12 rounded-full bg-surface-elevated" />
      </div>

      <div className="mt-6 rounded-xl border border-white/10 bg-surface px-5 pb-5 pt-6">
        <div className="mb-2 h-5 min-h-12 w-3/4 rounded-md bg-surface-elevated" />
        <div className="mb-2 h-3 w-full rounded bg-surface-elevated" />
        <div className="mb-4 h-3 w-2/3 rounded bg-surface-elevated" />
        <div className="h-3 w-20 rounded bg-surface-elevated" />
      </div>
    </div>
  );
}

export default function DirectionsSliderFallback() {
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
          <DirectionsCardSkeleton />
        </div>
      ))}
    </div>
  );
}

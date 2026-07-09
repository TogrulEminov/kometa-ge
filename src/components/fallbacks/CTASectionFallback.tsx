import SectionContentSkeleton from "./skeletons/SectionContentSkeleton";

export default function CTASectionFallback() {
  return (
    <section className="relative w-full overflow-hidden bg-background py-10 lg:py-20" aria-hidden>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 animate-pulse">
        <SectionContentSkeleton />

        <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-surface p-6 space-y-4"
              >
                <div className="size-11 rounded-xl bg-primary/10" />
                <div className="space-y-2">
                  <div className="h-2.5 w-16 rounded bg-surface-elevated" />
                  <div className="h-4 w-full rounded bg-surface-elevated" />
                </div>
              </div>
            ))}
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-secondary p-8 sm:p-10 space-y-4">
            <div className="size-14 rounded-2xl bg-primary/30" />
            <div className="h-7 w-2/3 rounded-md bg-white/10" />
            <div className="h-3 w-full rounded bg-white/10" />
            <div className="h-11 w-full rounded-xl bg-white/10" />
          </div>
        </div>
      </div>
    </section>
  );
}

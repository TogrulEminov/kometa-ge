import SectionContentSkeleton from "./skeletons/SectionContentSkeleton";

export default function ContactSectionFallback() {
  return (
    <div className="min-h-screen bg-background py-20" aria-hidden>
      <div className="container animate-pulse space-y-10">
        <SectionContentSkeleton />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="surface-card rounded-2xl p-5 space-y-3">
              <div className="size-10 rounded-lg bg-surface-elevated" />
              <div className="h-3 w-16 rounded bg-surface-elevated" />
              <div className="h-4 w-full rounded bg-surface-elevated" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="surface-card rounded-3xl p-8 lg:p-10 space-y-4">
            <div className="h-7 w-48 rounded-md bg-surface-elevated" />
            <div className="h-3 w-full rounded bg-surface-elevated" />
            <div className="space-y-3 pt-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-11 w-full rounded-xl bg-surface-elevated" />
              ))}
              <div className="h-28 w-full rounded-xl bg-surface-elevated" />
              <div className="h-11 w-full rounded-xl bg-primary/20" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="surface-card rounded-3xl p-3">
              <div className="h-80 rounded-2xl bg-surface-elevated" />
              <div className="space-y-2 p-5">
                <div className="h-4 w-3/4 rounded bg-surface-elevated" />
                <div className="h-3 w-full rounded bg-surface-elevated" />
              </div>
            </div>
            <div className="bg-secondary rounded-2xl p-6 space-y-3">
              <div className="h-4 w-32 rounded bg-white/10" />
              <div className="flex gap-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="size-10 rounded-full bg-white/10" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

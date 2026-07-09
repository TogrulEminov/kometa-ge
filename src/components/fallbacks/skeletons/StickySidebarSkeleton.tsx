export default function StickySidebarSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" aria-hidden>
      <div className="bg-secondary rounded-2xl p-6 shadow-xl space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-5 bg-primary/40 rounded-full" />
          <div className="h-5 w-32 rounded bg-white/10" />
        </div>
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-11 w-full rounded-xl bg-white/10"
          />
        ))}
      </div>
      <div className="bg-linear-to-br from-primary to-[#8a0d1e] rounded-2xl p-6 shadow-xl space-y-3">
        <div className="h-5 w-40 rounded bg-white/20" />
        <div className="h-3 w-full rounded bg-white/10" />
        <div className="h-11 w-full rounded-xl bg-white/20" />
      </div>
      <div className="surface-card p-6 space-y-3">
        <div className="h-5 w-28 rounded bg-surface-elevated" />
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-surface-elevated" />
            <div className="h-3 flex-1 rounded bg-surface-elevated" />
          </div>
        ))}
      </div>
    </div>
  );
}

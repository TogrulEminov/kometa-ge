export default function DetailContentSkeleton() {
  return (
    <div className="space-y-10 animate-pulse" aria-hidden>
      <div className="space-y-4">
        <div className="aspect-video w-full rounded-2xl bg-surface-elevated" />
        <div className="h-8 w-2/3 rounded-md bg-surface-elevated" />
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-surface-elevated" />
          <div className="h-3 w-full rounded bg-surface-elevated" />
          <div className="h-3 w-4/5 rounded bg-surface-elevated" />
        </div>
      </div>
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="space-y-4">
          <div className="h-6 w-48 rounded-md bg-surface-elevated" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="h-32 rounded-xl bg-surface-elevated" />
            <div className="h-32 rounded-xl bg-surface-elevated" />
          </div>
        </div>
      ))}
    </div>
  );
}

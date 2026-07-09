export default function ServicesCardSkeleton() {
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

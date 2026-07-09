export default function SectionContentSkeleton() {
  return (
    <div className="animate-pulse space-y-4" aria-hidden>
      <div className="h-4 w-24 rounded bg-surface-elevated" />
      <div className="h-9 w-2/3 max-w-md rounded-md bg-surface-elevated" />
      <div className="space-y-2">
        <div className="h-3 w-full max-w-2xl rounded bg-surface-elevated" />
        <div className="h-3 w-5/6 max-w-xl rounded bg-surface-elevated" />
      </div>
    </div>
  );
}

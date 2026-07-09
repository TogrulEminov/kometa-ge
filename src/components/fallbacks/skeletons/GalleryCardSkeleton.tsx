export default function GalleryCardSkeleton() {
  return (
    <div className="surface-card animate-pulse overflow-hidden">
      <div className="aspect-4/3 bg-surface-elevated" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-3/4 rounded bg-surface-elevated" />
        <div className="h-3 w-1/2 rounded bg-surface-elevated" />
      </div>
    </div>
  );
}

export default function ProductSkeleton() {
  return (
    <div className="card">
      <div className="aspect-[3/4] skeleton shimmer" />
      <div className="p-3 space-y-2">
        <div className="h-4 skeleton w-3/4" />
        <div className="h-3 skeleton w-1/3" />
        <div className="h-4 skeleton w-1/2" />
        <div className="flex gap-1">
          <div className="w-4 h-4 rounded-full skeleton" />
          <div className="w-4 h-4 rounded-full skeleton" />
          <div className="w-4 h-4 rounded-full skeleton" />
        </div>
      </div>
    </div>
  );
}

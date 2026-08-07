export default function Loading() {
  return (
    <div className="container-main py-10">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="card">
            <div className="aspect-[3/4] skeleton skeleton-shimmer" />
            <div className="p-3 space-y-2">
              <div className="h-4 skeleton w-3/4" />
              <div className="h-3 skeleton w-1/3" />
              <div className="h-4 skeleton w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

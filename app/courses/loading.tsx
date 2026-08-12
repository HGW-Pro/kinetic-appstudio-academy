export default function CoursesLoading() {
  return (
    <div className="space-y-8" aria-busy="true" aria-live="polite">
      <div className="space-y-2">
        <div className="h-4 w-24 animate-pulse rounded-full bg-gray-200" />
        <div className="h-8 w-64 animate-pulse rounded-md bg-gray-200" />
        <div className="h-4 w-full max-w-md animate-pulse rounded-md bg-gray-200" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass-card space-y-4 rounded-xl p-5">
            <div className="h-36 w-full animate-pulse rounded-lg bg-gray-200" />
            <div className="space-y-2">
              <div className="h-5 w-3/4 animate-pulse rounded-md bg-gray-200" />
              <div className="h-3.5 w-full animate-pulse rounded-md bg-gray-200" />
              <div className="h-3.5 w-5/6 animate-pulse rounded-md bg-gray-200" />
            </div>
            <div className="flex gap-3 pt-1">
              <div className="h-5 w-16 animate-pulse rounded-full bg-gray-200" />
              <div className="h-5 w-16 animate-pulse rounded-full bg-gray-200" />
              <div className="h-5 w-16 animate-pulse rounded-full bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

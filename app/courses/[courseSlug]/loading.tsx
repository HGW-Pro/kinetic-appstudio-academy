export default function CourseDetailLoading() {
  return (
    <div className="space-y-8" aria-busy="true" aria-live="polite">
      <div className="glass-card glow-border rounded-2xl p-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
          <div className="space-y-2">
            <div className="h-3 w-40 animate-pulse rounded-md bg-gray-200" />
            <div className="h-7 w-72 animate-pulse rounded-md bg-gray-200" />
          </div>
        </div>
        <div className="mt-4 h-4 w-full max-w-xl animate-pulse rounded-md bg-gray-200" />
        <div className="mt-1 h-3 w-80 max-w-full animate-pulse rounded-md bg-gray-200" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 shrink-0 animate-pulse rounded-lg bg-gray-200" />
              <div className="space-y-2">
                <div className="h-3 w-36 animate-pulse rounded-md bg-gray-200" />
                <div className="h-5 w-52 animate-pulse rounded-md bg-gray-200" />
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-4 pl-16 sm:pl-0">
              <div className="h-8 w-10 animate-pulse rounded-md bg-gray-200" />
              <div className="h-8 w-10 animate-pulse rounded-md bg-gray-200" />
              <div className="h-8 w-10 animate-pulse rounded-md bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

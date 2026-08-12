export default function SubtopicLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <div className="space-y-2">
        <div className="h-3 w-48 animate-pulse rounded-md bg-gray-200" />
        <div className="h-2 w-full animate-pulse rounded-full bg-gray-200" />
      </div>

      <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="h-3 w-28 animate-pulse rounded-md bg-gray-200" />
        <div className="h-8 w-2/3 animate-pulse rounded-md bg-gray-200" />

        <div className="space-y-3 pt-4">
          <div className="h-4 w-full animate-pulse rounded-md bg-gray-200" />
          <div className="h-4 w-full animate-pulse rounded-md bg-gray-200" />
          <div className="h-4 w-5/6 animate-pulse rounded-md bg-gray-200" />
          <div className="h-40 w-full animate-pulse rounded-lg bg-gray-200" />
          <div className="h-4 w-full animate-pulse rounded-md bg-gray-200" />
          <div className="h-4 w-3/4 animate-pulse rounded-md bg-gray-200" />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="h-9 w-24 animate-pulse rounded-md bg-gray-200" />
        <div className="h-9 w-32 animate-pulse rounded-md bg-gray-200" />
      </div>
    </div>
  );
}

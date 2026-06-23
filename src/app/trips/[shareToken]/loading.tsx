export default function Loading() {
  return (
    <main className="page-shell">
      <div className="card overflow-hidden">
        <div className="skeleton h-32 rounded-none" />
        <div className="space-y-3 p-4">
          <div className="skeleton h-7 w-3/4" />
          <div className="skeleton h-7 w-44" />
          <div className="skeleton h-16 w-full" />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-1 rounded-lg border border-line bg-white/60 p-1">
        <div className="skeleton h-9" />
        <div className="skeleton h-9" />
        <div className="skeleton h-9" />
      </div>
      <div className="mt-4 flex gap-2 overflow-hidden">
        <div className="skeleton h-10 w-32 shrink-0" />
        <div className="skeleton h-10 w-32 shrink-0" />
        <div className="skeleton h-10 w-32 shrink-0" />
      </div>
      <div className="mt-4 space-y-3">
        <div className="skeleton h-32 w-full" />
        <div className="skeleton h-32 w-full" />
        <div className="skeleton h-32 w-full" />
      </div>
    </main>
  );
}

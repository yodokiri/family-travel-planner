export default function Loading() {
  return (
    <main className="page-shell">
      <div className="app-topline">
        <div>
          <div className="skeleton h-3 w-24" />
          <div className="skeleton mt-2 h-8 w-36" />
        </div>
        <div className="skeleton h-10 w-28" />
      </div>
      <div className="mt-5 space-y-3">
        <div className="skeleton h-28 w-full" />
        <div className="skeleton h-28 w-full" />
        <div className="skeleton h-28 w-full" />
      </div>
    </main>
  );
}

import Link from "next/link";

const TABS = [
  { key: "schedule", label: "予定" },
  { key: "images", label: "画像" },
  { key: "checklist", label: "チェックリスト" },
] as const;

export function TripTabs({
  shareToken,
  active,
}: {
  shareToken: string;
  active: string;
}) {
  return (
    <nav className="mt-4 grid grid-cols-3 gap-1 rounded-lg border border-line bg-white/60 p-1 shadow-sm">
      {TABS.map((t) => (
        <Link
          key={t.key}
          href={`/trips/${shareToken}?tab=${t.key}`}
          scroll={false}
          className={
            active === t.key
              ? "whitespace-nowrap rounded-md bg-surface px-1 py-2 text-center text-xs font-semibold text-lagoon shadow-sm sm:px-2 sm:text-sm"
              : "whitespace-nowrap rounded-md px-1 py-2 text-center text-xs font-semibold text-muted hover:bg-surface-soft hover:text-ink sm:px-2 sm:text-sm"
          }
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}

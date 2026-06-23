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
    <nav className="mt-4 flex border-b border-line">
      {TABS.map((t) => (
        <Link
          key={t.key}
          href={`/trips/${shareToken}?tab=${t.key}`}
          scroll={false}
          className={
            active === t.key
              ? "flex-1 border-b-2 border-accent py-2 text-center text-sm font-semibold text-accent"
              : "flex-1 py-2 text-center text-sm text-muted"
          }
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}

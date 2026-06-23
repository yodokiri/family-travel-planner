import Link from "next/link";
import { formatDateLabel } from "@/lib/format";

export function DayTabs({
  shareToken,
  dates,
  activeDay,
}: {
  shareToken: string;
  dates: string[];
  activeDay: string;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto py-1">
      {dates.map((d, i) => (
        <Link
          key={d}
          href={`/trips/${shareToken}?tab=schedule&day=${d}`}
          scroll={false}
          className={
            d === activeDay
              ? "shrink-0 rounded-full bg-accent px-3 py-1 text-sm text-on-accent"
              : "shrink-0 rounded-full border border-line bg-surface px-3 py-1 text-sm text-muted"
          }
        >
          Day {i + 1}｜{formatDateLabel(d)}
        </Link>
      ))}
    </div>
  );
}

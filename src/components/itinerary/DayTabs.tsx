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
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 py-1">
      {dates.map((d, i) => (
        <Link
          key={d}
          href={`/trips/${shareToken}?tab=schedule&day=${d}`}
          scroll={false}
          className={
            d === activeDay
              ? "shrink-0 rounded-lg bg-lagoon px-3 py-2 text-sm font-semibold text-on-accent shadow-sm"
              : "shrink-0 rounded-lg border border-line bg-surface px-3 py-2 text-sm font-semibold text-muted shadow-sm hover:border-lagoon hover:bg-lagoon-soft hover:text-lagoon"
          }
        >
          Day {i + 1}｜{formatDateLabel(d)}
        </Link>
      ))}
    </div>
  );
}

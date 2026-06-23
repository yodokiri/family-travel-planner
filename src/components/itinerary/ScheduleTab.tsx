import Link from "next/link";
import type { Trip } from "@/lib/types";
import { enumerateDates } from "@/lib/format";
import { listItemsByDate } from "@/lib/items";
import { countImagesByItem } from "@/lib/attachments";
import { DayTabs } from "./DayTabs";
import { ItineraryCard } from "./ItineraryCard";

export async function ScheduleTab({
  trip,
  day,
}: {
  trip: Trip;
  day?: string;
}) {
  const dates = enumerateDates(trip.start_date, trip.end_date);
  const activeDay = day && dates.includes(day) ? day : dates[0];
  const items = await listItemsByDate(trip.id, activeDay);
  const imageCounts = await countImagesByItem(trip.id);

  return (
    <div>
      <DayTabs shareToken={trip.share_token} dates={dates} activeDay={activeDay} />

      <div className="mt-3 flex justify-end">
        <Link
          href={`/trips/${trip.share_token}/items/new?day=${activeDay}`}
          className="btn btn-primary"
        >
          ＋ 予定を追加
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="mt-6 text-center text-sm text-muted">
          この日の予定はまだありません。
        </p>
      ) : (
        <ul className="mt-3 space-y-3">
          {items.map((it, i) => (
            <ItineraryCard
              key={it.id}
              item={it}
              shareToken={trip.share_token}
              imageCount={imageCounts[it.id] ?? 0}
              canMoveUp={i > 0}
              canMoveDown={i < items.length - 1}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

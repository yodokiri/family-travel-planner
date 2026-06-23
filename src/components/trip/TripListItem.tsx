import Link from "next/link";
import type { Trip } from "@/lib/types";
import { formatDateRange } from "@/lib/format";
import { ShareUrl } from "@/components/trip/ShareUrl";

export function TripListItem({ trip }: { trip: Trip }) {
  return (
    <li className="card p-4">
      <Link href={`/trips/${trip.share_token}`} className="block">
        <span className="text-lg font-semibold">{trip.title}</span>
        {trip.destination ? (
          <span className="ml-2 text-sm text-muted">{trip.destination}</span>
        ) : null}
        <span className="mt-1 block text-sm">
          {formatDateRange(trip.start_date, trip.end_date)}
        </span>
        <span className="mt-1 block text-xs text-muted">
          更新: {trip.updated_at.slice(0, 10)}
        </span>
      </Link>
      <div className="mt-2">
        <ShareUrl shareToken={trip.share_token} />
      </div>
    </li>
  );
}

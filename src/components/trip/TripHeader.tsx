import Link from "next/link";
import type { Trip } from "@/lib/types";
import { formatDateRange } from "@/lib/format";
import { ShareUrl } from "@/components/trip/ShareUrl";
import { DeleteTripButton } from "@/components/trip/DeleteTripButton";

export function TripHeader({
  trip,
  coverUrl,
}: {
  trip: Trip;
  coverUrl?: string | null;
}) {
  return (
    <header className="card overflow-hidden">
      {coverUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={coverUrl}
          alt={trip.title}
          className="h-44 w-full object-cover"
        />
      ) : null}
      <div className="p-4">
        <h1 className="text-xl font-bold">{trip.title}</h1>
        {trip.destination ? (
          <p className="text-sm text-muted">{trip.destination}</p>
        ) : null}
        <p className="mt-1 text-sm">
          {formatDateRange(trip.start_date, trip.end_date)}
        </p>
        {trip.companions ? (
          <p className="mt-1 text-sm text-muted">同行者: {trip.companions}</p>
        ) : null}
        {trip.memo ? (
          <p className="mt-2 whitespace-pre-wrap text-sm">{trip.memo}</p>
        ) : null}
        <div className="mt-3 flex flex-wrap gap-2">
          <ShareUrl shareToken={trip.share_token} />
          <Link className="btn btn-ghost" href={`/trips/${trip.share_token}/edit`}>
            編集
          </Link>
          <DeleteTripButton shareToken={trip.share_token} />
        </div>
      </div>
    </header>
  );
}

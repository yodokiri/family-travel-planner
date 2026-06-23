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
      ) : (
        <div className="border-b border-line bg-lagoon-soft px-4 py-8">
          <p className="section-label text-lagoon">Travel Plan</p>
          <p className="mt-2 text-sm text-muted">{trip.destination ?? "旅先未定"}</p>
        </div>
      )}
      <div className="space-y-3 p-4">
        <div>
          <h1 className="text-2xl font-bold">{trip.title}</h1>
          {trip.destination ? (
            <p className="mt-1 text-sm text-muted">{trip.destination}</p>
          ) : null}
        </div>
        <p className="inline-flex rounded-md bg-sand px-3 py-1 text-sm font-semibold">
          {formatDateRange(trip.start_date, trip.end_date)}
        </p>
        {trip.companions ? (
          <p className="text-sm text-muted">同行者: {trip.companions}</p>
        ) : null}
        {trip.memo ? (
          <details className="rounded-lg border border-line bg-surface-soft p-3">
            <summary className="cursor-pointer text-sm font-semibold text-lagoon">
              旅行メモ
            </summary>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted">
              {trip.memo}
            </p>
          </details>
        ) : null}
        <div className="flex flex-wrap gap-2">
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

import type { ItineraryItem } from "@/lib/types";
import { displayTime } from "@/lib/format";
import { MapButton } from "./MapButton";
import { ImageButton } from "./ImageButton";
import { ItemActions } from "./ItemActions";
import { TransitInfo } from "./TransitInfo";

const CATEGORY_TONES: Record<string, string> = {
  移動: "bg-lagoon-soft text-lagoon",
  宿泊: "bg-sand text-ink",
  食事: "bg-accent-soft text-accent",
  観光: "bg-lagoon-soft text-lagoon",
  買い物: "bg-sand text-ink",
  休憩: "bg-surface-soft text-muted",
  子ども: "bg-accent-soft text-accent",
  メモ: "bg-surface-soft text-muted",
  その他: "bg-surface-soft text-muted",
};

export function ItineraryCard({
  item,
  shareToken,
  imageCount,
  canMoveUp,
  canMoveDown,
}: {
  item: ItineraryItem;
  shareToken: string;
  imageCount: number;
  canMoveUp: boolean;
  canMoveDown: boolean;
}) {
  const editHref = `/trips/${shareToken}/items/${item.id}/edit`;
  const imagesHref = `/trips/${shareToken}?tab=images`;
  const categoryTone = CATEGORY_TONES[item.category] ?? CATEGORY_TONES.その他;

  return (
    <li className="card overflow-hidden">
      <details>
        <summary className="cursor-pointer list-none p-4">
          <div className="flex items-start gap-3">
            <div className="min-w-16 rounded-lg bg-ink px-2 py-2 text-center text-sm font-semibold text-white">
              {displayTime(item)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${categoryTone}`}>
                  {item.category}
                </span>
                {item.status === "candidate" ? <span className="badge">候補</span> : null}
              </div>
              <div className="mt-2 text-base font-semibold leading-6">{item.title}</div>
              {item.place_name ? (
                <div className="mt-1 truncate text-sm text-muted">{item.place_name}</div>
              ) : null}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 pl-0 sm:pl-[4.75rem]">
            <MapButton mapUrl={item.map_url} editHref={editHref} />
            <ImageButton count={imageCount} href={imagesHref} />
          </div>
        </summary>

        <div className="space-y-3 border-t border-line bg-white/45 p-4 text-sm">
          {item.address ? <p className="text-muted">住所: {item.address}</p> : null}
          {item.booking_url ? (
            <p>
              <a
                href={item.booking_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-lagoon underline"
              >
                予約ページを開く
              </a>
            </p>
          ) : null}
          {item.memo ? (
            <p className="whitespace-pre-wrap leading-6 text-ink">{item.memo}</p>
          ) : null}
          <ItemActions
            shareToken={shareToken}
            itemId={item.id}
            editHref={editHref}
            canMoveUp={canMoveUp}
            canMoveDown={canMoveDown}
          />
        </div>
      </details>

      <TransitInfo text={item.transit_to_next_text} />
    </li>
  );
}

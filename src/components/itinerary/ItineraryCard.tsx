import type { ItineraryItem } from "@/lib/types";
import { displayTime } from "@/lib/format";
import { MapButton } from "./MapButton";
import { ImageButton } from "./ImageButton";
import { ItemActions } from "./ItemActions";
import { TransitInfo } from "./TransitInfo";

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

  return (
    <li className="card">
      <details>
        <summary className="cursor-pointer list-none p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-accent">
              {displayTime(item)}
            </span>
            {item.status === "candidate" ? (
              <span className="badge">候補</span>
            ) : null}
          </div>
          <div className="mt-0.5 font-medium">{item.title}</div>
          <div className="text-xs text-muted">
            {item.category}
            {item.place_name ? `｜${item.place_name}` : ""}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <MapButton mapUrl={item.map_url} editHref={editHref} />
            <ImageButton count={imageCount} href={imagesHref} />
          </div>
        </summary>

        <div className="space-y-2 border-t border-line p-3 text-sm">
          {item.address ? <p>住所：{item.address}</p> : null}
          {item.booking_url ? (
            <p>
              <a
                href={item.booking_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline"
              >
                予約ページを開く
              </a>
            </p>
          ) : null}
          {item.memo ? <p className="whitespace-pre-wrap">{item.memo}</p> : null}
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

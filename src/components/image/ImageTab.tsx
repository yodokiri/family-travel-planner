import type { Trip } from "@/lib/types";
import { listAttachments } from "@/lib/attachments";
import { listItemTitles, listItemsForSelect } from "@/lib/items";
import { createSignedUrlsMap } from "@/lib/storage";
import { ImageUploadForm } from "./ImageUploadForm";
import { AttachmentCard } from "./AttachmentCard";

export async function ImageTab({ trip }: { trip: Trip }) {
  const [attachments, itemTitles, itemOptions] = await Promise.all([
    listAttachments(trip.id),
    listItemTitles(trip.id),
    listItemsForSelect(trip.id),
  ]);
  const urls = await createSignedUrlsMap(attachments.map((a) => a.file_path));

  return (
    <div>
      <ImageUploadForm shareToken={trip.share_token} items={itemOptions} />
      {attachments.length === 0 ? (
        <p className="mt-6 text-center text-sm text-muted">
          画像・PDFはまだありません。
        </p>
      ) : (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {attachments.map((a) => (
            <AttachmentCard
              key={a.id}
              attachment={a}
              url={urls[a.file_path] ?? null}
              itemTitle={
                a.itinerary_item_id
                  ? (itemTitles[a.itinerary_item_id] ?? null)
                  : null
              }
              shareToken={trip.share_token}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

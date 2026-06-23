import type { Attachment } from "@/lib/types";
import { DeleteAttachmentButton } from "./DeleteAttachmentButton";

export function AttachmentCard({
  attachment,
  url,
  itemTitle,
  shareToken,
}: {
  attachment: Attachment;
  url: string | null;
  itemTitle: string | null;
  shareToken: string;
}) {
  return (
    <li className="card overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md">
      {url ? (
        attachment.file_type === "image" ? (
          <a href={url} target="_blank" rel="noopener noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={attachment.caption ?? attachment.file_name}
              className="h-32 w-full object-cover"
            />
          </a>
        ) : (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-32 items-center justify-center bg-accent-soft text-sm font-medium text-accent"
          >
            PDFを開く
          </a>
        )
      ) : (
        <div className="flex h-32 items-center justify-center text-xs text-muted">
          読み込みに失敗しました
        </div>
      )}
      <div className="space-y-1 p-3">
        <p className="truncate text-sm font-semibold">
          {attachment.caption || attachment.file_name}
        </p>
        <p className="truncate text-xs text-muted">
          {itemTitle ? `紐づく予定: ${itemTitle}` : "旅行全体"}
        </p>
        <div className="mt-1">
          <DeleteAttachmentButton shareToken={shareToken} id={attachment.id} />
        </div>
      </div>
    </li>
  );
}

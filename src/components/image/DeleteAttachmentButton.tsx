"use client";

import { deleteAttachment } from "@/actions/attachments";

export function DeleteAttachmentButton({
  shareToken,
  id,
}: {
  shareToken: string;
  id: string;
}) {
  const del = deleteAttachment.bind(null, shareToken, id);
  return (
    <form
      action={del}
      onSubmit={(e) => {
        if (!confirm("この画像を削除しますか？")) e.preventDefault();
      }}
    >
      <button type="submit" className="text-xs text-red-700">
        削除
      </button>
    </form>
  );
}

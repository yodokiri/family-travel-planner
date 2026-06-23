"use client";

import { uploadAttachment } from "@/actions/attachments";
import { ACCEPT_ATTR } from "@/lib/upload-config";

export function ImageUploadForm({
  shareToken,
  items,
}: {
  shareToken: string;
  items: { id: string; title: string; date: string }[];
}) {
  const action = uploadAttachment.bind(null, shareToken);

  return (
    <form
      action={action}
      className="card space-y-2 p-3"
    >
      <input
        type="file"
        name="file"
        accept={ACCEPT_ATTR}
        required
        className="block w-full text-sm"
      />
      <input name="caption" placeholder="説明（任意）" className="input" />
      <select name="itemId" defaultValue="" className="input">
        <option value="">旅行全体に追加</option>
        {items.map((it) => (
          <option key={it.id} value={it.id}>
            {it.title}
          </option>
        ))}
      </select>
      <button type="submit" className="btn btn-primary w-full">
        アップロード（画像・PDF / 5MBまで）
      </button>
    </form>
  );
}

"use client";

import Link from "next/link";
import { deleteItem, moveItem } from "@/actions/items";

export function ItemActions({
  shareToken,
  itemId,
  editHref,
  canMoveUp,
  canMoveDown,
}: {
  shareToken: string;
  itemId: string;
  editHref: string;
  canMoveUp: boolean;
  canMoveDown: boolean;
}) {
  const del = deleteItem.bind(null, shareToken, itemId);
  const moveUp = moveItem.bind(null, shareToken, itemId, "up");
  const moveDown = moveItem.bind(null, shareToken, itemId, "down");

  return (
    <div className="flex flex-wrap gap-2 pt-1">
      <Link href={editHref} className="btn btn-ghost">
        編集
      </Link>
      <form action={moveUp}>
        <button
          type="submit"
          disabled={!canMoveUp}
          className="btn btn-ghost disabled:opacity-40"
        >
          ↑ 上へ
        </button>
      </form>
      <form action={moveDown}>
        <button
          type="submit"
          disabled={!canMoveDown}
          className="btn btn-ghost disabled:opacity-40"
        >
          ↓ 下へ
        </button>
      </form>
      <form
        action={del}
        onSubmit={(e) => {
          if (!confirm("この予定を削除しますか？")) e.preventDefault();
        }}
      >
        <button type="submit" className="btn btn-danger">
          削除
        </button>
      </form>
    </div>
  );
}

"use client";

import { toggleChecklistItem, deleteChecklistItem } from "@/actions/checklist";
import type { ChecklistItem } from "@/lib/types";

export function ChecklistItemRow({
  item,
  shareToken,
}: {
  item: ChecklistItem;
  shareToken: string;
}) {
  const toggle = toggleChecklistItem.bind(null, shareToken, item.id);
  const del = deleteChecklistItem.bind(null, shareToken, item.id);

  return (
    <li className="flex items-center gap-2">
      <form action={toggle}>
        <button
          type="submit"
          aria-label={item.is_done ? "未完了に戻す" : "完了にする"}
          className="text-lg leading-none"
        >
          {item.is_done ? "☑" : "☐"}
        </button>
      </form>
      <span
        className={
          item.is_done
            ? "flex-1 text-sm text-muted line-through"
            : "flex-1 text-sm"
        }
      >
        {item.title}
      </span>
      <form action={del}>
        <button type="submit" className="text-xs text-red-700">
          削除
        </button>
      </form>
    </li>
  );
}

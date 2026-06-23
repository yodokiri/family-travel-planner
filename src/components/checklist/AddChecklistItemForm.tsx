"use client";

import { addChecklistItem } from "@/actions/checklist";
import { CHECKLIST_CATEGORIES } from "@/lib/categories";

export function AddChecklistItemForm({ shareToken }: { shareToken: string }) {
  const action = addChecklistItem.bind(null, shareToken);
  return (
    <form action={action} className="card flex flex-wrap gap-2 p-3">
      <input
        name="title"
        required
        placeholder="項目を追加"
        className="input flex-1"
      />
      <select name="category" defaultValue="" className="input w-32 shrink-0">
        <option value="">未分類</option>
        {CHECKLIST_CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <button type="submit" className="btn btn-ghost shrink-0">
        追加
      </button>
    </form>
  );
}

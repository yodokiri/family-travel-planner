import type { ChecklistItem, Trip } from "@/lib/types";
import { listChecklistItems, listTemplates } from "@/lib/checklist";
import { CHECKLIST_CATEGORIES } from "@/lib/categories";
import { TemplatePicker } from "./TemplatePicker";
import { AddChecklistItemForm } from "./AddChecklistItemForm";
import { ChecklistItemRow } from "./ChecklistItemRow";

export async function ChecklistTab({ trip }: { trip: Trip }) {
  const [items, templates] = await Promise.all([
    listChecklistItems(trip.id),
    listTemplates(),
  ]);

  // カテゴリ別グループ化（null は「その他」へ）
  const groups = new Map<string, ChecklistItem[]>();
  for (const it of items) {
    const key = it.category ?? "その他";
    const arr = groups.get(key);
    if (arr) arr.push(it);
    else groups.set(key, [it]);
  }
  const known = CHECKLIST_CATEGORIES.filter((c) => groups.has(c));
  const others = [...groups.keys()].filter(
    (c) => !(CHECKLIST_CATEGORIES as readonly string[]).includes(c),
  );
  const orderedCats = [...known, ...others];

  const doneCount = items.filter((i) => i.is_done).length;

  return (
    <div className="space-y-4">
      <TemplatePicker shareToken={trip.share_token} templates={templates} />
      <AddChecklistItemForm shareToken={trip.share_token} />

      {items.length === 0 ? (
        <p className="text-center text-sm text-muted">
          チェックリストはまだありません。テンプレートから追加できます。
        </p>
      ) : (
        <>
          <p className="text-xs text-muted">
            {doneCount} / {items.length} 完了
          </p>
          {orderedCats.map((cat) => (
            <div key={cat}>
              <h3 className="text-sm font-semibold text-muted">{cat}</h3>
              <ul className="mt-1 space-y-1">
                {groups.get(cat)!.map((it) => (
                  <ChecklistItemRow
                    key={it.id}
                    item={it}
                    shareToken={trip.share_token}
                  />
                ))}
              </ul>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

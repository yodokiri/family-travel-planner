"use client";

import { applyTemplate } from "@/actions/checklist";
import type { ChecklistTemplate } from "@/lib/types";

export function TemplatePicker({
  shareToken,
  templates,
}: {
  shareToken: string;
  templates: ChecklistTemplate[];
}) {
  const action = applyTemplate.bind(null, shareToken);
  return (
    <form action={action} className="card flex gap-2 p-3">
      <select name="templateId" defaultValue="" required className="input">
        <option value="" disabled>
          テンプレートから追加
        </option>
        {templates.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>
      <button type="submit" className="btn btn-primary shrink-0">
        追加
      </button>
    </form>
  );
}

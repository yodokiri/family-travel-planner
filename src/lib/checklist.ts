import "server-only";
import { createServiceClient } from "@/lib/supabase/server";
import type { ChecklistItem, ChecklistTemplate } from "@/lib/types";

/** 旅行のチェック項目を sort_order 昇順で取得。 */
export async function listChecklistItems(
  tripId: string,
): Promise<ChecklistItem[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("checklist_items")
    .select("*")
    .eq("trip_id", tripId)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as ChecklistItem[];
}

/** 利用可能なチェックリストテンプレート一覧。 */
export async function listTemplates(): Promise<ChecklistTemplate[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("checklist_templates")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as ChecklistTemplate[];
}

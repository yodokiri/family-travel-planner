import "server-only";
import { createServiceClient } from "@/lib/supabase/server";
import type { Attachment } from "@/lib/types";

/** 予定（itinerary_item_id）ごとの添付枚数マップ。 */
export async function countImagesByItem(
  tripId: string,
  itemIds?: string[],
): Promise<Record<string, number>> {
  if (itemIds && itemIds.length === 0) return {};

  const supabase = createServiceClient();
  let query = supabase
    .from("attachments")
    .select("itinerary_item_id")
    .eq("trip_id", tripId)
    .not("itinerary_item_id", "is", null);

  if (itemIds) {
    query = query.in("itinerary_item_id", itemIds);
  }

  const { data, error } = await query;
  if (error) throw error;

  const counts: Record<string, number> = {};
  for (const row of (data ?? []) as { itinerary_item_id: string | null }[]) {
    const id = row.itinerary_item_id;
    if (id) counts[id] = (counts[id] ?? 0) + 1;
  }
  return counts;
}

/** 旅行の全添付（新しい順）。 */
export async function listAttachments(tripId: string): Promise<Attachment[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("attachments")
    .select("*")
    .eq("trip_id", tripId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Attachment[];
}

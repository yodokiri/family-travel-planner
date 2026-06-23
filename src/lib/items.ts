import "server-only";
import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import type { ItineraryItem } from "@/lib/types";

/** 指定日の予定を sort_order 昇順で取得。 */
export async function listItemsByDate(
  tripId: string,
  date: string,
): Promise<ItineraryItem[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("itinerary_items")
    .select("*")
    .eq("trip_id", tripId)
    .eq("date", date)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as ItineraryItem[];
}

/** trip に属する単一予定を取得。無ければ notFound()。 */
export async function getItemForTrip(
  tripId: string,
  itemId: string,
): Promise<ItineraryItem> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("itinerary_items")
    .select("*")
    .eq("id", itemId)
    .eq("trip_id", tripId)
    .maybeSingle();
  if (!data) notFound();
  return data as ItineraryItem;
}

/** 予定 id → タイトルの対応表（画像の「紐づく予定」表示用）。 */
export async function listItemTitles(
  tripId: string,
): Promise<Record<string, string>> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("itinerary_items")
    .select("id,title")
    .eq("trip_id", tripId);
  const map: Record<string, string> = {};
  for (const r of (data ?? []) as { id: string; title: string }[]) {
    map[r.id] = r.title;
  }
  return map;
}

/** 画像アップロード時の予定選択肢（日付・順序で整列）。 */
export async function listItemsForSelect(
  tripId: string,
): Promise<{ id: string; title: string; date: string }[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("itinerary_items")
    .select("id,title,date")
    .eq("trip_id", tripId)
    .order("date", { ascending: true })
    .order("sort_order", { ascending: true });
  return (data ?? []) as { id: string; title: string; date: string }[];
}

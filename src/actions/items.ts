"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import { findTripByShareToken } from "@/lib/trips";
import { str, strOrNull } from "@/lib/form";
import type { ItineraryItem } from "@/lib/types";

export async function createItem(shareToken: string, formData: FormData) {
  const trip = await findTripByShareToken(shareToken);
  if (!trip) throw new Error("旅行が見つかりません。");

  const date = str(formData.get("date"));
  const title = str(formData.get("title"));
  if (!date || !title) throw new Error("日付とタイトルは必須です。");
  const category = str(formData.get("category")) || "その他";
  const status = str(formData.get("status")) === "candidate" ? "candidate" : "confirmed";

  const supabase = createServiceClient();

  // sort_order は同じ日付の末尾（max + 1）
  const { data: maxRow } = await supabase
    .from("itinerary_items")
    .select("sort_order")
    .eq("trip_id", trip.id)
    .eq("date", date)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextSort = ((maxRow as { sort_order: number } | null)?.sort_order ?? -1) + 1;

  const { error } = await supabase.from("itinerary_items").insert({
    trip_id: trip.id,
    date,
    start_time: strOrNull(formData.get("start_time")),
    time_label: strOrNull(formData.get("time_label")),
    category,
    title,
    place_name: strOrNull(formData.get("place_name")),
    address: strOrNull(formData.get("address")),
    map_url: strOrNull(formData.get("map_url")),
    booking_url: strOrNull(formData.get("booking_url")),
    memo: strOrNull(formData.get("memo")),
    transit_to_next_text: strOrNull(formData.get("transit_to_next_text")),
    status,
    sort_order: nextSort,
  });
  if (error) throw error;

  revalidatePath(`/trips/${shareToken}`);
  redirect(`/trips/${shareToken}?tab=schedule&day=${date}`);
}

export async function updateItem(
  shareToken: string,
  itemId: string,
  formData: FormData,
) {
  const trip = await findTripByShareToken(shareToken);
  if (!trip) throw new Error("旅行が見つかりません。");

  const date = str(formData.get("date"));
  const title = str(formData.get("title"));
  if (!date || !title) throw new Error("日付とタイトルは必須です。");
  const category = str(formData.get("category")) || "その他";
  const status = str(formData.get("status")) === "candidate" ? "candidate" : "confirmed";

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("itinerary_items")
    .update({
      date,
      start_time: strOrNull(formData.get("start_time")),
      time_label: strOrNull(formData.get("time_label")),
      category,
      title,
      place_name: strOrNull(formData.get("place_name")),
      address: strOrNull(formData.get("address")),
      map_url: strOrNull(formData.get("map_url")),
      booking_url: strOrNull(formData.get("booking_url")),
      memo: strOrNull(formData.get("memo")),
      transit_to_next_text: strOrNull(formData.get("transit_to_next_text")),
      status,
    })
    .eq("id", itemId)
    .eq("trip_id", trip.id);
  if (error) throw error;

  revalidatePath(`/trips/${shareToken}`);
  redirect(`/trips/${shareToken}?tab=schedule&day=${date}`);
}

export async function deleteItem(shareToken: string, itemId: string) {
  const trip = await findTripByShareToken(shareToken);
  if (!trip) throw new Error("旅行が見つかりません。");

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("itinerary_items")
    .delete()
    .eq("id", itemId)
    .eq("trip_id", trip.id);
  if (error) throw error;

  revalidatePath(`/trips/${shareToken}`);
}

export async function moveItem(
  shareToken: string,
  itemId: string,
  dir: "up" | "down",
) {
  const trip = await findTripByShareToken(shareToken);
  if (!trip) throw new Error("旅行が見つかりません。");

  const supabase = createServiceClient();
  const { data: curRow } = await supabase
    .from("itinerary_items")
    .select("*")
    .eq("id", itemId)
    .eq("trip_id", trip.id)
    .maybeSingle();
  const cur = curRow as ItineraryItem | null;
  if (!cur) return;

  // 同じ日付内で、移動方向の隣接アイテムを取得
  const query = supabase
    .from("itinerary_items")
    .select("*")
    .eq("trip_id", trip.id)
    .eq("date", cur.date);
  const { data: nbRow } =
    dir === "up"
      ? await query
          .lt("sort_order", cur.sort_order)
          .order("sort_order", { ascending: false })
          .limit(1)
          .maybeSingle()
      : await query
          .gt("sort_order", cur.sort_order)
          .order("sort_order", { ascending: true })
          .limit(1)
          .maybeSingle();
  const nb = nbRow as ItineraryItem | null;
  if (!nb) return; // 端なので何もしない

  // sort_order を入れ替え
  await supabase
    .from("itinerary_items")
    .update({ sort_order: nb.sort_order })
    .eq("id", cur.id);
  await supabase
    .from("itinerary_items")
    .update({ sort_order: cur.sort_order })
    .eq("id", nb.id);

  revalidatePath(`/trips/${shareToken}`);
}

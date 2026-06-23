"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";
import { findTripByShareToken } from "@/lib/trips";
import { str, strOrNull } from "@/lib/form";

export async function applyTemplate(shareToken: string, formData: FormData) {
  const trip = await findTripByShareToken(shareToken);
  if (!trip) throw new Error("旅行が見つかりません。");
  const templateId = str(formData.get("templateId"));
  if (!templateId) return;

  const supabase = createServiceClient();
  const { data: tItems } = await supabase
    .from("checklist_template_items")
    .select("title,category,sort_order")
    .eq("template_id", templateId)
    .order("sort_order", { ascending: true });

  const rows = ((tItems ?? []) as {
    title: string;
    category: string | null;
    sort_order: number;
  }[]).map((t) => ({
    trip_id: trip.id,
    title: t.title,
    category: t.category,
    is_done: false,
    sort_order: t.sort_order,
  }));

  if (rows.length > 0) {
    const { error } = await supabase.from("checklist_items").insert(rows);
    if (error) throw error;
  }
  revalidatePath(`/trips/${shareToken}`);
}

export async function addChecklistItem(shareToken: string, formData: FormData) {
  const trip = await findTripByShareToken(shareToken);
  if (!trip) throw new Error("旅行が見つかりません。");
  const title = str(formData.get("title"));
  if (!title) return;
  const category = strOrNull(formData.get("category"));

  const supabase = createServiceClient();
  const { data: maxRow } = await supabase
    .from("checklist_items")
    .select("sort_order")
    .eq("trip_id", trip.id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextSort = ((maxRow as { sort_order: number } | null)?.sort_order ?? -1) + 1;

  const { error } = await supabase.from("checklist_items").insert({
    trip_id: trip.id,
    title,
    category,
    is_done: false,
    sort_order: nextSort,
  });
  if (error) throw error;
  revalidatePath(`/trips/${shareToken}`);
}

export async function toggleChecklistItem(shareToken: string, id: string) {
  const trip = await findTripByShareToken(shareToken);
  if (!trip) throw new Error("旅行が見つかりません。");

  const supabase = createServiceClient();
  const { data } = await supabase
    .from("checklist_items")
    .select("is_done")
    .eq("id", id)
    .eq("trip_id", trip.id)
    .maybeSingle();
  const row = data as { is_done: boolean } | null;
  if (!row) return;

  await supabase
    .from("checklist_items")
    .update({ is_done: !row.is_done })
    .eq("id", id)
    .eq("trip_id", trip.id);
  revalidatePath(`/trips/${shareToken}`);
}

export async function deleteChecklistItem(shareToken: string, id: string) {
  const trip = await findTripByShareToken(shareToken);
  if (!trip) throw new Error("旅行が見つかりません。");

  const supabase = createServiceClient();
  await supabase
    .from("checklist_items")
    .delete()
    .eq("id", id)
    .eq("trip_id", trip.id);
  revalidatePath(`/trips/${shareToken}`);
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createServiceClient } from "@/lib/supabase/server";
import { generateShareToken } from "@/lib/share-token";
import { findTripByShareToken } from "@/lib/trips";
import { str, strOrNull } from "@/lib/form";
import { MAX_FILE_SIZE, extFromName } from "@/lib/upload-config";
import { BUCKET, buildCoverPath } from "@/lib/storage";

async function uploadCoverIfPresent(
  supabase: SupabaseClient,
  tripId: string,
  cover: FormDataEntryValue | null,
  oldPath?: string | null,
) {
  if (!(cover instanceof File) || cover.size === 0) return;
  if (!cover.type.startsWith("image/")) {
    throw new Error("代表画像は画像ファイルを選択してください。");
  }
  if (cover.size > MAX_FILE_SIZE) {
    throw new Error("代表画像は5MBまでです。");
  }
  const ext = extFromName(cover.name);
  const path = buildCoverPath(tripId, ext);
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, cover, { contentType: cover.type });
  if (error) throw error;
  await supabase.from("trips").update({ cover_image_path: path }).eq("id", tripId);
  if (oldPath) await supabase.storage.from(BUCKET).remove([oldPath]);
}

export async function createTrip(formData: FormData) {
  const title = str(formData.get("title"));
  const start_date = str(formData.get("start_date"));
  const end_date = str(formData.get("end_date"));
  if (!title || !start_date || !end_date) {
    throw new Error("旅行名・開始日・終了日は必須です。");
  }

  const supabase = createServiceClient();
  const share_token = generateShareToken();
  const { data: inserted, error } = await supabase
    .from("trips")
    .insert({
      share_token,
      title,
      destination: strOrNull(formData.get("destination")),
      start_date,
      end_date,
      companions: strOrNull(formData.get("companions")),
      memo: strOrNull(formData.get("memo")),
    })
    .select("id")
    .single();
  if (error) throw error;

  await uploadCoverIfPresent(
    supabase,
    (inserted as { id: string }).id,
    formData.get("cover"),
  );

  revalidatePath("/");
  redirect(`/trips/${share_token}`);
}

export async function updateTrip(shareToken: string, formData: FormData) {
  const trip = await findTripByShareToken(shareToken);
  if (!trip) throw new Error("旅行が見つかりません。");

  const title = str(formData.get("title"));
  const start_date = str(formData.get("start_date"));
  const end_date = str(formData.get("end_date"));
  if (!title || !start_date || !end_date) {
    throw new Error("旅行名・開始日・終了日は必須です。");
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("trips")
    .update({
      title,
      destination: strOrNull(formData.get("destination")),
      start_date,
      end_date,
      companions: strOrNull(formData.get("companions")),
      memo: strOrNull(formData.get("memo")),
    })
    .eq("id", trip.id);
  if (error) throw error;

  await uploadCoverIfPresent(
    supabase,
    trip.id,
    formData.get("cover"),
    trip.cover_image_path,
  );

  revalidatePath("/");
  revalidatePath(`/trips/${shareToken}`);
  redirect(`/trips/${shareToken}`);
}

export async function deleteTrip(shareToken: string) {
  const trip = await findTripByShareToken(shareToken);
  if (!trip) redirect("/");

  const supabase = createServiceClient();

  // Storage 実体を削除（DB行は CASCADE で消えるが Storage は連動しないため）
  const { data: atts } = await supabase
    .from("attachments")
    .select("file_path")
    .eq("trip_id", trip.id);
  const paths = (atts ?? []).map((a: { file_path: string }) => a.file_path);
  if (trip.cover_image_path) paths.push(trip.cover_image_path);
  if (paths.length > 0) {
    await supabase.storage.from(BUCKET).remove(paths);
  }

  const { error } = await supabase.from("trips").delete().eq("id", trip.id);
  if (error) throw error;

  revalidatePath("/");
  redirect("/");
}

"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";
import { findTripByShareToken } from "@/lib/trips";
import { strOrNull } from "@/lib/form";
import {
  MAX_FILE_SIZE,
  isAcceptedMime,
  fileTypeFromMime,
  extFromName,
} from "@/lib/upload-config";
import { BUCKET, buildAttachmentPath, removeFromStorage } from "@/lib/storage";

export async function uploadAttachment(shareToken: string, formData: FormData) {
  const trip = await findTripByShareToken(shareToken);
  if (!trip) throw new Error("旅行が見つかりません。");

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("ファイルを選択してください。");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("ファイルサイズは5MBまでです。");
  }
  if (!isAcceptedMime(file.type)) {
    throw new Error("画像またはPDFを選択してください。");
  }

  const supabase = createServiceClient();

  // itemId が指定されていれば、その予定が trip に属するか確認
  let itemId: string | null = null;
  const itemIdRaw = strOrNull(formData.get("itemId"));
  if (itemIdRaw) {
    const { data } = await supabase
      .from("itinerary_items")
      .select("id")
      .eq("id", itemIdRaw)
      .eq("trip_id", trip.id)
      .maybeSingle();
    if (data) itemId = itemIdRaw;
  }

  const ext = extFromName(file.name);
  const path = buildAttachmentPath(trip.id, { itemId }, ext);

  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });
  if (upErr) throw upErr;

  const { error } = await supabase.from("attachments").insert({
    trip_id: trip.id,
    itinerary_item_id: itemId,
    file_name: file.name,
    file_path: path,
    file_type: fileTypeFromMime(file.type),
    caption: strOrNull(formData.get("caption")),
  });
  if (error) {
    await removeFromStorage([path]); // DB失敗時はアップロード済みを後始末
    throw error;
  }

  revalidatePath(`/trips/${shareToken}`);
}

export async function deleteAttachment(shareToken: string, id: string) {
  const trip = await findTripByShareToken(shareToken);
  if (!trip) throw new Error("旅行が見つかりません。");

  const supabase = createServiceClient();
  const { data } = await supabase
    .from("attachments")
    .select("file_path")
    .eq("id", id)
    .eq("trip_id", trip.id)
    .maybeSingle();
  const row = data as { file_path: string } | null;
  if (!row) return;

  await supabase.from("attachments").delete().eq("id", id).eq("trip_id", trip.id);
  await removeFromStorage([row.file_path]);

  revalidatePath(`/trips/${shareToken}`);
}

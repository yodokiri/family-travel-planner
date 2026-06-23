import "server-only";
import { createServiceClient } from "@/lib/supabase/server";

export const BUCKET = "trip-attachments";

/** 添付の保存パス（予定紐づけ or 旅行全体）。 */
export function buildAttachmentPath(
  tripId: string,
  scope: { itemId?: string | null },
  ext: string,
): string {
  const name = `${crypto.randomUUID()}.${ext}`;
  return scope.itemId
    ? `${tripId}/items/${scope.itemId}/${name}`
    : `${tripId}/trip/${name}`;
}

/** 代表画像の保存パス。 */
export function buildCoverPath(tripId: string, ext: string): string {
  return `${tripId}/cover/${crypto.randomUUID()}.${ext}`;
}

/** 単一の署名付きURL（既定5分）。 */
export async function createSignedUrl(
  path: string,
  expiresIn = 300,
): Promise<string | null> {
  const supabase = createServiceClient();
  const { data } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, expiresIn);
  return data?.signedUrl ?? null;
}

/** 複数パス → 署名付きURL の対応表（一括発行）。 */
export async function createSignedUrlsMap(
  paths: string[],
  expiresIn = 300,
): Promise<Record<string, string>> {
  if (paths.length === 0) return {};
  const supabase = createServiceClient();
  const { data } = await supabase.storage
    .from(BUCKET)
    .createSignedUrls(paths, expiresIn);
  const map: Record<string, string> = {};
  for (const row of data ?? []) {
    if (row.path && row.signedUrl) map[row.path] = row.signedUrl;
  }
  return map;
}

/** Storage 実体を削除。 */
export async function removeFromStorage(paths: string[]): Promise<void> {
  if (paths.length === 0) return;
  const supabase = createServiceClient();
  await supabase.storage.from(BUCKET).remove(paths);
}

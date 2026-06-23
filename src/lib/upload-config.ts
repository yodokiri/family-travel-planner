// クライアント/サーバー双方で使うアップロード設定（server-only を付けない純粋モジュール）。
import type { FileType } from "@/lib/types";

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPT_ATTR = "image/*,application/pdf"; // <input accept>

export function isAcceptedMime(mime: string): boolean {
  return mime.startsWith("image/") || mime === "application/pdf";
}

export function fileTypeFromMime(mime: string): FileType {
  if (mime.startsWith("image/")) return "image";
  if (mime === "application/pdf") return "pdf";
  return "other";
}

export function extFromName(name: string): string {
  const parts = name.split(".");
  return parts.length > 1 ? (parts.pop() as string).toLowerCase() : "bin";
}

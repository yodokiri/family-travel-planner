import type { ItemStatus } from "@/lib/types";

/** 予定カードのカテゴリ（将来追加できるよう定数で集約）。 */
export const ITINERARY_CATEGORIES = [
  "移動",
  "宿泊",
  "食事",
  "観光",
  "買い物",
  "休憩",
  "子ども",
  "メモ",
  "その他",
] as const;
export type ItineraryCategory = (typeof ITINERARY_CATEGORIES)[number];

/** 曖昧な時刻表現のプリセット（自由入力も可）。 */
export const TIME_LABEL_PRESETS = [
  "未定",
  "朝",
  "午前中",
  "昼頃",
  "午後",
  "夕方",
  "夜",
  "時間があれば",
  "雨なら",
  "子ども次第",
  "休憩候補",
  "食事候補",
] as const;

/** 予定の確定/候補。 */
export const ITEM_STATUSES: { value: ItemStatus; label: string }[] = [
  { value: "confirmed", label: "確定" },
  { value: "candidate", label: "候補" },
];

/** チェックリストのカテゴリ別表示の並び順。null は「その他」に集約。 */
export const CHECKLIST_CATEGORIES = [
  "貴重品",
  "書類・予約",
  "電子機器",
  "衣類",
  "洗面・衛生",
  "医療",
  "飲食",
  "移動・その他",
] as const;

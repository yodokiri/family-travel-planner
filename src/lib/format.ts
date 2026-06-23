import type { ItineraryItem } from "@/lib/types";

/** searchParams の値（string | string[] | undefined）を単一文字列へ正規化。 */
export function normalizeParam(
  v: string | string[] | undefined,
): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

/** "2026-08-10" → "8/10(月)"。UTC固定で曜日計算（タイムゾーンずれ回避）。 */
export function formatDateLabel(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const wd = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return `${m}/${d}(${WEEKDAYS[wd]})`;
}

/** 日程の表示（例: "2026年8月10日〜8月12日"）。 */
export function formatDateRange(start: string, end: string): string {
  const [ys, ms, ds] = start.split("-").map(Number);
  const [ye, me, de] = end.split("-").map(Number);
  if (start === end) return `${ys}年${ms}月${ds}日`;
  if (ys === ye) return `${ys}年${ms}月${ds}日〜${me}月${de}日`;
  return `${ys}年${ms}月${ds}日〜${ye}年${me}月${de}日`;
}

/** start〜end の日付を YYYY-MM-DD 配列で返す（文字列ベース、UTC加算）。 */
export function enumerateDates(start: string, end: string): string[] {
  const [ys, ms, ds] = start.split("-").map(Number);
  const [ye, me, de] = end.split("-").map(Number);
  let cur = Date.UTC(ys, ms - 1, ds);
  const last = Date.UTC(ye, me - 1, de);
  const out: string[] = [];
  let guard = 0;
  while (cur <= last && guard < 366) {
    const dt = new Date(cur);
    const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(dt.getUTCDate()).padStart(2, "0");
    out.push(`${dt.getUTCFullYear()}-${mm}-${dd}`);
    cur += 86400000;
    guard++;
  }
  return out;
}

/** 予定カードの表示時刻: start_time → time_label → 「時刻未定」。 */
export function displayTime(
  item: Pick<ItineraryItem, "start_time" | "time_label">,
): string {
  if (item.start_time) return item.start_time.slice(0, 5); // HH:MM
  if (item.time_label) return item.time_label;
  return "時刻未定";
}

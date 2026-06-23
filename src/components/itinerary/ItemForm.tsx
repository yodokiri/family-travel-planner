"use client";

import type { ItineraryItem } from "@/lib/types";
import {
  ITINERARY_CATEGORIES,
  TIME_LABEL_PRESETS,
  ITEM_STATUSES,
} from "@/lib/categories";
import { formatDateLabel } from "@/lib/format";

export function ItemForm({
  action,
  dates,
  item,
  defaultDate,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  dates: string[];
  item?: ItineraryItem;
  defaultDate?: string;
  submitLabel: string;
}) {
  const initialDate = item?.date ?? defaultDate ?? dates[0];

  return (
    <form action={action} className="mt-4 space-y-4">
      <div>
        <label className="block text-sm font-medium">タイトル *</label>
        <input
          name="title"
          required
          defaultValue={item?.title ?? ""}
          className="input mt-1"
          placeholder="例: 京都水族館"
        />
      </div>
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium">日付 *</label>
          <select
            name="date"
            required
            defaultValue={initialDate}
            className="input mt-1"
          >
            {dates.map((d) => (
              <option key={d} value={d}>
                {formatDateLabel(d)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium">カテゴリ</label>
          <select
            name="category"
            defaultValue={item?.category ?? "観光"}
            className="input mt-1"
          >
            {ITINERARY_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium">開始時刻（任意）</label>
          <input
            type="time"
            name="start_time"
            defaultValue={item?.start_time?.slice(0, 5) ?? ""}
            className="input mt-1"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium">時刻ラベル（任意）</label>
          <input
            name="time_label"
            list="time-labels"
            defaultValue={item?.time_label ?? ""}
            className="input mt-1"
            placeholder="例: 昼頃 / 雨なら"
          />
          <datalist id="time-labels">
            {TIME_LABEL_PRESETS.map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">場所名</label>
        <input
          name="place_name"
          defaultValue={item?.place_name ?? ""}
          className="input mt-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Google Maps リンク</label>
        <input
          type="url"
          name="map_url"
          defaultValue={item?.map_url ?? ""}
          className="input mt-1"
          placeholder="https://maps.google.com/..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium">予約URL</label>
        <input
          type="url"
          name="booking_url"
          defaultValue={item?.booking_url ?? ""}
          className="input mt-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">住所</label>
        <input
          name="address"
          defaultValue={item?.address ?? ""}
          className="input mt-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">メモ</label>
        <textarea
          name="memo"
          rows={3}
          defaultValue={item?.memo ?? ""}
          className="input mt-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">次へ移動</label>
        <input
          name="transit_to_next_text"
          defaultValue={item?.transit_to_next_text ?? ""}
          className="input mt-1"
          placeholder="例: 徒歩10分、雨ならタクシー"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">予定の種類</label>
        <select
          name="status"
          defaultValue={item?.status ?? "confirmed"}
          className="input mt-1"
        >
          {ITEM_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="btn btn-primary w-full">
        {submitLabel}
      </button>
    </form>
  );
}

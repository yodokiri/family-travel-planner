"use client";

import type { Trip } from "@/lib/types";

export function TripForm({
  action,
  trip,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  trip?: Trip;
  submitLabel: string;
}) {
  return (
    <form action={action} className="mt-4 space-y-4">
      <div>
        <label className="block text-sm font-medium">旅行名 *</label>
        <input
          name="title"
          required
          defaultValue={trip?.title ?? ""}
          className="input mt-1"
          placeholder="例: 京都家族旅行"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">目的地</label>
        <input
          name="destination"
          defaultValue={trip?.destination ?? ""}
          className="input mt-1"
          placeholder="例: 京都"
        />
      </div>
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium">開始日 *</label>
          <input
            type="date"
            name="start_date"
            required
            defaultValue={trip?.start_date ?? ""}
            className="input mt-1"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium">終了日 *</label>
          <input
            type="date"
            name="end_date"
            required
            defaultValue={trip?.end_date ?? ""}
            className="input mt-1"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">同行者</label>
        <input
          name="companions"
          defaultValue={trip?.companions ?? ""}
          className="input mt-1"
          placeholder="例: 家族4人"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">代表画像（任意）</label>
        <input
          type="file"
          name="cover"
          accept="image/*"
          className="mt-1 block w-full text-sm"
        />
        {trip?.cover_image_path ? (
          <p className="mt-1 text-xs text-muted">
            変更する場合のみ選択してください。
          </p>
        ) : null}
      </div>
      <div>
        <label className="block text-sm font-medium">メモ</label>
        <textarea
          name="memo"
          rows={3}
          defaultValue={trip?.memo ?? ""}
          className="input mt-1"
        />
      </div>
      <button type="submit" className="btn btn-primary w-full">
        {submitLabel}
      </button>
    </form>
  );
}

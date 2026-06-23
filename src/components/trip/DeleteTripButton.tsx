"use client";

import { deleteTrip } from "@/actions/trips";

export function DeleteTripButton({ shareToken }: { shareToken: string }) {
  const action = deleteTrip.bind(null, shareToken);
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("この旅行を削除しますか？登録した画像も削除されます。")) {
          e.preventDefault();
        }
      }}
    >
      <button type="submit" className="btn btn-ghost text-red-700">
        削除
      </button>
    </form>
  );
}

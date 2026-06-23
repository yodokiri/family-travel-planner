import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import type { Trip } from "@/lib/types";
import { TripListItem } from "@/components/trip/TripListItem";

// 一覧は常に最新を表示（ビルド時の事前生成は行わない）
export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  const trips = (data ?? []) as Trip[];

  return (
    <main className="page-shell">
      <div className="app-topline">
        <div>
          <p className="section-label">Family Travel</p>
          <h1 className="text-2xl font-bold">旅のしおり</h1>
        </div>
        <Link className="btn btn-primary" href="/trips/new">
          新しい旅行
        </Link>
      </div>
      {trips.length === 0 ? (
        <p className="mt-12 rounded-lg border border-dashed border-line bg-surface/70 p-8 text-center text-sm text-muted">
          まだ旅行がありません。「新しい旅行」から作成してください。
        </p>
      ) : (
        <ul className="mt-5 space-y-3">
          {trips.map((t) => (
            <TripListItem key={t.id} trip={t} />
          ))}
        </ul>
      )}
    </main>
  );
}

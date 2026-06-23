import Link from "next/link";
import { createTrip } from "@/actions/trips";
import { TripForm } from "@/components/trip/TripForm";

export default function NewTripPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-6">
      <Link href="/" className="text-sm text-muted">
        ← 一覧へ
      </Link>
      <h1 className="mt-2 text-xl font-bold">新しい旅行</h1>
      <TripForm action={createTrip} submitLabel="作成" />
    </main>
  );
}

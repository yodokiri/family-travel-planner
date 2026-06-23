import Link from "next/link";
import { updateTrip } from "@/actions/trips";
import { getTripByShareToken } from "@/lib/trips";
import { TripForm } from "@/components/trip/TripForm";

export default async function EditTripPage(props: {
  params: Promise<{ shareToken: string }>;
}) {
  const { shareToken } = await props.params;
  const trip = await getTripByShareToken(shareToken);
  const action = updateTrip.bind(null, shareToken);

  return (
    <main className="mx-auto max-w-2xl px-4 py-6">
      <Link href={`/trips/${shareToken}`} className="text-sm text-muted">
        ← 戻る
      </Link>
      <h1 className="mt-2 text-xl font-bold">旅行を編集</h1>
      <TripForm action={action} trip={trip} submitLabel="保存" />
    </main>
  );
}

import Link from "next/link";
import { updateItem } from "@/actions/items";
import { getTripByShareToken } from "@/lib/trips";
import { getItemForTrip } from "@/lib/items";
import { enumerateDates } from "@/lib/format";
import { ItemForm } from "@/components/itinerary/ItemForm";

export default async function EditItemPage(props: {
  params: Promise<{ shareToken: string; itemId: string }>;
}) {
  const { shareToken, itemId } = await props.params;
  const trip = await getTripByShareToken(shareToken);
  const item = await getItemForTrip(trip.id, itemId);
  const dates = enumerateDates(trip.start_date, trip.end_date);
  const action = updateItem.bind(null, shareToken, itemId);

  return (
    <main className="mx-auto max-w-2xl px-4 py-6">
      <Link
        href={`/trips/${shareToken}?tab=schedule&day=${item.date}`}
        className="text-sm text-muted"
      >
        ← 戻る
      </Link>
      <h1 className="mt-2 text-xl font-bold">予定を編集</h1>
      <ItemForm
        action={action}
        dates={dates}
        item={item}
        submitLabel="保存"
      />
    </main>
  );
}

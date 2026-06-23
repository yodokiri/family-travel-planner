import Link from "next/link";
import { createItem } from "@/actions/items";
import { getTripByShareToken } from "@/lib/trips";
import { enumerateDates, normalizeParam } from "@/lib/format";
import { ItemForm } from "@/components/itinerary/ItemForm";

export default async function NewItemPage(props: {
  params: Promise<{ shareToken: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { shareToken } = await props.params;
  const sp = await props.searchParams;
  const trip = await getTripByShareToken(shareToken);
  const dates = enumerateDates(trip.start_date, trip.end_date);
  const defaultDate = normalizeParam(sp.day) ?? dates[0];
  const action = createItem.bind(null, shareToken);

  return (
    <main className="mx-auto max-w-2xl px-4 py-6">
      <Link
        href={`/trips/${shareToken}?tab=schedule&day=${defaultDate}`}
        className="text-sm text-muted"
      >
        ← 戻る
      </Link>
      <h1 className="mt-2 text-xl font-bold">予定を追加</h1>
      <ItemForm
        action={action}
        dates={dates}
        defaultDate={defaultDate}
        submitLabel="作成"
      />
    </main>
  );
}

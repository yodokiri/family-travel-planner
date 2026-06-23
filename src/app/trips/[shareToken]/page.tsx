import { getTripByShareToken } from "@/lib/trips";
import { normalizeParam } from "@/lib/format";
import { createSignedUrl } from "@/lib/storage";
import { TripHeader } from "@/components/trip/TripHeader";
import { TripTabs } from "@/components/itinerary/TripTabs";
import { ScheduleTab } from "@/components/itinerary/ScheduleTab";
import { ImageTab } from "@/components/image/ImageTab";
import { ChecklistTab } from "@/components/checklist/ChecklistTab";

export const dynamic = "force-dynamic";

export default async function TripDetailPage(props: {
  params: Promise<{ shareToken: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { shareToken } = await props.params;
  const sp = await props.searchParams;
  const tab = normalizeParam(sp.tab) ?? "schedule";
  const day = normalizeParam(sp.day);

  const trip = await getTripByShareToken(shareToken);
  const coverUrl = trip.cover_image_path
    ? await createSignedUrl(trip.cover_image_path)
    : null;

  return (
    <main className="page-shell">
      <TripHeader trip={trip} coverUrl={coverUrl} />
      <TripTabs shareToken={shareToken} active={tab} />
      <div className="mt-4">
        {tab === "images" ? (
          <ImageTab trip={trip} />
        ) : tab === "checklist" ? (
          <ChecklistTab trip={trip} />
        ) : (
          <ScheduleTab trip={trip} day={day} />
        )}
      </div>
    </main>
  );
}

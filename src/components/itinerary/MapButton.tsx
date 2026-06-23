import Link from "next/link";

export function MapButton({
  mapUrl,
  editHref,
}: {
  mapUrl: string | null;
  editHref: string;
}) {
  if (mapUrl) {
    return (
      <a
        href={mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-ghost"
      >
        地図を開く
      </a>
    );
  }
  return (
    <Link href={editHref} className="btn btn-ghost">
      地図を追加
    </Link>
  );
}

import Link from "next/link";

export function ImageButton({
  count,
  href,
}: {
  count: number;
  href: string;
}) {
  const label = count === 0 ? "画像追加" : count === 1 ? "画像あり" : `画像 ${count}枚`;
  return (
    <Link href={href} className="btn btn-ghost">
      {label}
    </Link>
  );
}

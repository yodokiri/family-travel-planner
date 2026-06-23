import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-xl font-bold">旅行が見つかりません</h1>
      <p className="mt-2 text-muted">共有URLが正しいかご確認ください。</p>
      <Link href="/" className="btn btn-ghost mt-4">
        一覧へ
      </Link>
    </main>
  );
}

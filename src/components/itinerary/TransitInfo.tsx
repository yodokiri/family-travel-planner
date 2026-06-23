export function TransitInfo({ text }: { text: string | null }) {
  if (!text) return null;
  return (
    <div className="px-3 py-2 text-xs text-muted">↓ 次へ移動：{text}</div>
  );
}

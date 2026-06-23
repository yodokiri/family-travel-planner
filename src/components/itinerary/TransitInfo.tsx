export function TransitInfo({ text }: { text: string | null }) {
  if (!text) return null;
  return (
    <div className="border-t border-line bg-surface-soft px-4 py-2 text-xs leading-5 text-muted">
      次へ移動: {text}
    </div>
  );
}

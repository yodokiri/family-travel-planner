"use client";

import { useState } from "react";

export function ShareUrl({ shareToken }: { shareToken: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const url = `${window.location.origin}/trips/${shareToken}`;
    let didCopy = false;

    if (navigator.clipboard?.writeText) {
      try {
        await Promise.race([
          navigator.clipboard.writeText(url),
          new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error("Clipboard timeout")), 500);
          }),
        ]);
        didCopy = true;
      } catch {
        didCopy = false;
      }
    }

    if (!didCopy) {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      textarea.setSelectionRange(0, url.length);
      didCopy = document.execCommand("copy");
      textarea.remove();
    }

    if (didCopy) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }

  return (
    <button type="button" onClick={copy} className="btn btn-ghost">
      {copied ? "コピーしました" : "共有URLをコピー"}
    </button>
  );
}

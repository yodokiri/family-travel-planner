import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "旅のしおり",
  description: "家族旅行の予定・画像・チェックリストをまとめる旅のしおり",
  // 共有URLは検索エンジンに載せない（アクセス制御ではない）
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}

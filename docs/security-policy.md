# Family Travel Planner — セキュリティ方針

ログインは実装しない。ただし予約画像・QRコード・日程を扱うため、**アーキテクチャの安全な既定**を採る。

方針の射程:
- 「アクセス制御（誰が何を見られるか）」は**作り込まない** — `share_token` を知る人は閲覧・編集可、一覧も全件表示でよい。
- ただし「鍵をブラウザに出さない／予約画像を推測URLで晒さない」は**守る**。

---

## 1. share_token

- 形式: `tk_` + `randomBytes(16)` を base64url（128bit相当）。
- `trips.share_token` は unique。衝突時は再生成（実質発生しない）。
- 共有URL: `/trips/[shareToken]`。

```ts
// src/lib/share-token.ts
import { randomBytes } from "node:crypto";

export function generateShareToken(): string {
  return `tk_${randomBytes(16).toString("base64url")}`;
}
```

---

## 2. データアクセス

- ブラウザから Supabase へ**直接アクセスしない**。全CRUDは Next.js Server Actions 経由。
- service role key は**サーバーのみ**（`process.env.SUPABASE_SERVICE_ROLE_KEY`、`NEXT_PUBLIC_` を付けない）。anon key は使わない。
- 各Actionの先頭で `shareToken → trip` を解決し、存在しなければ 404。`trip_id` 単独では受けない。

```ts
// src/lib/supabase/server.ts
import "server-only";
import { createClient } from "@supabase/supabase-js";

export function createServiceClient() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
```

---

## 3. RLS

- 全テーブルで RLS を**有効化**し、**ポリシーは作らない**。
- anon / authenticated は全拒否。service role がバイパスするためサーバーは動作。
- 万一 anon key が露出しても、クライアントからの直接アクセスは不可。

---

## 4. Storage

- bucket: `trip-attachments`、**private**。
- public bucket に予約画像・QRコードを置かない。
- パス: `{trip_id}/cover/...`, `{trip_id}/items/{item_id}/...`, `{trip_id}/trip/...`。
- 表示: サーバーで `shareToken` 検証後に `createSignedUrl`（有効期限 60〜300秒）。
- アップロード: Server Action 経由（service role）。サイズ上限（例 5MB）・拡張子制限を設ける。
- 削除: DB行と Storage 実体の両方を削除。旅行削除時は `{trip_id}/` 配下を一括削除（Storageは外部キーに連動しない）。

---

## 5. noindex

- `app/layout.tsx` の `metadata` で `robots: { index: false, follow: false }`。
- `app/robots.ts` で `disallow: '/'`。
- ※ noindex はアクセス制御ではない。実データ保護とは別に考える。

---

## 6. リポジトリ・環境変数

- `.gitignore` に `.env*`（`.env.example` は除く）。
- 実データ・予約番号・画像をコミットしない。
- リポジトリは **private** を推奨。
- 環境変数は `.env.local`（ローカル）＋ Vercel 環境変数で管理。

```bash
# .env.example （実値は入れない）
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

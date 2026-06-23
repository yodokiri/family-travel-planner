# 旅のしおり（Family Travel Planner）

家族旅行用の「旅のしおり」Web アプリ。ログイン不要で、共有 URL を知る家族が予定・画像・チェックリストを閲覧／編集できる。

## 技術構成

Next.js 16 (App Router) / React 19 / TypeScript / Tailwind CSS v4 / Supabase (PostgreSQL + Storage) / Vercel

## セットアップ

### 1. 依存インストール

```bash
npm install
```

### 2. Supabase プロジェクト作成とスキーマ適用

1. [supabase.com](https://supabase.com) でプロジェクトを作成。
2. SQL Editor で `supabase/schema.sql` を実行（テーブル・RLS・Storage bucket `trip-attachments` を作成）。
3. 続けて `supabase/seed.sql` を実行（チェックリストの初期テンプレート）。

### 3. 環境変数

`.env.local` を作成（`.env.example` 参照）:

```bash
SUPABASE_URL=...                 # Project Settings → API → Project URL
SUPABASE_SERVICE_ROLE_KEY=...    # 同 → service_role（サーバー専用・秘匿）
```

> service role key は `NEXT_PUBLIC_` を付けず、ブラウザに出さないこと。

### 4. 開発起動

```bash
npm run dev   # http://localhost:3000
```

### 5. 検証

```bash
npm run build
npm run lint
npm run typecheck
```

## デプロイ（Vercel）

1. GitHub に push（`.env*` はコミットしない）。
2. Vercel でリポジトリをインポート。
3. 環境変数 `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` を登録。
4. デプロイ。

## ドキュメント

- 仕様の正本: `Family_Travel_Planner_Plan.md`
- 実装要件: `docs/requirements.md`
- アプリ構成: `docs/app-structure.md`
- セキュリティ方針: `docs/security-policy.md`
- 残作業（環境構築・動作確認）: `docs/codex-handoff.md`

## セキュリティ要点

- 全データ操作は Next.js **Server Actions 経由**。ブラウザから Supabase へ直接アクセスしない。
- service role key は**サーバーのみ**（`NEXT_PUBLIC_` 禁止、anon key 不使用）。
- 全テーブルで **RLS 有効化＋ポリシーなし**（service role のみ通過）。
- 画像／PDF は **private bucket ＋ 署名付き URL**。
- アクセス制御は作り込まない（共有 URL を知る人は閲覧・編集可、権限分離なし）。
- 旅行ページは `noindex`（検索エンジン非掲載。アクセス制御ではない）。

## MVP の範囲外（未実装）

ログイン／権限管理／費用管理／Google Maps API／AI 自動プラン／終了時刻／ドラッグ&ドロップ／チェックリストの並び替え。

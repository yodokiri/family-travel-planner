# Codex 引き継ぎ — 残作業

Claude が Next.js 16 アプリのソース一式を実装済み。ローカルで **build / lint / typecheck はすべて通過**している。
残りは「環境セットアップ」と「実機（実 Supabase）での動作確認」。**コードの大規模改変は不要**。

---

## あなた（Codex）の作業手順

1. `npm install`
2. Supabase プロジェクトを作成し、SQL Editor で順に実行:
   - `supabase/schema.sql`（テーブル・RLS・Storage bucket）
   - `supabase/seed.sql`（チェックリストテンプレート）
3. Storage に bucket **`trip-attachments`（private）** が作成されていることを確認（`schema.sql` 内で作成）。
4. `.env.local` に `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` を設定（`.env.example` 参照）。
5. 検証コマンドがすべて通ることを確認:
   ```bash
   npm run build && npm run lint && npm run typecheck
   ```
6. `npm run dev` で下記チェックリストを手動確認。
7. GitHub へ push（`.env*` はコミットしない）→ Vercel デプロイ（環境変数を登録）。

---

## 動作確認チェックリスト

- [ ] 旅行を作成 → 共有 URL（`/trips/tk_...`）へ遷移
- [ ] 一覧に表示される／「共有 URL をコピー」が機能する
- [ ] 旅行の編集・削除（削除は確認ダイアログ）
- [ ] 代表画像をアップロード → 詳細ページ上部に表示
- [ ] 予定追加（開始時刻あり／`time_label`「昼頃」等）→ Day タブ切替で表示
- [ ] 予定カードの折りたたみ／展開、「上へ」「下へ」で並べ替え
- [ ] 地図ボタン：URL あり「地図を開く」（別タブ）／なし「地図を追加」
- [ ] 画像・PDF をアップロード（5MB まで）→ 画像タブに表示、クリックで署名 URL を開く
- [ ] 予定に紐づけた画像が、予定カードの画像ボタンに枚数表示される
- [ ] 画像削除（DB 行と Storage 実体の両方が消える）
- [ ] チェックリスト：テンプレ（一般／子ども連れ）適用、項目追加、完了チェック、削除、カテゴリ別表示
- [ ] 旅行削除時、その旅行の Storage 配下も削除される

---

## 変更してはいけない方針

- service role key を `NEXT_PUBLIC_` にしない／クライアントへ渡さない
- RLS にポリシーを追加しない（サーバー経由前提の設計）
- bucket を public にしない
- ログイン／Google Maps API／費用管理／終了時刻／D&D を追加しない

---

## 既知の MVP 範囲・未確定

- チェックリストの並び替えは未実装（受け入れ条件外）。必要なら別途。
- `trips.status`（planned/active/completed）は UI 非露出（既定 `planned` 固定）。
- 画像アップロードはサーバー経由（Server Action、上限 5MB / `next.config.ts` の `bodySizeLimit: 6mb`）。大容量が必要なら署名付きアップロード URL 方式への移行を検討。
- `AGENTS.md` / `CLAUDE.md` は create-next-app 生成（Next.js 16 のエージェント向け注意）。残してよい。

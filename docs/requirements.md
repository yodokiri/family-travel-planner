# Family Travel Planner — 要件定義（実装要件）

本書は `Family_Travel_Planner_Plan.md`（仕様の正本）を**補完**する実装要件である。
基本仕様・画面詳細・データモデルは Plan.md を参照すること。本書は「実装で確定した判断」と「MVP受け入れ条件」を定義する。

---

## 1. 確定した設計判断（Plan.md §26 Open Questions の解決）

| 項目 | 決定 |
|---|---|
| アクセス制御 | 作り込まない。`/` 一覧は全件表示でよい。`share_token` を知る人は閲覧・編集可（権限分離なし） |
| データアクセス | すべて Next.js Server Actions 経由。ブラウザから Supabase へ直接アクセスしない |
| Supabaseキー | service role のみ・サーバー専用（`NEXT_PUBLIC_` 禁止）。anon key は使わない |
| RLS | 全テーブル有効化＋ポリシーなし（service role のみ通過） |
| 画像Storage | private bucket ＋ 署名付きURL |
| share_token | `tk_` + 128bit乱数（base64url） |
| 予定削除時の画像 | `attachments.itinerary_item_id` を `SET NULL`（旅行全体の画像として残す） |
| 並び順 | Day内は `sort_order`。`start_time` は表示用情報 |
| 並べ替えUI | 「上へ／下へ」ボタン（D&Dは実装しない） |

---

## 2. スコープ

### 2.1 MVPに含む
- 旅行 CRUD、共有URL発行・表示
- 予定カード CRUD、Dayタブ、`sort_order` 並べ替え（上へ／下へ）、`time_label`、`transit_to_next_text`
- 画像アップロード／表示（署名付きURL）／削除、画像タブ
- チェックリスト（テンプレ適用、項目CRUD、完了チェック、カテゴリ別表示）

### 2.2 含まない（Plan.md §5）
ログイン／ユーザー権限管理／費用管理／AI自動プラン生成／Gmail抽出／予約サイト連携／Google Maps API／決済／ネイティブ化／本格オフライン／ドラッグ&ドロップ。

---

## 3. 画面（Plan.md §8）

| ルート | 役割 |
|---|---|
| `/` | 旅行一覧（全件 `created_at` 降順） |
| `/trips/new` | 新規旅行作成 |
| `/trips/[shareToken]` | 旅行詳細（予定／画像／チェックリストの3タブ） |
| `/trips/[shareToken]/edit` | 旅行基本情報の編集 |
| `/trips/[shareToken]/items/new` | 予定追加 |
| `/trips/[shareToken]/items/[itemId]/edit` | 予定編集 |

---

## 4. MVP受け入れ条件（Plan.md §24 準拠）

- **旅行**: 作成／一覧／詳細／編集／削除、共有URL発行、ログインなしで家族が閲覧・編集できる。
- **予定**: 追加／編集／削除、折りたたみ表示、タップで詳細展開、Dayタブで日付切替、`sort_order` 表示、上へ／下へ移動、時刻なし運用、`time_label` 表示（昼頃／時間があれば／雨なら 等）、終了時刻なし。
- **ボタン**: 地図ボタン（地図を開く／地図を追加）と画像ボタン（画像あり／画像 n枚／画像追加）を常時表示・出し分け。
- **画像**: アップロード、予定カードへの紐づけ、旅行全体への紐づけ、画像タブ一覧、開く、削除。
- **チェックリスト**: タブ表示、テンプレ（一般／子ども連れ）から作成、項目追加、完了チェック、削除。
- **UI**: スマホで見やすい、PCで旅行前に編集できる、旅のしおり風、地図・画像へのアクセスが分かりやすい。

---

## 5. 時刻・並び順ルール（Plan.md §13–14）

- 終了時刻は持たない。開始時刻は任意。
- 表示時刻の優先順位: `start_time` → `time_label` → 「時刻未定」。
- Day内の表示順は `sort_order`。`start_time` は並び順に使わない。

---

## 6. 未確定（要ユーザー判断）

- チェックリストテンプレ項目のカテゴリ分類の要否（現状 `seed` は `category = null`）。
- PDF添付をMVPに含めるか（現状 `attachments.file_type` に `pdf` あり）。含めない場合は受理を画像のみに制限。
- 旅行削除のUX（確認ダイアログ＋物理削除を想定）。
- `trips.status`（planned/active/completed）を表示・遷移に使うか。

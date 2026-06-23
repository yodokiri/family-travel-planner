# Next Chat Handoff — Family Travel Planner Web App

## 1. このチャットの目的

CodexまたはClaude Codeで、自分と家族用の旅行プランWebサイトを作るため、コードを書く前段階の計画書 `Plan.md` を作成することが目的だった。

最終ゴールは、家族旅行用の「旅のしおり」Webアプリを実装できる状態まで、要件・画面・データ構造・実装順序を明確にすること。

---

## 2. 新しいチャットに切り替える理由

会話が長くなり、要件・画面設計・データ構造・UI方針が増えてきたため、次のチャットでは以下をしやすくする。

- Plan.mdの続きから作業する
- 実装用のREADME.mdを作る
- Supabase schemaを具体化する
- Next.jsのディレクトリ構成を決める
- Codex / Claude Codeに渡す初回プロンプトを作る
- 実際の実装手順に入る

---

## 3. アプリの全体像

作るもの：

家族旅行用の「旅のしおり」Webアプリ。

特徴：

- 家族旅行が主用途
- 旅行前はPCで編集
- 旅行中はスマートフォンで閲覧・編集
- 家族も共有URLから閲覧・編集
- ログイン不要
- 権限分離なし
- デザインは見やすい旅のしおり
- 旅行名、代表画像、日程を上部に表示
- Dayタブで日ごとの予定を確認
- 予定、画像、チェックリストの3タブ構成
- 費用管理なし
- AI自動旅行プラン作成なし

---

## 4. 決定事項

### 4.1 利用者

- 自分
- 家族

家族も編集可能。  
権限は分けない。  
ログインは今後も不要。

---

### 4.2 旅行詳細ページ

最上部に置く情報：

- 旅行名
- 代表画像
- 日程

「今日の予定」を最上部に大きく表示する必要はない。  
Dayタブ選択で十分。

---

### 4.3 タブ構成

タブ名は以下で確定。

```text
予定｜画像｜チェックリスト
```

「しおり／予約画像／持ち物」などの案もあったが、機能名として分かりやすい「予定／画像／チェックリスト」を採用。

---

### 4.4 予定カード

ホテル、食事、移動、観光、休憩などはすべて「予定カード」として扱う。

カテゴリ：

- 移動
- 宿泊
- 食事
- 観光
- 買い物
- 休憩
- 子ども
- メモ
- その他

アイコンは必須ではない。

---

### 4.5 予定カードの表示

視認性を優先し、初期表示は短くする。  
タップで詳細が開く。

初期表示：

- 時刻または時刻ラベル
- タイトル
- カテゴリ
- 場所名
- 地図ボタン
- 画像ボタン
- 次への移動情報

詳細表示：

- メモ
- 予約URL
- 住所
- 画像一覧へのリンク
- 編集
- 削除
- 上へ
- 下へ

---

### 4.6 時刻

終了時刻は不要。  
開始時刻は任意。

時刻未定の予定を扱うため、`time_label` を持たせる。

例：

- 未定
- 朝
- 午前中
- 昼頃
- 午後
- 夕方
- 夜
- 時間があれば
- 雨なら
- 子ども次第
- 休憩候補
- 食事候補

Day内の並び順は時刻順ではなく `sort_order` で管理する。

理由：

- 時刻未定の予定をDayの途中に入れられる
- 「時間があれば」「雨なら」などの予定を自然な位置に置ける
- 将来ドラッグアンドドロップに移行しやすい

MVPではドラッグアンドドロップではなく、上へ／下へボタンで並び替える。

---

### 4.7 移動情報

移動情報は各カードの下に表示する。  
意味は「この予定から次の予定への移動」。

移動情報は自由入力。

例：

- 徒歩10分
- 徒歩10〜15分
- 雨ならタクシー
- ベビーカーありなら徒歩15分
- 電車で25分。〇〇駅から△△線
- 移動なし
- 未定

Google Maps APIでの自動計算は初期版では不要。

---

### 4.8 地図ボタンと画像ボタン

予定カードには、地図ボタンと画像ボタンを常に表示する。

地図URLあり：

```text
地図を開く
```

地図URLなし：

```text
地図を追加
```

画像あり：

```text
画像あり
```

複数枚：

```text
画像 2枚
```

画像なし：

```text
画像追加
```

---

### 4.9 画像

画像はサムネイル常時表示しない。  
ボタンから開く。

理由：

- スマートフォン表示が重くなりにくい
- 予定カードが長くなりすぎない
- 旅行中は必要時だけ開ければよい

画像タブでは、旅行全体の画像と予定に紐づく画像を一覧表示する。

想定画像：

- ホテル予約画面
- 航空券
- 新幹線予約
- 入場チケット
- QRコード
- レストラン予約
- 駐車場予約
- 施設案内
- 集合場所スクリーンショット

---

### 4.10 チェックリスト

チェックリストはDay内ではなく、旅行全体の別タブにする。

テンプレート化する。

初期テンプレート：

- 一般旅行テンプレート
- 子ども連れ旅行テンプレート

子ども関連カテゴリは有用。

---

### 4.11 予定追加・編集画面

実装しやすさを優先する。  
旅行前はPC編集が主だが、スマートフォンでも編集できるようにする。

初期実装では、PCでもスマートフォンでも同じ縦並びフォームでよい。

入力項目：

- タイトル
- カテゴリ
- 日付
- 開始時刻 任意
- 時刻ラベル 任意
- 場所名
- Google Mapsリンク
- 予約URL
- 画像追加
- メモ
- 次へ移動
- 予定の種類：確定／候補

---

## 5. データモデル

### 5.1 trips

| field | type | required | description |
|---|---|---:|---|
| id | uuid | yes | 内部ID |
| share_token | text | yes | 共有URL用トークン |
| title | text | yes | 旅行名 |
| destination | text | no | 目的地 |
| start_date | date | yes | 開始日 |
| end_date | date | yes | 終了日 |
| companions | text | no | 同行者 |
| cover_image_path | text | no | 代表画像の保存先 |
| memo | text | no | メモ |
| status | text | yes | planned / active / completed |
| created_at | timestamp | yes | 作成日時 |
| updated_at | timestamp | yes | 更新日時 |

---

### 5.2 itinerary_items

| field | type | required | description |
|---|---|---:|---|
| id | uuid | yes | 予定ID |
| trip_id | uuid | yes | 旅行ID |
| date | date | yes | 日付 |
| start_time | time | no | 開始時刻 |
| time_label | text | no | 曖昧な時刻表現 |
| category | text | yes | カテゴリ |
| title | text | yes | タイトル |
| place_name | text | no | 場所名 |
| address | text | no | 住所 |
| map_url | text | no | Google Mapsリンク |
| booking_url | text | no | 予約URL |
| memo | text | no | メモ |
| transit_to_next_text | text | no | 次の場所までの移動情報 |
| status | text | yes | confirmed / candidate |
| sort_order | integer | yes | Day内の表示順 |
| created_at | timestamp | yes | 作成日時 |
| updated_at | timestamp | yes | 更新日時 |

終了時刻は持たない。

---

### 5.3 attachments

| field | type | required | description |
|---|---|---:|---|
| id | uuid | yes | 添付ID |
| trip_id | uuid | yes | 旅行ID |
| itinerary_item_id | uuid | no | 紐づく予定ID |
| file_name | text | yes | ファイル名 |
| file_path | text | yes | 保存先 |
| file_type | text | yes | image / pdf / other |
| caption | text | no | 説明 |
| created_at | timestamp | yes | 作成日時 |

---

### 5.4 checklist_templates

| field | type | required | description |
|---|---|---:|---|
| id | uuid | yes | テンプレートID |
| name | text | yes | テンプレート名 |
| description | text | no | 説明 |
| created_at | timestamp | yes | 作成日時 |

---

### 5.5 checklist_template_items

| field | type | required | description |
|---|---|---:|---|
| id | uuid | yes | 項目ID |
| template_id | uuid | yes | テンプレートID |
| title | text | yes | 項目名 |
| category | text | no | カテゴリ |
| sort_order | integer | yes | 表示順 |

---

### 5.6 checklist_items

| field | type | required | description |
|---|---|---:|---|
| id | uuid | yes | チェック項目ID |
| trip_id | uuid | yes | 旅行ID |
| title | text | yes | 項目名 |
| category | text | no | カテゴリ |
| is_done | boolean | yes | 完了状態 |
| sort_order | integer | yes | 表示順 |

---

## 6. 推奨技術構成

- Next.js
- TypeScript
- Tailwind CSS
- Supabase
- PostgreSQL
- Supabase Storage
- Vercel
- GitHub

---

## 7. 次のチャットでやること

次の順番で進めるとよい。

1. Plan.mdを確認し、必要なら微修正
2. README.mdを作成
3. Supabase schemaをSQLで作成
4. Supabase Storageのbucket設計
5. Next.js App Routerのディレクトリ構成
6. UIコンポーネント一覧
7. Codex / Claude Codeに渡す初回実装プロンプト作成
8. GitHubリポジトリ作成手順
9. Phase 1実装に入る

---

## 8. 次のチャット用プロンプト

次のチャットでは、以下を貼れば続きから始められる。

```text
家族旅行用の「旅のしおり」WebアプリをCodex / Claude Codeで作る計画を進めています。

前チャットで、Plan.md v1.0 と NextChat_Handoff を作成済みです。
方針は以下です。

- 家族旅行用
- 家族も共有URLから閲覧・編集
- ログイン不要
- 権限分離なし
- 旅行前はPC編集、旅行中はスマホ閲覧・編集
- タブは「予定／画像／チェックリスト」
- 旅行詳細上部は旅行名、代表画像、日程
- 予定カードは折りたたみ式
- タップで詳細表示
- ホテル、食事、移動、観光などはすべて予定カード
- 終了時刻は不要
- 開始時刻は任意
- time_labelで「昼頃」「時間があれば」「雨なら」などを扱う
- Day内の順序は時刻順ではなくsort_order
- MVPでは上へ／下へボタンで並び替え
- 移動情報は各カード下に自由入力で表示
- 地図ボタンと画像ボタンは常に表示
- 画像はサムネイル常時表示せず、ボタンで開く
- チェックリストは別タブ
- チェックリストはテンプレート化
- 費用管理なし
- AI自動旅行プラン生成なし
- Google Maps APIは使わず、Google Maps URLを保存する
- 推奨技術は Next.js + TypeScript + Tailwind CSS + Supabase + Vercel

次は、Plan.mdに基づいてREADME.md、Supabase schema、Next.js App Router構成、Codex / Claude Code用の初回実装プロンプトを作成してください。
```

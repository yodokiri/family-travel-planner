# Claude依頼資料 — Family Travel Planner Web App

Version: v0.1  
Purpose: Claudeに渡して、家族旅行用「旅のしおり」Webアプリの設計・コード案・Codex実装指示を作成してもらうための日本語資料  
Final implementation: Codex  
Primary language: 日本語

---

## 1. この資料の目的

この資料は、家族旅行用「旅のしおり」Webアプリを実装するために、Claudeへ渡す指示書である。

Claudeには、実装前の仕様整理、設計、コード案、ファイル単位の実装案を作成してもらう。  
最終的な実装作業、リポジトリへの反映、動作確認、修正はCodexで行う。

したがって、Claudeの出力は次の条件を満たす必要がある。

- 日本語で説明する
- Codexがそのまま実装しやすい単位に分ける
- 1回の出力で巨大な実装を作りすぎない
- ファイル名、配置場所、役割を明記する
- 不明点は勝手に補完せず、Open Questionsに分ける
- セキュリティ上危険な実装を避ける
- 最終的にCodexへ渡す作業指示に変換しやすい形にする

---

## 2. 役割分担

### 2.1 Claudeの役割

Claudeは、設計・コード案作成担当である。

主な作業：

- 既存のPlan.mdを読み込む
- 仕様の矛盾や不足を指摘する
- 実装方針を整理する
- Supabaseのschema案を作る
- Storage設計案を作る
- Next.js App Router構成案を作る
- TypeScript型定義案を作る
- 主要コンポーネント設計案を作る
- Server FunctionsまたはRoute Handlersの方針を作る
- Codexに渡すための実装タスクを作る
- 必要に応じてファイル単位のコード案を作る

### 2.2 Codexの役割

Codexは、最終実装担当である。

主な作業：

- GitHubリポジトリ上で実装する
- ファイルを作成・編集する
- ビルド、型チェック、lintを実行する
- エラーを修正する
- 必要に応じて小さなPull Request単位に分ける
- 動作確認結果を報告する

### 2.3 ユーザーの役割

ユーザーは、仕様の最終判断を行う。

判断が必要な項目：

- 画面上の文言
- 初期MVPに含める範囲
- セキュリティ方針の許容範囲
- デザインの方向性
- 実装順序

---

## 3. アプリの概要

家族旅行用の「旅のしおり」Webアプリを作成する。

主な用途：

- 旅行前にPCで予定を作成・編集する
- 旅行中にスマートフォンで予定を確認する
- 家族が共有URLから同じ旅行ページを閲覧・編集する
- 予定、画像、チェックリストを1つのWebアプリで管理する

重要な特徴：

- ログインなし
- 権限分離なし
- 共有URLを知っている家族は閲覧・編集できる
- 旅程の自動生成はしない
- Google Maps APIは使わない
- Google Maps URLを保存する
- 費用管理は実装しない
- 見た目は管理画面ではなく、読みやすい「旅のしおり」に近づける

---

## 4. 確定済み仕様

### 4.1 基本方針

- 主用途は家族旅行
- 旅行ごとに1つのページを作る
- 家族に共有URLを送る
- 家族はログインなしで閲覧・編集できる
- 旅行前はPC編集を想定する
- 旅行中はスマートフォンでの閲覧・編集を想定する
- 初期版ではスマートフォン表示を優先する

### 4.2 旅行詳細ページ

旅行詳細ページの上部に表示するもの：

- 旅行名
- 代表画像
- 日程

大きな「今日の予定」エリアは不要。  
Dayタブで日ごとの予定を切り替える。

### 4.3 メインタブ

旅行詳細ページは3タブ構成にする。

```text
予定｜画像｜チェックリスト
```

### 4.4 予定カード

ホテル、食事、移動、観光、休憩、子ども関連などは、すべて予定カードとして扱う。

初期カテゴリ：

- 移動
- 宿泊
- 食事
- 観光
- 買い物
- 休憩
- 子ども
- メモ
- その他

予定カードの初期表示：

- 時刻または時刻ラベル
- タイトル
- カテゴリ
- 場所名
- 地図ボタン
- 画像ボタン
- 次への移動情報

予定カードの詳細表示：

- メモ
- 予約URL
- 住所
- 画像一覧へのリンク
- 編集ボタン
- 削除ボタン
- 上へ
- 下へ

予定カードは初期表示を短くし、タップで詳細を開く。

### 4.5 時刻

終了時刻は持たない。

開始時刻は任意。  
時刻未定や曖昧な予定は `time_label` で扱う。

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

表示優先順位：

1. `start_time` がある場合は `start_time`
2. `time_label` がある場合は `time_label`
3. どちらもない場合は「時刻未定」

### 4.6 並び順

Day内の予定表示は時刻順ではなく `sort_order` で管理する。

理由：

- 時刻未定の予定をDay内の自然な位置に入れられる
- 「昼頃」「雨なら」「時間があれば」を途中に置ける
- 旅行中の予定変更に対応しやすい
- 将来ドラッグアンドドロップに移行しやすい

MVPではドラッグアンドドロップを実装しない。  
代わりに「上へ」「下へ」ボタンで並び替える。

### 4.7 移動情報

移動情報は各カードの下に表示する。

意味：

```text
この予定 → 次の予定への移動情報
```

フィールド名：

```text
transit_to_next_text
```

自由入力とする。

例：

- 徒歩10分
- 徒歩10〜15分
- タクシーで約8分
- 雨ならタクシー
- ベビーカーありなら徒歩15分
- 電車で25分。〇〇駅から△△線
- 移動なし
- 未定

### 4.8 地図ボタン

地図ボタンは常に表示する。

Google Maps URLがある場合：

```text
地図を開く
```

Google Maps URLがない場合：

```text
地図を追加
```

Google Maps APIは使わない。  
URLを保存し、クリック時に別タブで開く。

### 4.9 画像ボタン

画像ボタンは常に表示する。

画像がある場合：

```text
画像あり
```

複数枚の場合：

```text
画像 2枚
```

画像がない場合：

```text
画像追加
```

予定カード内に画像サムネイルを常時表示しない。

### 4.10 画像タブ

画像タブでは、旅行全体の画像と予定カードに紐づく画像をまとめて一覧表示する。

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

### 4.11 チェックリスト

チェックリストはDay内ではなく、旅行全体の別タブで扱う。

初期テンプレート：

- 一般旅行テンプレート
- 子ども連れ旅行テンプレート

機能：

- テンプレートから一括追加
- 個別項目追加
- 完了チェック
- 項目削除
- 並び替え
- カテゴリ別表示

---

## 5. 初期版で実装しないもの

以下はMVPでは実装しない。

- ログイン
- ユーザー権限管理
- 管理者、編集者、閲覧者の分離
- 費用管理
- AIによる旅行プラン自動作成
- Gmailからの予約情報自動抽出
- 予約サイトとの自動連携
- Google Maps APIによる経路・所要時間の自動取得
- 決済機能
- ネイティブアプリ化
- 本格的なオフライン対応
- ドラッグアンドドロップによる並び替え

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

## 7. データモデル案

### 7.1 trips

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

### 7.2 itinerary_items

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

### 7.3 attachments

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

### 7.4 checklist_templates

| field | type | required | description |
|---|---|---:|---|
| id | uuid | yes | テンプレートID |
| name | text | yes | テンプレート名 |
| description | text | no | 説明 |
| created_at | timestamp | yes | 作成日時 |

### 7.5 checklist_template_items

| field | type | required | description |
|---|---|---:|---|
| id | uuid | yes | 項目ID |
| template_id | uuid | yes | テンプレートID |
| title | text | yes | 項目名 |
| category | text | no | カテゴリ |
| sort_order | integer | yes | 表示順 |

### 7.6 checklist_items

| field | type | required | description |
|---|---|---:|---|
| id | uuid | yes | チェック項目ID |
| trip_id | uuid | yes | 旅行ID |
| title | text | yes | 項目名 |
| category | text | no | カテゴリ |
| is_done | boolean | yes | 完了状態 |
| sort_order | integer | yes | 表示順 |

---

## 8. セキュリティ上の重要方針

ログインは実装しないが、予約画像、QRコード、日程情報を扱うため、最低限の保護は必須とする。

### 8.1 share_token

- 旅行ごとに推測困難な `share_token` を発行する
- 共有URLは `/trips/[shareToken]` とする
- `share_token` を知っている人は閲覧・編集できる
- 権限分離はしない

### 8.2 データアクセス

- `trip_id` だけで旅行データを取得・更新できる実装にしない
- 旅行データを取得・更新する処理では、必ず `share_token` と `trip_id` の対応を確認する
- ブラウザにSupabaseのservice role keyを出さない
- 環境変数はGitHubに含めない
- 実データ、予約番号、QRコード画像をGitHubに含めない

### 8.3 Storage

- 予約画像を扱うため、Storage bucketは原則privateとする
- 画像を表示するときは、サーバー側で `share_token` を確認したうえで署名付きURLを発行する
- public bucketに予約画像やQRコード画像を保存しない

### 8.4 検索エンジン対策

- 旅行詳細ページは検索エンジンに登録されないようにする
- `noindex` を設定する
- ただし、`noindex` はアクセス制御ではないため、実データ保護とは別に考える

---

## 9. Claudeに依頼したい成果物

Claudeは、以下を順番に作成する。

### 9.1 まず作るもの

1. `README.md` 案
2. `docs/requirements.md` 案
3. `docs/app-structure.md` 案
4. `docs/security-policy.md` 案
5. `supabase/schema.sql` 案
6. `supabase/seed.sql` 案
7. `docs/codex-implementation-plan.md` 案

### 9.2 次に作るもの

1. Next.js App Routerのディレクトリ構成案
2. TypeScript型定義案
3. Supabase client/server helper案
4. 旅行CRUDの実装案
5. 予定カードCRUDの実装案
6. 画像アップロードの実装案
7. チェックリストの実装案
8. UIコンポーネント一覧
9. Codexへ渡すPhase別実装プロンプト

---

## 10. Claudeの出力形式

Claudeは、原則として次の形式で出力する。

```text
## 1. 今回作るもの

## 2. 前提

## 3. 作成・変更するファイル一覧

| path | 目的 |
|---|---|

## 4. ファイル別の内容

### path/to/file

```該当言語
...
```

## 5. Codexに渡す実装指示

## 6. 動作確認項目

## 7. Open Questions
```

重要：

- コードを出す場合は、必ずファイルパスを明記する
- 複数ファイルを出す場合は、各ファイルの目的を明記する
- 未確定事項はOpen Questionsに分離する
- 仕様にない機能を勝手に追加しない
- MVPの範囲を超える実装は「将来案」に分ける

---

## 11. Claudeへの禁止事項

Claudeは以下を行わない。

- ログイン機能を追加しない
- ユーザー権限管理を追加しない
- 費用管理を追加しない
- Google Maps APIを追加しない
- AI旅行プラン自動生成を追加しない
- 終了時刻を追加しない
- ドラッグアンドドロップをMVPに入れない
- 画像サムネイルを予定カード内に常時表示しない
- `sort_order` ではなく時刻順だけで並び替える設計にしない
- Supabase service role keyをブラウザで使う設計にしない
- public bucketに予約画像を置く前提にしない
- 不明点を勝手に仕様化しない

---

## 12. 初回Claude依頼文

以下をClaudeに貼り付ける。

```text
あなたはWebアプリ設計と実装支援に詳しいエンジニアです。

これから、家族旅行用の「旅のしおり」Webアプリを作ります。
最終的な実装はCodexで行います。
あなたには、実装前の設計、コード案、ファイル単位の実装案、Codexに渡す作業指示を日本語で作成してほしいです。

添付するPlan.mdと、この依頼資料を仕様の正本として扱ってください。

重要な前提は以下です。

- 家族旅行用Webアプリ
- ログインなし
- 共有URLを知っている家族が閲覧・編集できる
- 権限分離なし
- 旅行前はPC編集、旅行中はスマートフォン閲覧・編集
- 旅行詳細ページは「予定｜画像｜チェックリスト」の3タブ
- 予定はDayタブで日ごとに表示
- ホテル、食事、移動、観光などはすべて予定カードとして扱う
- 予定カードは折りたたみ式
- 終了時刻は持たない
- 開始時刻は任意
- 曖昧な時刻は time_label で扱う
- Day内の順序は時刻順ではなく sort_order で管理する
- MVPではドラッグアンドドロップではなく「上へ」「下へ」で並び替える
- Google Maps APIは使わず、Google Maps URLを保存する
- 画像は予定カード内に常時サムネイル表示せず、画像ボタンから開く
- チェックリストは旅行全体の別タブで扱う
- 費用管理とAI旅行プラン自動生成は実装しない
- 技術構成は Next.js + TypeScript + Tailwind CSS + Supabase + PostgreSQL + Supabase Storage + Vercel を想定する

まず、以下を作成してください。

1. 仕様上の不足・矛盾・実装前に確認すべき点
2. README.md案
3. docs/requirements.md案
4. docs/app-structure.md案
5. docs/security-policy.md案
6. supabase/schema.sql案
7. supabase/seed.sql案
8. Codexに渡すPhase 1実装指示

出力条件：

- 日本語で書く
- ファイルごとに path と目的を明記する
- コードを出す場合はファイルパスを必ず付ける
- 不明点は Open Questions に分ける
- MVPに不要な機能を勝手に追加しない
- Supabase service role keyをブラウザに出す設計にしない
- 予約画像をpublic bucketに保存する設計にしない
- 最後に、Codexへそのまま貼れる実装プロンプトを作る
```

---

## 13. Claudeへの追加依頼文テンプレート

### 13.1 Supabase設計を深める依頼

```text
先ほどの仕様に基づいて、Supabase設計だけを詳しく作成してください。

作成してほしいもの：

1. schema.sql
2. RLS方針
3. private Storage bucket方針
4. 画像アップロードと署名付きURL発行の流れ
5. seed.sql
6. Codexへ渡すSupabase実装プロンプト

注意点：

- ログインは使わない
- share_tokenで旅行ページへのアクセスを制御する
- trip_idだけで取得・更新できる設計にしない
- service role keyをブラウザに出さない
- 予約画像やQRコード画像をpublic bucketに置かない
```

### 13.2 Next.js構成を作る依頼

```text
先ほどの仕様に基づいて、Next.js App Routerの構成を作成してください。

作成してほしいもの：

1. ディレクトリ構成
2. page.tsx / layout.tsx / components / lib / actions の配置案
3. TypeScript型定義案
4. Server FunctionsまたはRoute Handlersの使い分け
5. 旅行CRUDの実装方針
6. 予定カードCRUDの実装方針
7. 画像アップロードの実装方針
8. Codexへ渡すNext.js実装プロンプト

注意点：

- 画面はまずスマートフォン1カラムを優先する
- PCでも同じ縦並びフォームでよい
- MVPに不要な機能を追加しない
```

### 13.3 UI設計を作る依頼

```text
家族旅行用「旅のしおり」Webアプリとして、UI設計を作成してください。

作成してほしいもの：

1. 旅行一覧ページ
2. 新規旅行作成ページ
3. 旅行詳細ページ
4. 予定タブ
5. 画像タブ
6. チェックリストタブ
7. 予定追加・編集画面
8. 予定カードコンポーネント
9. モバイル表示の優先事項
10. Codexへ渡すUI実装プロンプト

注意点：

- 管理画面のように見えすぎない
- 読みやすい「旅のしおり」を目指す
- カードは短く表示し、タップで詳細を開く
- 地図ボタンと画像ボタンは常に表示する
- 画像サムネイルを予定カード内に常時表示しない
```

---

## 14. Codexへ引き継ぐときの条件

Claudeの出力をCodexに渡す前に、以下を確認する。

- 仕様にない機能が追加されていない
- ログイン機能が追加されていない
- 終了時刻が追加されていない
- Google Maps APIを使う設計になっていない
- 画像をpublic bucketに置く設計になっていない
- `sort_order` が予定表示の基本になっている
- 予定カードが折りたたみ式になっている
- チェックリストが旅行全体の別タブになっている
- Codexが実装できる粒度に分割されている
- ビルド、型チェック、lintの実行指示が含まれている

---

## 15. 最初にCodexへ渡す想定プロンプト

Claudeで設計・コード案を作成した後、Codexには次のような形で渡す。

```text
このリポジトリに、家族旅行用「旅のしおり」WebアプリのMVPを実装してください。

添付のPlan.md、Claude依頼資料、Claudeが作成した設計・コード案を仕様の正本として扱ってください。

今回の作業範囲はPhase 1です。

作業内容：

1. Next.js + TypeScript + Tailwind CSSの初期構成を確認または作成する
2. Supabase接続用の環境変数サンプルを作る
3. docs/requirements.md、docs/app-structure.md、docs/security-policy.mdを配置する
4. supabase/schema.sql、supabase/seed.sqlを配置する
5. アプリの基本ルーティングだけ作る
6. まだ本格的なUIやCRUDは実装しない

制約：

- ログインを追加しない
- Google Maps APIを追加しない
- 費用管理を追加しない
- AI旅行プラン生成を追加しない
- Supabase service role keyをブラウザで使わない
- 実データや予約画像をリポジトリに含めない

完了前に以下を実行してください。

- npm run build
- npm run lint
- npm run typecheck が設定されていれば実行

最後に、変更したファイル、確認結果、未対応事項を報告してください。
```

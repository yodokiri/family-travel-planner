# Family Travel Planner — アプリ構成

基本仕様は `Family_Travel_Planner_Plan.md` を参照。本書は Next.js App Router の実装構造を定義する。

---

## 1. ディレクトリ構成

```text
family-travel-planner/
├── README.md
├── .env.example
├── .gitignore
├── package.json
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
├── docs/
│   ├── requirements.md
│   ├── app-structure.md
│   └── security-policy.md
├── supabase/
│   ├── schema.sql
│   └── seed.sql
├── public/
└── src/
    ├── app/
    │   ├── layout.tsx                 # 全体レイアウト・metadata(noindex)
    │   ├── globals.css
    │   ├── page.tsx                   # 旅行一覧（全件）
    │   ├── robots.ts                  # disallow '/'
    │   └── trips/
    │       ├── new/page.tsx
    │       └── [shareToken]/
    │           ├── page.tsx           # 旅行詳細（3タブ）
    │           ├── not-found.tsx
    │           ├── edit/page.tsx
    │           └── items/
    │               ├── new/page.tsx
    │               └── [itemId]/edit/page.tsx
    ├── actions/                       # Server Actions（"use server"）
    │   ├── trips.ts
    │   ├── items.ts
    │   ├── attachments.ts
    │   └── checklist.ts
    ├── components/
    │   ├── trip/                      # TripHeader, TripForm, ShareUrl
    │   ├── itinerary/                 # TripTabs, DayTabs, ItineraryCard, ItemForm
    │   ├── image/                     # ImageTab, ImageButton, ImageViewer
    │   ├── checklist/                 # ChecklistTab, TemplatePicker
    │   └── ui/                        # Button, Tabs, Modal などの小物
    └── lib/
        ├── supabase/server.ts         # service roleクライアント（server only）
        ├── share-token.ts             # トークン生成・検証
        ├── categories.ts              # カテゴリ / time_label プリセット定数
        └── types.ts                   # DB行・フォーム型
```

---

## 2. レンダリング方針

- **取得系**: Server Component（`page.tsx`）内で `createServiceClient()` を使い、`shareToken` を検証してから取得。画像は署名付きURLを発行して props で渡す。
- **更新系**: Server Actions（`src/actions/*`、`"use server"`）。`<form action={...}>` で呼び、更新後 `revalidatePath` で再描画。
- **Client Component**: UI操作のみ（タブ切替、カード折りたたみ、確認ダイアログ）。データ取得処理・キーを持たせない。
- **Route Handlers（`app/api`）**: 原則不要。将来「署名付きアップロードURL方式」に移行する場合のみ追加。

---

## 3. ルートとファイルの対応

| ルート | ファイル | 種別 | 主処理 |
|---|---|---|---|
| `/` | `app/page.tsx` | Server | 全件一覧（`created_at` 降順） |
| `/trips/new` | `app/trips/new/page.tsx` | Server + Action | 作成 → `createTrip` |
| `/trips/[shareToken]` | `app/trips/[shareToken]/page.tsx` | Server | 検証 + 取得、3タブ表示 |
| 〃（無効token） | `app/trips/[shareToken]/not-found.tsx` | — | 404 |
| `/trips/[shareToken]/edit` | `.../edit/page.tsx` | Server + Action | 基本情報編集 → `updateTrip` |
| `/trips/[shareToken]/items/new` | `.../items/new/page.tsx` | Server + Action | 予定追加 → `createItem` |
| `/trips/[shareToken]/items/[itemId]/edit` | `.../items/[itemId]/edit/page.tsx` | Server + Action | 予定編集／削除／上下移動 |

---

## 4. 旅行詳細ページの構造

- `page.tsx`（Server）が予定・画像・チェックリストのデータを取得し、`TripTabs`（Client）に渡す。
- タブ切替: `?tab=schedule|images|checklist`（または Client state）。
- Dayタブ: `?day=YYYY-MM-DD`。日付候補は `start_date`〜`end_date` から生成。
- カード折りたたみ: Client state。
- 上へ／下へ: Server Action（隣接アイテムと `sort_order` を入替）。

---

## 5. Server Actions 一覧（シグネチャ案）

```ts
// src/actions/trips.ts
createTrip(form) / updateTrip(shareToken, form) / deleteTrip(shareToken)

// src/actions/items.ts
createItem(shareToken, form) / updateItem(shareToken, itemId, form)
deleteItem(shareToken, itemId) / moveItem(shareToken, itemId, 'up' | 'down')

// src/actions/attachments.ts
uploadAttachment(shareToken, file, itemId?) / deleteAttachment(shareToken, id)
getSignedUrls(shareToken, paths[])

// src/actions/checklist.ts
applyTemplate(shareToken, templateId) / addChecklistItem(shareToken, form)
toggleChecklistItem(shareToken, id) / deleteChecklistItem(shareToken, id)
moveChecklistItem(shareToken, id, 'up' | 'down')
```

各Actionは先頭で `shareToken → trip` を解決し、存在しなければ 404。`trip_id` 単独では受けない。

---

## 6. 型・定数

- `src/lib/types.ts`: 6テーブルの Row 型（`Trip`, `ItineraryItem`, `Attachment`, `ChecklistTemplate`, `ChecklistTemplateItem`, `ChecklistItem`）とフォーム型。
- `src/lib/categories.ts`: `ITINERARY_CATEGORIES`（移動／宿泊／食事／観光／買い物／休憩／子ども／メモ／その他）、`TIME_LABEL_PRESETS`。
- 可能なら `supabase gen types typescript` で生成した型をベースにする。

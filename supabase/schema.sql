-- Family Travel Planner — schema (MVP)
-- 前提: 認証なし。全データアクセスはサーバー(service role)経由。
--       RLSは有効化するがポリシーは作らない => anon/authenticated は全拒否。
--       service role は RLS をバイパスするためサーバーからのみ読み書き可能。
-- 適用: Supabase SQL Editor にこのファイルを貼って実行（その後 seed.sql）。

create extension if not exists pgcrypto;  -- gen_random_uuid()

-- updated_at 自動更新用トリガー関数
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =========================================================
-- trips: 旅行本体
-- =========================================================
create table if not exists trips (
  id               uuid primary key default gen_random_uuid(),
  share_token      text not null unique,
  title            text not null,
  destination      text,
  start_date       date not null,
  end_date         date not null,
  companions       text,
  cover_image_path text,
  memo             text,
  status           text not null default 'planned'
                     check (status in ('planned','active','completed')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  check (end_date >= start_date)
);

create index if not exists idx_trips_share_token on trips (share_token);

drop trigger if exists trg_trips_updated_at on trips;
create trigger trg_trips_updated_at
  before update on trips
  for each row execute function set_updated_at();

-- =========================================================
-- itinerary_items: 予定カード（終了時刻は持たない）
-- =========================================================
create table if not exists itinerary_items (
  id                   uuid primary key default gen_random_uuid(),
  trip_id              uuid not null references trips (id) on delete cascade,
  date                 date not null,
  start_time           time,
  time_label           text,
  category             text not null,             -- 将来追加のため DB 制約は付けない
  title                text not null,
  place_name           text,
  address              text,
  map_url              text,
  booking_url          text,
  memo                 text,
  transit_to_next_text text,
  status               text not null default 'confirmed'
                         check (status in ('confirmed','candidate')),
  sort_order           integer not null default 0,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

-- Day内表示は (trip_id, date) で絞り sort_order で並べる
create index if not exists idx_items_trip_date_sort
  on itinerary_items (trip_id, date, sort_order);

drop trigger if exists trg_items_updated_at on itinerary_items;
create trigger trg_items_updated_at
  before update on itinerary_items
  for each row execute function set_updated_at();

-- =========================================================
-- attachments: 画像/PDF 添付
--   予定削除時は SET NULL（添付は旅行全体の添付として残す）
-- =========================================================
create table if not exists attachments (
  id                uuid primary key default gen_random_uuid(),
  trip_id           uuid not null references trips (id) on delete cascade,
  itinerary_item_id uuid references itinerary_items (id) on delete set null,
  file_name         text not null,
  file_path         text not null,          -- bucket 'trip-attachments' 相対パス
  file_type         text not null
                      check (file_type in ('image','pdf','other')),
  caption           text,
  created_at        timestamptz not null default now()
);

create index if not exists idx_attachments_trip on attachments (trip_id);
create index if not exists idx_attachments_item on attachments (itinerary_item_id);

-- =========================================================
-- checklist_templates / checklist_template_items: テンプレート
-- =========================================================
create table if not exists checklist_templates (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  created_at  timestamptz not null default now()
);

create table if not exists checklist_template_items (
  id          uuid primary key default gen_random_uuid(),
  template_id uuid not null references checklist_templates (id) on delete cascade,
  title       text not null,
  category    text,
  sort_order  integer not null default 0,
  unique (template_id, title)  -- seed の再実行を冪等にする
);

create index if not exists idx_template_items_template
  on checklist_template_items (template_id, sort_order);

-- =========================================================
-- checklist_items: 旅行ごとの実チェック項目
-- =========================================================
create table if not exists checklist_items (
  id         uuid primary key default gen_random_uuid(),
  trip_id    uuid not null references trips (id) on delete cascade,
  title      text not null,
  category   text,
  is_done    boolean not null default false,
  sort_order integer not null default 0
);

create index if not exists idx_checklist_items_trip
  on checklist_items (trip_id, sort_order);

-- =========================================================
-- RLS: 全テーブル有効化・ポリシーなし（anon/authenticated 全拒否）
--      アクセスはサーバーの service role 経由のみ
-- =========================================================
alter table trips                    enable row level security;
alter table itinerary_items          enable row level security;
alter table attachments              enable row level security;
alter table checklist_templates      enable row level security;
alter table checklist_template_items enable row level security;
alter table checklist_items          enable row level security;

-- =========================================================
-- Storage: 予約画像/PDF 用の private bucket
--      表示はサーバーで share_token 検証後に署名付きURLを発行する
-- =========================================================
insert into storage.buckets (id, name, public)
values ('trip-attachments', 'trip-attachments', false)
on conflict (id) do nothing;

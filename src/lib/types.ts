// DB 各テーブルの行型。supabase gen types を使わず手書き（認証なし・鍵はサーバーのみ）。

export type TripStatus = "planned" | "active" | "completed";
export type ItemStatus = "confirmed" | "candidate";
export type FileType = "image" | "pdf" | "other";

export interface Trip {
  id: string;
  share_token: string;
  title: string;
  destination: string | null;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  companions: string | null;
  cover_image_path: string | null;
  memo: string | null;
  status: TripStatus;
  created_at: string;
  updated_at: string;
}

export interface ItineraryItem {
  id: string;
  trip_id: string;
  date: string; // YYYY-MM-DD
  start_time: string | null; // HH:MM[:SS]
  time_label: string | null;
  category: string;
  title: string;
  place_name: string | null;
  address: string | null;
  map_url: string | null;
  booking_url: string | null;
  memo: string | null;
  transit_to_next_text: string | null;
  status: ItemStatus;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Attachment {
  id: string;
  trip_id: string;
  itinerary_item_id: string | null;
  file_name: string;
  file_path: string;
  file_type: FileType;
  caption: string | null;
  created_at: string;
}

export interface ChecklistTemplate {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface ChecklistTemplateItem {
  id: string;
  template_id: string;
  title: string;
  category: string | null;
  sort_order: number;
}

export interface ChecklistItem {
  id: string;
  trip_id: string;
  title: string;
  category: string | null;
  is_done: boolean;
  sort_order: number;
}

import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * service role を使うサーバー専用クライアント。
 * RLS をバイパスするため、ブラウザへ絶対に渡さないこと（server-only で保護）。
 */
export function createServiceClient(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を環境変数に設定してください。",
    );
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

import "server-only";
import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import type { Trip } from "@/lib/types";

/** share_token から旅行を取得。無ければ null（Server Action 用）。 */
export async function findTripByShareToken(
  shareToken: string,
): Promise<Trip | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .eq("share_token", shareToken)
    .maybeSingle();
  if (error) throw error;
  return (data as Trip | null) ?? null;
}

/** share_token から旅行を取得。無ければ notFound()（ページ用）。 */
export async function getTripByShareToken(shareToken: string): Promise<Trip> {
  const trip = await findTripByShareToken(shareToken);
  if (!trip) notFound();
  return trip;
}

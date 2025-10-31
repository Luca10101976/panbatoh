import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import type { Database } from "@/types/supabase";

const supabase = createSupabaseBrowserClient();

export type Guide = Database["public"]["Tables"]["public_published_guides"]["Row"];

export async function getApprovedGuides(): Promise<Guide[]> {
  const { data, error } = await supabase
    .from("public_published_guides") // ✅ načítáme z view
    .select("*");

  if (error) {
    console.error("Error fetching approved guides:", error.message);
    return [];
  }

  return data ?? [];
}
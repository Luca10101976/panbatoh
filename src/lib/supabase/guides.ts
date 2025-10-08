import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import type { Database } from "@/types/supabase";

const supabase = createSupabaseBrowserClient();
type Guide = Database["public"]["Tables"]["guides"]["Row"];
export type { Guide };

export async function getApprovedGuides(): Promise<Guide[]> {
  const { data, error } = await supabase
    .from("guides")
    .select("id, name, profile_image, is_approved, created_at")
    .eq("is_approved", true);

  if (error) {
    console.error("Error fetching approved guides:", error.message);
    return [];
  }

  return data || [];
}

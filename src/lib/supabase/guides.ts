import type { Database } from "@/types/supabase";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";

// ✅ Typ odpovídá view
export type Guide = Database["public"]["Views"]["public_published_guides"]["Row"];

const supabase = createSupabaseBrowserClient();

export async function getApprovedGuides(): Promise<Guide[]> {
  const { data, error } = await supabase
    .from("public_published_guides") // ✅ view, ne tabulka
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Chyba při načítání průvodců:", error.message);
    return [];
  }

  return data ?? [];
}
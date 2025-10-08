import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import type { Database } from "@/types/supabase";

const supabase = createSupabaseBrowserClient();

export type Guide = Database["public"]["Tables"]["guides"]["Row"] & {
  countries: string;
  description: string;
};

export async function getApprovedGuides(): Promise<Guide[]> {
  const { data, error } = await supabase
    .from("guides")
    .select("*")
    .eq("is_approved", true);

  if (error) {
    console.error("Error fetching approved guides:", error.message);
    return [];
  }

  return (data || []).map((g) => ({
    ...g,
    countries: g.countries ?? "",
    description: g.description ?? "",
  }));
}
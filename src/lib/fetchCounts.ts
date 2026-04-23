// src/lib/fetchCounts.ts
import { supabase } from "./supabaseClient";
import { PostgrestError } from "@supabase/supabase-js";

type CountResponse = {
  count: number | null;
  error: PostgrestError | null;
  data: null;
  status: number;
  statusText: string;
};

// Povolené admin view – přesné literály kvůli TS typování
type AdminTable =
  | "admin_guides"
  | "admin_itineraries"
  | "admin_reviews"
  | "admin_guide_photos";

export const fetchCounts = async () => {
  const tables: AdminTable[] = [
    "admin_guides",
    "admin_itineraries",
    "admin_reviews",
    "admin_guide_photos",
  ];

  const getCount = async (table: AdminTable): Promise<number> => {
    const { count, error } = (await supabase
      .from(table)
      .select("id", { head: true, count: "exact" })) as CountResponse;

    if (error) {
      console.error(`Chyba při čtení z ${table}:`, error);
      return 0;
    }
    return count ?? 0;
  };

  const [guides, itineraries, reviews, photos] = await Promise.all(
    tables.map((t) => getCount(t))
  );

  return { guides, itineraries, reviews, photos };
};
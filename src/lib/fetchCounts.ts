import { supabase } from "./supabaseClient";
import { PostgrestError } from "@supabase/supabase-js";

type CountResponse = {
  count: number | null;
  error: PostgrestError | null;
  data: null;
  status: number;
  statusText: string;
};

export const fetchCounts = async () => {
  const guides = await supabase
    .from("guides")
    .select("id", { head: true, count: "exact" }) as CountResponse;

  const itineraries = await supabase
    .from("itineraries")
    .select("id", { head: true, count: "exact" }) as CountResponse;

  const reviews = await supabase
    .from("reviews")
    .select("id", { head: true, count: "exact" }) as CountResponse;

  const photos = await supabase
    .from("itinerary_day_photos")
    .select("id", { head: true, count: "exact" }) as CountResponse;

  return {
    guides: guides.count ?? 0,
    itineraries: itineraries.count ?? 0,
    reviews: reviews.count ?? 0,
    photos: photos.count ?? 0,
  };
};
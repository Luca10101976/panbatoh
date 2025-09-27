"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type PublicItinerary = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  country: string;
  created_at: string;
  guide_id: string; // UUID = string
  guide_name: string;
  guide_photo: string;
  guide_languages: string[];
  guide_experience: string;
};

export default function PublicItinerariesPage() {
  const [itineraries, setItineraries] = useState<PublicItinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItineraries = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("public_published_itineraries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setItineraries(data || []);
      }
      setLoading(false);
    };

    fetchItineraries();
  }, []);

  if (loading) return <p>⏳ Načítám itineráře...</p>;
  if (error) return <p className="text-red-600">❌ Chyba: {error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">🗺️ Itineráře od našich průvodců</h1>
      <p className="text-sm text-gray-400 mb-4">✅ Testovací změna – ověřujeme správné nasazení z GitHubu</p>

      {itineraries.length === 0 ? (
        <p>Žádné itineráře zatím nejsou publikovány.</p>
      ) : (
        <div className="grid gap-6">
          {itineraries.map((itinerary) => (
            <Link
              key={itinerary.id}
              href={`/itineraries/${itinerary.slug}`}
              className="block p-4 border rounded-lg shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold">{itinerary.title}</h2>
              <p className="text-gray-600 mt-1">{itinerary.summary}</p>
              <p className="text-sm mt-2 text-gray-500">
                🌍 {itinerary.country} | 👤 {itinerary.guide_name}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
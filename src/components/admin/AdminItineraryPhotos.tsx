"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

type Photo = {
  id: number;
  day_id: number;
  photo_url: string;
  caption: string | null;
  created_at: string;
};

export default function AdminItineraryPhotos() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      const { data, error } = await supabase
        .from("itinerary_day_photos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setPhotos(data || []);
      }
      setLoading(false);
    };

    fetchPhotos();
  }, []);

  if (loading) return <p>⏳ Načítám fotky…</p>;
  if (error) return <p style={{ color: "red" }}>❌ {error}</p>;

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4">Fotky k itinerářům</h2>
      {photos.length === 0 ? (
        <p>Žádné fotky zatím nejsou.</p>
      ) : (
        <ul className="space-y-3">
          {photos.map((p) => (
            <li
              key={p.id}
              className="border p-3 rounded flex justify-between items-center"
            >
              <div>
                <p className="text-sm text-gray-600">{p.caption || "Bez popisku"}</p>
                <p className="text-xs text-gray-500">
                  {new Date(p.created_at).toLocaleString()}
                </p>
              </div>
              <img
                src={p.photo_url}
                alt={p.caption || "itinerary photo"}
                className="w-32 h-20 object-cover rounded"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Photo = {
  id: number;
  day_id: number;
  photo_url: string;
  caption: string | null;
  created_at: string;
};

export default function GaleriePage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("public_itinerary_day_photos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
        setPhotos([]);
      } else {
        setPhotos(data || []);
      }
      setLoading(false);
    };

    fetchPhotos();
  }, []);

  if (loading) return <div className="p-6">⏳ Načítám galerii…</div>;
  if (error)
    return <div className="p-6 text-red-600">❌ Chyba: {error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">📷 Galerie cest</h1>

      {photos.length === 0 ? (
        <p className="text-gray-600">Zatím žádné schválené fotky.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {photos.map((p) => (
            <figure
              key={p.id}
              className="border rounded overflow-hidden bg-gray-50 shadow-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.photo_url}
                alt={p.caption ?? ""}
                className="w-full h-48 object-cover"
              />
              {p.caption && (
                <figcaption className="p-2 text-sm text-gray-700">
                  {p.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
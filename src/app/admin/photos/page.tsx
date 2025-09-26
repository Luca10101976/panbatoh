"use client";

import { useEffect, useState } from "react";
import Image from "next/image"; // ✅ přidáno
import { supabase } from "../../../supabaseClient";

type Photo = {
  id: number;
  day_id: number;
  photo_url: string;
  caption: string | null;
  approved: boolean;
  created_at: string;
};

export default function AdminPhotosPage() {
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

  const toggleApproval = async (id: number, approved: boolean) => {
    const { error } = await supabase
      .from("itinerary_day_photos")
      .update({ approved: !approved })
      .eq("id", id);

    if (error) {
      alert("❌ Chyba při změně schválení: " + error.message);
    } else {
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, approved: !approved } : p
        )
      );
    }
  };

  if (loading) return <p>⏳ Načítám fotky…</p>;
  if (error) return <p style={{ color: "red" }}>❌ {error}</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Fotky k itinerářům</h1>
      {photos.length === 0 ? (
        <p>Žádné fotky zatím nejsou.</p>
      ) : (
        <ul className="space-y-4">
          {photos.map((p) => (
            <li
              key={p.id}
              className="border p-4 rounded flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <Image
                  src={p.photo_url}
                  alt={p.caption || "Foto"}
                  width={128}   // ✅ povinné
                  height={128}  // ✅ povinné
                  className="w-32 h-32 object-cover rounded border"
                />
                <div>
                  <p className="font-semibold">{p.caption || "Bez popisu"}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(p.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => toggleApproval(p.id, p.approved)}
                className={`px-3 py-1 rounded ${
                  p.approved
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
              >
                {p.approved ? "Zamítnout" : "Schválit"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
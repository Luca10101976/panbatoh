"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

type Itinerary = {
  id: number;
  guide_id: string;
  title: string;
  description: string | null;
  approved: boolean;
  created_at: string;
};

export default function AdminItineraries() {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItineraries = async () => {
      const { data, error } = await supabase
        .from("itineraries")
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

  const toggleApproval = async (id: number, approved: boolean) => {
    const { error } = await supabase
      .from("itineraries")
      .update({ approved: !approved })
      .eq("id", id);

    if (error) {
      alert("Chyba při změně schválení: " + error.message);
    } else {
      setItineraries((prev) =>
        prev.map((it) =>
          it.id === id ? { ...it, approved: !approved } : it
        )
      );
    }
  };

  if (loading) return <p>⏳ Načítám itineráře…</p>;
  if (error) return <p style={{ color: "red" }}>❌ {error}</p>;

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4">Itineráře</h2>
      {itineraries.length === 0 ? (
        <p>Žádné itineráře zatím nejsou.</p>
      ) : (
        <ul className="space-y-3">
          {itineraries.map((it) => (
            <li
              key={it.id}
              className="border p-3 rounded flex justify-between items-center"
            >
              <div>
                <strong>{it.title}</strong>
                <p className="text-sm text-gray-600">{it.description}</p>
                <p className="text-xs text-gray-500">
                  {new Date(it.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => toggleApproval(it.id, it.approved)}
                className={`px-3 py-1 rounded ${
                  it.approved
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
              >
                {it.approved ? "Zamítnout" : "Schválit"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
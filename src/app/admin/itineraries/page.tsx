"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import ItineraryForm from "../../../components/ItineraryForm";
import ItineraryDaysForm from "../../../components/ItineraryDaysForm";

type Itinerary = {
  id: number;
  title: string;
  description: string;
  approved: boolean;
  guide_id: string;
};

export default function ItinerariesAdminPage() {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItineraries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("itineraries")
      .select("id, title, description, approved, guide_id")
      .order("id", { ascending: true });

    if (error) setError(error.message);
    else setItineraries(data || []);

    setLoading(false);
  };

  useEffect(() => {
    fetchItineraries();
  }, []);

  const toggleApproval = async (id: number, approved: boolean) => {
    const { error } = await supabase
      .from("itineraries")
      .update({ approved: !approved })
      .eq("id", id);

    if (error) alert("❌ Chyba při změně stavu: " + error.message);
    else fetchItineraries();
  };

  if (loading) return <p>⏳ Načítám itineráře...</p>;
  if (error) return <p className="text-red-600">❌ Chyba: {error}</p>;

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <h2 className="text-2xl font-bold">Správa itinerářů</h2>

      {/* Formulář pro nový itinerář – po uložení refresh */}
      <ItineraryForm onCreated={fetchItineraries} />

      {itineraries.length === 0 ? (
        <p>Žádné itineráře k zobrazení.</p>
      ) : (
        itineraries.map((it) => (
          <div key={it.id} className="border p-4 rounded shadow mb-6">
            <h3 className="font-bold text-lg">
              {it.title}{" "}
              <span className="text-sm text-gray-500">(ID: {it.id})</span>
            </h3>
            <p className="text-gray-700">{it.description}</p>
            <p className="mt-1">
              Stav:{" "}
              {it.approved ? (
                <span className="text-green-600">✅ Schváleno</span>
              ) : (
                <span className="text-red-600">❌ Čeká na schválení</span>
              )}
            </p>

            <button
              onClick={() => toggleApproval(it.id, it.approved)}
              className={`mt-2 px-3 py-1 rounded text-white ${
                it.approved ? "bg-red-600" : "bg-green-600"
              }`}
            >
              {it.approved ? "Zamítnout" : "Schválit"}
            </button>

            <div className="mt-4">
              <ItineraryDaysForm itineraryId={it.id} onDayAdded={fetchItineraries} />
            </div>
          </div>
        ))
      )}
    </div>
  );
}
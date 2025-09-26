"use client";

import { useState } from "react";
import { supabase } from "../supabaseClient";

export type ItineraryFormProps = {
  onCreated?: (newId?: number) => void; // zůstává stejné
};

export default function ItineraryForm({ onCreated }: ItineraryFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData.user) {
      setLoading(false);
      setError("Nejste přihlášena/ý.");
      return;
    }
    const guide_id = userData.user.id;

    const { data, error } = await supabase
      .from("itineraries")
      .insert([{ title, description, approved: false, guide_id }])
      .select("id")
      .single();

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    const newId = data?.id as number | undefined;
    if (!newId) {
      setError("Itinerář byl uložen, ale nepodařilo se získat jeho ID.");
      return;
    }

    setTitle("");
    setDescription("");
    onCreated?.(newId);
  };

  return (
    <div className="bg-white border rounded-xl shadow p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">➕ Přidat nový itinerář</h3>

      {error && <p className="text-red-600 mb-3">❌ {error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Název itineráře</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Např. 3 dny v Panamě"
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Popis</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Stručný popis itineráře…"
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Ukládám…" : "💾 Uložit itinerář"}
        </button>
      </form>
    </div>
  );
}
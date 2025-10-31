"use client";

import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

type Props = {
  onSave: () => void;
};

export default function CreateItineraryForm({ onSave }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // ✅ 1. Zjisti přihlášeného uživatele
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData?.user) {
      setError("Musíš být přihlášený.");
      return;
    }

    // ✅ 2. Najdi průvodce podle user_id
    const { data: guide, error: guideError } = await supabase
      .from("guides")
      .select("user_id")
      .eq("user_id", userData.user.id)
      .maybeSingle();

    if (guideError || !guide?.user_id) {
      setError("Nepodařilo se najít průvodcovský profil.");
      return;
    }

    if (!title.trim()) {
      setError("Název itineráře je povinný.");
      return;
    }

    setLoading(true);

    // ✅ 3. Ulož itinerář s UUID (ne číslem!)
    const { error: insertError } = await supabase
      .from("itineraries")
      .insert({
        guide_id: guide.user_id, // správný UUID
        title,
        description,
        approved: false,
      });

    setLoading(false);

    if (insertError) {
      setError("Chyba při ukládání: " + insertError.message);
    } else {
      setTitle("");
      setDescription("");
      onSave();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div>
        <label className="block text-sm font-medium">Název</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="Např. Průvodce po džungli"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Popis</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          rows={3}
          placeholder="Krátký popis itineráře"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Ukládám…" : "Vytvořit itinerář"}
      </button>
    </form>
  );
}
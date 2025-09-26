"use client";

import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

type Props = {
  itineraryId: number;
  onDayAdded?: () => Promise<void>; // ✅ async callback (může být awaited)
  onCancel?: () => void;
};

export default function ItineraryDaysForm({ itineraryId, onDayAdded, onCancel }: Props) {
  const [dayNumber, setDayNumber] = useState<number>(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // zjistí další číslo dne
  useEffect(() => {
    let alive = true;
    (async () => {
      const { data, error } = await supabase
        .from("itinerary_days")
        .select("day_number")
        .eq("itinerary_id", itineraryId)
        .order("day_number", { ascending: false })
        .limit(1);

      if (!alive) return;
      if (error) {
        console.warn("Nelze zjistit další číslo dne:", error.message);
        return;
      }
      const next = ((data?.[0]?.day_number as number | undefined) ?? 0) + 1;
      setDayNumber(next);
    })();
    return () => {
      alive = false;
    };
  }, [itineraryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const { error } = await supabase.from("itinerary_days").insert([
      {
        itinerary_id: itineraryId,
        day_number: dayNumber,
        title,
        description,
      },
    ]);

    setLoading(false);

    if (error) {
      setErr(error.message);
      return;
    }

    setTitle("");
    setDescription("");

    // pokud parent poslal callback, zavoláme ho
    if (onDayAdded) {
      await onDayAdded();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-3 rounded border bg-white p-4">
      <h4 className="font-semibold">➕ Přidat den</h4>
      {err && <p className="text-red-600">❌ {err}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Číslo dne</label>
          <input
            type="number"
            min={1}
            value={dayNumber}
            onChange={(e) => setDayNumber(parseInt(e.target.value || "1", 10))}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">Nadpis dne (volitelné)</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Např. Přesun do Říma & večerní procházka"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Popis (volitelné)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded px-3 py-2"
          rows={3}
          placeholder="Co se bude dít během dne…"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {loading ? "Ukládám…" : "💾 Uložit den"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded border bg-gray-50 hover:bg-gray-100"
          >
            Zrušit
          </button>
        )}
      </div>
    </form>
  );
}
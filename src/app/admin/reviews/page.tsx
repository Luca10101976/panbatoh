"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Review = {
  id: number;
  user_id: string;
  guide_id: number;
  content: string;
  rating: number;
  approved: boolean;
  created_at: string;
};

export default function ReviewsAdminPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Načtení recenzí
  const fetchReviews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setReviews([]);
    } else {
      // 🔧 Oprava typu místo "any"
      setReviews(
        (data || []).map((r: Record<string, unknown>) => ({
          ...(r as Omit<Review, "approved">),
          approved: r.is_approved as boolean,
        }))
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Schválení / zamítnutí
  const toggleApproval = async (id: number, approved: boolean) => {
    const { error } = await supabase
      .from("reviews")
      .update({ is_approved: approved }) // 🔧 správný název sloupce
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("❌ Chyba při změně stavu recenze");
    } else {
      fetchReviews();
    }
  };

  if (loading) return <p>⏳ Načítám recenze…</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Správa recenzí</h1>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Obsah</th>
            <th className="p-2 text-left">Hodnocení</th>
            <th className="p-2 text-left">Schváleno</th>
            <th className="p-2 text-left">Akce</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((r) => (
            <tr key={r.id} className="border-b">
              <td className="p-2">{r.id}</td>
              <td className="p-2">{r.content}</td>
              <td className="p-2">⭐ {r.rating}</td>
              <td className="p-2">{r.approved ? "✅ Ano" : "❌ Ne"}</td>
              <td className="p-2 space-x-2">
                {r.approved ? (
                  <button
                    onClick={() => toggleApproval(r.id, false)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Zamítnout
                  </button>
                ) : (
                  <button
                    onClick={() => toggleApproval(r.id, true)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Schválit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
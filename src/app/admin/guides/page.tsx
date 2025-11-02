"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import type { Database } from "@/types/supabase";

type GuideRow = Database["public"]["Tables"]["guides"]["Row"];
type GuideUpdate = Database["public"]["Tables"]["guides"]["Update"];

export default function GuidesAdminPage() {
  const [guides, setGuides] = useState<GuideRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGuide, setSelectedGuide] = useState<GuideRow | null>(null);

  // ✅ Načtení všech průvodců
  const fetchGuides = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("guides").select("*");

    if (error) {
      console.error("Chyba při načítání průvodců:", error);
      setGuides([]);
    } else {
      setGuides(data as GuideRow[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchGuides();
  }, []);

  // ✅ Schválení nebo zamítnutí průvodce
  const toggleApproval = async (id: string, isApproved: boolean) => {
    const updateData: GuideUpdate = { is_approved: isApproved };

    const { error } = await supabase
      .from("guides")
      .update(updateData)
      .eq("id", id);

    if (error) {
      console.error("Chyba při schvalování:", error);
      alert("❌ Chyba při schvalování průvodce");
    } else {
      fetchGuides();
    }
  };

  if (loading) return <p>⏳ Načítám průvodce...</p>;

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Správa průvodců</h1>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Jméno</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Schváleno</th>
            <th className="p-2 text-left">Akce</th>
          </tr>
        </thead>
        <tbody>
          {guides.map((g) => (
            <tr key={g.id} className="border-b">
              <td className="p-2">{g.id}</td>
              <td className="p-2">{g.name}</td>
              <td className="p-2">{g.email}</td>
              <td className="p-2">{g.is_approved ? "✅ Ano" : "❌ Ne"}</td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => setSelectedGuide(g)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Detail
                </button>
                {g.is_approved ? (
                  <button
                    onClick={() => toggleApproval(g.id!, false)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Zamítnout
                  </button>
                ) : (
                  <button
                    onClick={() => toggleApproval(g.id!, true)}
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

      {selectedGuide && (
        <div className="mt-8 p-4 border rounded bg-gray-50">
          <h2 className="text-xl font-bold mb-3">Detail průvodce</h2>
          <p><strong>Jméno:</strong> {selectedGuide.name}</p>
          <p><strong>Email:</strong> {selectedGuide.email}</p>
          <p><strong>Popis:</strong> {selectedGuide.description}</p>
          <p><strong>Zkušenosti:</strong> {selectedGuide.experience}</p>
          <p><strong>Jazyky:</strong> {selectedGuide.languages}</p>
          <p><strong>Země:</strong> {selectedGuide.destination}</p>

          {selectedGuide.profile_image && (
            <Image
              src={selectedGuide.profile_image}
              alt="Profilová fotka"
              width={128}
              height={128}
              className="mt-3 h-32 w-32 object-cover rounded shadow"
            />
          )}

          <button
            onClick={() => setSelectedGuide(null)}
            className="mt-4 bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
          >
            Zavřít
          </button>
        </div>
      )}
    </div>
  );
}
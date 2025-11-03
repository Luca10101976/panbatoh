"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchCounts } from "@/lib/fetchCounts";

type Counts = {
  guides: number;
  itineraries: number;
  reviews: number;
  photos: number;
};

export default function AdminDashboardOverview() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchCounts();
        setCounts(data);
      } catch (err) {
        console.error("Chyba při načítání přehledu:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <p>⏳ Načítám přehled…</p>;
  if (!counts) return <p>Nelze načíst počty.</p>;

  return (
    <div className="grid grid-cols-2 gap-6 mt-6">
      <Link href="/admin/guides" className="p-6 border rounded shadow hover:bg-gray-50">
        <h2 className="text-xl font-bold">Průvodci</h2>
        <p className="text-2xl">{counts.guides}</p>
      </Link>

      <Link href="/admin/itineraries" className="p-6 border rounded shadow hover:bg-gray-50">
        <h2 className="text-xl font-bold">Itineráře</h2>
        <p className="text-2xl">{counts.itineraries}</p>
      </Link>

      <Link href="/admin/reviews" className="p-6 border rounded shadow hover:bg-gray-50">
        <h2 className="text-xl font-bold">Recenze</h2>
        <p className="text-2xl">{counts.reviews}</p>
      </Link>

      <Link href="/admin/photos" className="p-6 border rounded shadow hover:bg-gray-50">
        <h2 className="text-xl font-bold">Fotky</h2>
        <p className="text-2xl">{counts.photos}</p>
      </Link>
    </div>
  );
}
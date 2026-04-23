// src/components/admin/AdminDashboardOverview.tsx
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

  if (loading) return <p>Načítám přehled…</p>;
  if (!counts) return <p>Nepodařilo se načíst data.</p>;

  const { guides, itineraries, reviews, photos } = counts;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition">
        <h3 className="text-sm text-gray-500">Průvodci</h3>
        <p className="text-3xl font-bold mt-2">{guides}</p>
        <Link href="/admin/guides" className="text-sm text-blue-600 hover:underline mt-1 inline-block">
          Zobrazit
        </Link>
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition">
        <h3 className="text-sm text-gray-500">Itineráře</h3>
        <p className="text-3xl font-bold mt-2">{itineraries}</p>
        <Link href="/admin/itineraries" className="text-sm text-blue-600 hover:underline mt-1 inline-block">
          Zobrazit
        </Link>
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition">
        <h3 className="text-sm text-gray-500">Recenze</h3>
        <p className="text-3xl font-bold mt-2">{reviews}</p>
        <Link href="/admin/reviews" className="text-sm text-blue-600 hover:underline mt-1 inline-block">
          Zobrazit
        </Link>
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition">
        <h3 className="text-sm text-gray-500">Fotky</h3>
        <p className="text-3xl font-bold mt-2">{photos}</p>
        <Link href="/admin/photos" className="text-sm text-blue-600 hover:underline mt-1 inline-block">
          Zobrazit
        </Link>
      </div>
    </div>
  );
}
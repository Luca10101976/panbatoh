"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

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
    const fetchCounts = async () => {
      const g = await supabase
        .from("guides")
        .select("id", { head: true, count: "exact" })
        .eq("approved", false);

      const i = await supabase
        .from("itineraries")
        .select("id", { head: true, count: "exact" })
        .eq("approved", false);

      const r = await supabase
        .from("reviews")
        .select("id", { head: true, count: "exact" })
        .eq("approved", false);

      const p = await supabase
        .from("itinerary_day_photos")
        .select("id", { head: true, count: "exact" })
        .eq("approved", false);

      setCounts({
        guides: g.count ?? 0,
        itineraries: i.count ?? 0,
        reviews: r.count ?? 0,
        photos: p.count ?? 0,
      });
      setLoading(false);
    };

    fetchCounts();
  }, []);

  if (loading) return <p>⏳ Načítám přehled…</p>;
  if (!counts) return <p>Nelze načíst počty.</p>;

  return (
    <div className="grid grid-cols-2 gap-6 mt-6">
      <Link
        href="/admin/guides"
        className="p-6 border rounded shadow hover:bg-gray-50"
      >
        <h2 className="text-xl font-bold">Průvodci</h2>
        <p className="text-2xl">{counts.guides}</p>
      </Link>
      <Link
        href="/admin/itineraries"
        className="p-6 border rounded shadow hover:bg-gray-50"
      >
        <h2 className="text-xl font-bold">Itineráře</h2>
        <p className="text-2xl">{counts.itineraries}</p>
      </Link>
      <Link
        href="/admin/reviews"
        className="p-6 border rounded shadow hover:bg-gray-50"
      >
        <h2 className="text-xl font-bold">Recenze</h2>
        <p className="text-2xl">{counts.reviews}</p>
      </Link>
      <Link
        href="/admin/photos"
        className="p-6 border rounded shadow hover:bg-gray-50"
      >
        <h2 className="text-xl font-bold">Fotky</h2>
        <p className="text-2xl">{counts.photos}</p>
      </Link>
    </div>
  );
}
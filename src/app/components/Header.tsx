"use client";
"use client";

import type { Database } from "@/types/supabase";
type User = Database["public"]["Tables"]["users"]["Row"];

import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full border-b border-[#8ECAE6] bg-white">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-[#0077B6] font-bold text-lg">
          Pan Batoh
        </Link>
        <nav className="flex gap-4 text-sm">
          <Link href="/" className="hover:underline">
            Vybalený batoh
          </Link>
          <Link href="/pruvodci" className="hover:underline">
            Průvodci
          </Link>
          <Link href="/itinerare" className="hover:underline">
            Itineráře
          </Link>
          <Link href="/vylety" className="hover:underline">
            Výlety
          </Link>
          <Link href="/guide/dashboard" className="text-green-700 font-semibold hover:underline">
            Můj dashboard
          </Link>
          <Link href="/admin" className="text-blue-700 font-semibold hover:underline">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
"use client";

import GlobalHero from "./components/GlobalHero";
import Link from "next/link";
import GuidesTeaser from "./components/GuidesTeaser";

export default function Page() {
  const mockGuides = [
    {
      id: 1,
      name: "Pan Batoh",
      countries: "Česká republika, Kostarika",
      description: "Nadšený průvodce džunglí i městy",
      image: "/batoh.jpg", // ✅ přejmenováno z photograph
    },
    {
      id: 2,
      name: "Lucie",
      countries: "Panama",
      description: "Kultura, příroda a úsměv všude s sebou",
      image: "/lucie.jpg", // ✅ přejmenováno z photograph
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Hero sekce */}
      <GlobalHero title="Pan Batoh" subtitle="Objevuj svět s námi" />

      {/* Teasery sekcí */}
      <div className="max-w-6xl mx-auto px-6 py-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/pruvodci"
          className="bg-white border border-[#8ECAE6] rounded-xl shadow hover:shadow-lg transition p-6 flex flex-col items-center text-center"
        >
          <img src="/globe.svg" alt="Průvodci" className="w-16 h-16 mb-4" />
          <h2 className="text-lg font-bold text-[#0077B6]">Průvodci</h2>
          <p className="text-sm text-gray-600 mt-2">
            Najdi svého průvodce pro cestu snů.
          </p>
        </Link>

        <Link
          href="/itinerare"
          className="bg-white border border-[#8ECAE6] rounded-xl shadow hover:shadow-lg transition p-6 flex flex-col items-center text-center"
        >
          <img src="/file.svg" alt="Itineráře" className="w-16 h-16 mb-4" />
          <h2 className="text-lg font-bold text-[#0077B6]">Itineráře</h2>
          <p className="text-sm text-gray-600 mt-2">
            Připrav si cestu krok za krokem.
          </p>
        </Link>

        <Link
          href="/cesty"
          className="bg-white border border-[#8ECAE6] rounded-xl shadow hover:shadow-lg transition p-6 flex flex-col items-center text-center"
        >
          <img src="/next.svg" alt="Cesty" className="w-16 h-16 mb-4" />
          <h2 className="text-lg font-bold text-[#0077B6]">Cesty</h2>
          <p className="text-sm text-gray-600 mt-2">
            Inspiruj se dobrodružstvími ostatních.
          </p>
        </Link>
      </div>

      {/* Doporučení průvodci */}
      <GuidesTeaser guides={mockGuides} />
    </div>
  );
}
"use client";

import SearchGuides from "../components/SearchGuides";

export default function Page() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-[#0077B6] mb-6">Průvodci</h1>

      {/* tady se vloží vyhledávání */}
      <SearchGuides />

      {/* TODO: tady pak přijde seznam průvodců */}
    </div>
  );
}

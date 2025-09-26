"use client";

import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Rozvržení správce</h1>

      {/* Menu admin sekcí */}
      <nav className="flex gap-6 mb-8 border-b pb-2">
        <Link href="/admin" className="hover:underline text-blue-600">
          Dashboard
        </Link>
        <Link href="/admin/guides" className="hover:underline text-blue-600">
          Průvodci
        </Link>
        <Link href="/admin/itineraries" className="hover:underline text-blue-600">
          Itineráře
        </Link>
        <Link href="/admin/reviews" className="hover:underline text-blue-600">
          Recenze
        </Link>
        <Link href="/admin/blog" className="hover:underline text-blue-600">
          Blog
        </Link>
        <Link href="/admin/photos" className="hover:underline text-blue-600">
          Fotky
        </Link>
      </nav>

      {/* Obsah sekce */}
      {children}
    </div>
  );
}
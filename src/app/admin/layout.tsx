// src/app/admin/layout.tsx
import React from "react";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm mb-8">
        <nav className="mx-auto max-w-6xl flex justify-between p-4">
          <div className="font-semibold">Pan Batoh – Admin</div>
          <div className="flex gap-6 text-sm">
            <Link href="/admin">Dashboard</Link>
            <Link href="/admin/guides">Průvodci</Link>
            <Link href="/admin/reviews">Recenze</Link>
            <Link href="/admin/photos">Fotky</Link>
            <Link href="/admin/vycetovani">Vyúčtování</Link>
            <Link href="/admin/hry">Hry</Link>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6">{children}</main>
    </div>
  );
}
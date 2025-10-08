"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/guides", label: "Průvodci" },
    { href: "/admin/itineraries", label: "Itineráře" },
    { href: "/admin/reviews", label: "Recenze" },
    { href: "/admin/blog", label: "Blog" },
    { href: "/admin/photos", label: "Fotky" },
  ];

  return (
    <div className="min-h-screen bg-[#f9fafb] text-gray-800">
      {/* Hlavička admina */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#0077B6]">Admin rozhraní</h1>
          <Link
            href="/"
            className="text-sm text-blue-600 hover:underline transition"
          >
            Zpět na web
          </Link>
        </div>
      </header>

      {/* Navigace */}
      <nav className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 flex gap-4 overflow-x-auto py-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "text-sm px-3 py-1.5 rounded-lg transition whitespace-nowrap",
                pathname === item.href
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Obsah sekce */}
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

export default function Header() {
  console.log("✅ Header komponenta byla načtena");
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!error && user) {
        setUserEmail(user.email ?? null);
      } else {
        setUserEmail(null);
      }
    };

    fetchUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      fetchUser();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="bg-white border-b border-[#8ECAE6] sticky top-0 z-50">
      <nav
        className="max-w-6xl mx-auto h-16 px-4 flex items-center justify-between"
        aria-label="Hlavní navigace"
      >
        {/* Logo + název */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-90">
          <img
            src="/panbatoh-logo.png"
            alt="Pan Batoh"
            className="h-8 w-8 rounded-md"
          />
       <span className="text-[#0077B6] font-bold text-lg">Pan Batoh</span>
        </Link>

        {/* Menu */}
        <div className="flex items-center gap-4 text-sm font-medium text-[#0077B6]">
          <Link href="/">Vybalený batoh</Link>
          <Link href="/pruvodci">Průvodci</Link>
          <Link href="/itineraries">Itineráře</Link>
          <Link href="/vylety">Výlety</Link>

          {userEmail && (
            <>
              <Link
                href="/guide/dashboard"
                className="hover:underline text-green-700"
              >
                Můj dashboard
              </Link>
              {userEmail === "zabaleny@panbatoh.cz" && (
                <Link
                  href="/admin"
                  className="hover:underline text-blue-700"
                >
                  Admin
                </Link>
              )}
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
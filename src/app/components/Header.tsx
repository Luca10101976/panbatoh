"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Header() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user = session?.user;
      if (user) {
        setUserEmail(user.email ?? null);
        const adminEmails = ["lejnarova.lucie@gmail.com"];
        setIsAdmin(adminEmails.includes(user.email ?? ""));
      }
    };

    getUser();
  }, []);

  return (
    <header className="w-full bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Levá část – logo a navigace */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/panbatoh-logo.png" // ✅ MÁŠ HO V PUBLIC
              alt="Pan Batoh logo"
              width={32}
              height={32}
            />
            <span className="text-lg font-semibold text-gray-800">
              Pan Batoh
            </span>
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
        </div>

        {/* Pravá část – admin a auth */}
        <div className="flex items-center space-x-4">
          {userEmail ? (
            <>
              {isAdmin && (
                <Link href="/admin" className="hover:underline">
                  Admin
                </Link>
              )}
              <button
                onClick={() => supabase.auth.signOut()}
                className="text-sm text-gray-700 hover:underline"
              >
                Odhlásit se
              </button>
            </>
          ) : (
            <Link href="/login" className="text-sm text-gray-700 hover:underline">
              Přihlásit se
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
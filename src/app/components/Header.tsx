"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Header() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Chyba při získávání session:", sessionError.message);
        return;
      }

      const user = session?.user;

      if (user) {
        const email = user.email ?? null;
        setUserEmail(email);
        const adminEmails = ["zabaleny@panbatoh.cz"];
        setIsAdmin(email ? adminEmails.includes(email) : false);
      } else {
        setUserEmail(null);
        setIsAdmin(false);
      }
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const email = session?.user?.email ?? null;
      setUserEmail(email);
      const adminEmails = ["zabaleny@panbatoh.cz"];
      setIsAdmin(email ? adminEmails.includes(email) : false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Chyba při odhlášení:", error.message);
    setUserEmail(null);
    setIsAdmin(false);
    router.push("/");
  };

  return (
    <header className="w-full bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Levá část – logo a navigace */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/panbatoh-logo.png"
              alt="Pan Batoh logo"
              width={32}
              height={32}
            />
            <span className="text-lg font-semibold text-gray-800">
              Pan Batoh
            </span>
          </Link>
          <Link href="/pruvodci" className="hover:underline">Průvodci</Link>
          <Link href="/itinerare" className="hover:underline">Itineráře</Link>
          <Link href="/vylety" className="hover:underline">Výlety</Link>
        </div>

        {/* Pravá část – dashboard, admin, logout */}
        <div className="flex items-center space-x-4">
          {userEmail ? (
            <>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="text-sm text-gray-700 hover:underline"
                >
                  Admin
                </Link>
              )}
              <Link
                href={isAdmin ? "/admin" : "/guide/dashboard"}
                className="text-sm text-gray-700 hover:underline"
              >
                Můj dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-700 hover:underline"
              >
                Odhlásit se
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm text-gray-700 hover:underline"
            >
              Přihlásit se
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
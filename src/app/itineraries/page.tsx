"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        setLoggedIn(false);
      } else {
        setLoggedIn(true);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) return <p>⏳ Ověřuji přihlášení…</p>;
  if (!loggedIn) return <p>❌ Musíš se přihlásit</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Admin zóna</h1>
      <p className="text-gray-600">Zde budeš spravovat vše potřebné...</p>
    </div>
  );
}
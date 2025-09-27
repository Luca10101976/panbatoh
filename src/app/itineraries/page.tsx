"use client";

import { useSessionContext } from "@supabase/auth-helpers-react";

export default function AdminPage() {
  const { isLoading, session } = useSessionContext();

  if (isLoading) return <p>⏳ Ověřuji přihlášení…</p>;
  if (!session) return <p>❌ Musíš se přihlásit</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">🛠️ Admin zóna</h1>
      <p className="text-gray-600">Zde budeš spravovat vše potřebné...</p>
    </div>
  );
}
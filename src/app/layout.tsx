import React from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";

export default function AdminPage() {
  const { isLoading, session } = useSessionContext();

  if (isLoading) return <p>⏳ Ověřuji přihlášení…</p>;
  if (!session?.user) return <p>❌ Musíš se přihlásit</p>;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {/* Admin content goes here */}
    </div>
  );
}

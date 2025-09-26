"use client";

import { useAuth } from "../../components/SupabaseProvider";
import AdminDashboardOverview from "../../components/admin/AdminDashboardOverview";

export default function AdminPage() {
  const { user, loading } = useAuth();

  if (loading) return <p>⏳ Ověřuji přihlášení…</p>;
  if (!user) return <p>❌ Musíš se přihlásit</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <p className="mb-8">✅ Přihlášený uživatel: <strong>{user.email}</strong></p>
      
      <AdminDashboardOverview />
    </div>
  );
}
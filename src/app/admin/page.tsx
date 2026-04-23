// src/app/admin/page.tsx
import { cookies } from "next/headers";
import Link from "next/link";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/supabase";
import AdminDashboardOverview from "@/components/admin/AdminDashboardOverview";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // ✅ cookies() je asynchronní (Next.js 15)
  const cookieStore = await cookies();

  // ✅ Supabase klient s moderním cookie bridgem
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Vrať všechny cookies
        getAll: async () => cookieStore.getAll(),
        // Zápisy v RSC ignorujeme (pouze pro middleware)
        setAll: async () => {
          console.warn("@supabase/ssr: setAll v RSC ignorováno (OK)");
        },
      },
    }
  );

  // ✅ Načti uživatele
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const ADMIN_EMAILS = ["lucie.lejnarova@supersoused.cz"];

  // ⚠️ Nepřihlášený uživatel
  if (error || !user) {
    return (
      <div className="mx-auto max-w-3xl p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">⚠️ Není přihlášeno</h1>
        <p>Supabase session nebyla nalezena nebo vypršela.</p>
        <Link href="/login" className="text-blue-600 underline">
          Zpět na přihlášení
        </Link>
      </div>
    );
  }
  
  // 🚫 Neadmin
  if (!ADMIN_EMAILS.includes(user.email ?? "")) {
    return (
      <div className="mx-auto max-w-3xl p-8 text-center">
        <h1 className="text-2xl font-bold text-orange-600 mb-4">
          ⛔ Přístup pouze pro adminy
        </h1>
        <p>
          Tvůj účet (<strong>{user.email}</strong>) nemá oprávnění pro admin sekci.
        </p>
      </div>
    );
  }

  // ✅ Admin – OK
  return (
    <div className="mx-auto max-w-5xl p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <p className="mb-8">
        ✅ Přihlášený admin: <strong>{user.email}</strong>
      </p>
      <AdminDashboardOverview />
    </div>
  );
}
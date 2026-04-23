// src/middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/supabase";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // ✅ Supabase klient s moderním cookie bridge (Next.js 15)
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // ✅ Získání přihlášeného uživatele
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  console.log("🔍 Middleware kontrola:", user?.email ?? "nepřihlášen", error?.message ?? "OK");

  // 🚫 Pokud není přihlášený a chce na /admin → redirect na /login
  if (req.nextUrl.pathname.startsWith("/admin") && !user) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/login";
    return NextResponse.redirect(redirectUrl);
  }

  // ✅ Pokud je přihlášený, pokračuj dál
  return res;
}

// ✅ Middleware se spustí pro všechny cesty pod /admin
export const config = {
  matcher: ["/admin/:path*"],
};
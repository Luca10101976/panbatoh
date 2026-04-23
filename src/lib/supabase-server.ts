// src/lib/supabase-server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/supabase";

export async function createServerClientTyped() {
  const cookieStore = await cookies(); // ✅ v tvém projektu je Promise

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: async () => cookieStore.getAll(),
        setAll: async (cookiesToSet) => {
          try {
            for (const cookie of cookiesToSet) {
              if (!cookie?.name) continue;

              if (cookie.value) {
                cookieStore.set({
                  name: cookie.name,
                  value: cookie.value,
                  ...cookie.options,
                });
              } else {
                cookieStore.delete(cookie.name);
              }
            }
          } catch (err) {
            console.error("⚠️ Error setting cookies:", err);
          }
        },
      },
    }
  );
}
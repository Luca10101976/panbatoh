"use client";

import { useState, createContext, useContext } from "react";
import { createBrowserClient } from "@supabase/ssr";
import type { ReactNode } from "react";
import type { Database } from "@/types/supabase";

// ✅ Vytvoříme vlastní SupabaseContext (náhrada za SessionContextProvider)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SupabaseContext = createContext<any>(null);

export function Providers({ children }: { children: ReactNode }) {
  const [supabaseClient] = useState(() =>
    createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );

  return (
    <SupabaseContext.Provider value={{ supabaseClient }}>
      {children}
    </SupabaseContext.Provider>
  );
}

// ✅ Pomocný hook pro přístup ke klientovi
export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error("useSupabase must be used within <Providers>");
  }
  return context.supabaseClient;
}
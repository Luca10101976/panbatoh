import { createContext, useContext, useMemo } from "react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Session, SupabaseClient } from "@supabase/supabase-js";
import { useState } from "react";

type SupabaseContextType = {
  supabase: SupabaseClient;
  session: Session | null;
};

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export function SupabaseAuthProvider({
  children,
  initialSession = null,
}: {
  children: React.ReactNode;
  initialSession?: Session | null;
}) {
  const [supabase] = useState(() => createBrowserSupabaseClient());
  const [session, setSession] = useState<Session | null>(initialSession);

  // Optionally, you can handle auth state changes here and update session

  const value = useMemo(
    () => ({
      supabase,
      session,
    }),
    [supabase, session]
  );

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error("useSupabase must be used within a SupabaseAuthProvider");
  }
  return context;
}

import { useSessionContext } from "@supabase/auth-helpers-react";

export function useAuth() {
  const { session } = useSessionContext();
  return { session, user: session?.user };
}
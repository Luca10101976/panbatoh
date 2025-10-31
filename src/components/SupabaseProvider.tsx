'use client';

import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  type ReactNode,
} from 'react';

import { createBrowserClient } from '@supabase/ssr';
import { Session, SupabaseClient } from '@supabase/supabase-js';

// Typ pro kontext
type SupabaseContextType = {
  supabase: SupabaseClient;
  session: Session | null;
  loading: boolean;
};

// Vytvoření kontextu
const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

// Provider obalující aplikaci
export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Získání aktuální session při načtení
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Poslouchání změn session (např. přihlášení/odhlášení)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const value = useMemo(
    () => ({ supabase, session, loading }),
    [supabase, session, loading]
  );

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}

// Vlastní hook pro přístup k Supabase
export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseAuthProvider');
  }
  return context;
}

// Vlastní hook pro práci se session
export function useAuth() {
  const { session, loading } = useSupabase();
  return { session, user: session?.user, loading };
}
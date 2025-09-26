"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "../supabaseClient";
import type { User, Session, AuthChangeEvent } from "@supabase/supabase-js";

// Typ pro kontext
type AuthCtx = {
  user: User | null;
  loading: boolean;
};

// Vytvoření kontextu s výchozími hodnotami
const AuthContext = createContext<AuthCtx | undefined>(undefined);

// Provider komponenta
export const SupabaseAuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook pro přístup ke kontextu
export const useAuth = (): AuthCtx => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a SupabaseAuthProvider");
  }
  return context;
};
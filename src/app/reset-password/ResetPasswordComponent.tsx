'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function ResetPasswordComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Zkontroluj, že hook běží v prohlížeči
    if (typeof window === "undefined") return;

    let cancelled = false;

    const process = async () => {
      setMsg(null);

      const code = searchParams.get("code");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error && !cancelled) {
          setMsg("❌ Ověření odkazu selhalo: " + error.message);
        }
        if (!cancelled) setReady(true);
        return;
      }

      if (window.location.hash) {
        const h = new URLSearchParams(window.location.hash.slice(1));
        const type = h.get("type");
        const access_token = h.get("access_token") || h.get("token");
        const refresh_token = h.get("refresh_token") || "";

        if (type === "recovery" && access_token) {
          const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });
          if (error && !cancelled) {
            setMsg("❌ Ověření odkazu selhalo: " + error.message);
          }
        }
      }

      if (!cancelled) setReady(true);
    };

    process();

    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setSubmitting(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) setMsg("❌ Chyba při změně hesla: " + error.message);
    else setMsg("✅ Heslo bylo změněno. Můžeš se přihlásit.");

    setSubmitting(false);
  };

  if (!ready) {
    return (
      <div className="max-w-md mx-auto mt-24 p-6 bg-white border rounded shadow">
        Ověřuji odkaz…
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-24 p-6 bg-white border rounded shadow">
      <h1 className="text-xl font-bold mb-4">Reset hesla</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="Nové heslo"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <button
          type="submit"
          disabled={submitting || !password}
          className="w-full bg-[#0077B6] text-white py-2 rounded hover:bg-[#023E8A] disabled:opacity-60"
        >
          {submitting ? "Ukládám…" : "Změnit heslo"}
        </button>
      </form>

      {msg && <p className="mt-4">{msg}</p>}
    </div>
  );
}
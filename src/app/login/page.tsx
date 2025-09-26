"use client";

import { useState } from "react";
import { supabase } from "../../supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMsg("❌ Přihlášení selhalo: " + error.message);
    } else {
      setMsg("✅ Přihlášení proběhlo úspěšně! Za chvíli tě přesměruju…");

      // Tvrdé přesměrování – vynutí načtení /admin s čerstvou session
      setTimeout(() => {
        window.location.assign("/admin");
      }, 500);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white border rounded shadow">
      <h1 className="text-xl font-bold mb-4">Přihlášení administrátora</h1>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="E-mail"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Heslo"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0077B6] text-white py-2 rounded hover:bg-[#023E8A] disabled:opacity-60"
        >
          {loading ? "Přihlašuji…" : "Přihlásit se"}
        </button>
      </form>

      {/* Ruční link = pojistka */}
      <div className="mt-4 text-sm text-center">
        <a href="/admin" className="text-[#0077B6] hover:underline">
          Pokračovat do administrace
        </a>
      </div>

      {msg && <p className="mt-4">{msg}</p>}
    </div>
  );
}
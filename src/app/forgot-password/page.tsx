"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/reset-password",
    });

    if (error) {
      setMsg("❌ Chyba: " + error.message);
    } else {
      setMsg("✅ Na e-mail byl odeslán odkaz pro změnu hesla.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white border rounded shadow">
      <h1 className="text-xl font-bold mb-4">Zapomenuté heslo</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Tvůj e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0077B6] text-white py-2 rounded hover:bg-[#023E8A] disabled:opacity-60"
        >
          {loading ? "Odesílám…" : "Odeslat odkaz"}
        </button>
      </form>
      {msg && <p className="mt-4">{msg}</p>}
    </div>
  );
}
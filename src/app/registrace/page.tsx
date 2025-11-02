"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function RegistracePage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email || !password) {
      setError("Zadejte e-mail a heslo.");
      return;
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError("Chyba při registraci: " + signUpError.message);
    } else {
      setSuccess(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center py-12">
      <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-xl shadow-lg p-8 border border-[#8ECAE6]">
        <h1 className="text-2xl font-bold mb-6 text-center text-[#0077B6]">Registrace průvodce</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 font-semibold text-[#0077B6]">E-mail</label>
            <input
              type="email"
              className="border px-3 py-2 rounded w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-[#0077B6]">Heslo</label>
            <input
              type="password"
              className="border px-3 py-2 rounded w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-[#FFB703] px-4 py-2 rounded font-bold hover:bg-[#40916C] transition"
          >
            Registrovat
          </button>
        </form>

        {success && (
          <div className="mt-4 text-[#40916C] font-semibold">
            ✅ Zkontroluj e-mailovou schránku a potvrď registraci.
          </div>
        )}
        {error && (
          <div className="mt-4 text-[#F44336] font-semibold">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

type GuideProfile = {
  id: string;
  name: string | null;
  description: string | null;
  countries: string | null;
  languages: string | null;
  experience: string | null;
  focus: string | null;
  profile_image: string | null;
};

export default function GuideDashboardPage() {
  const [profile, setProfile] = useState<GuideProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data: userData, error: userErr } = await supabase.auth.getUser();

      if (userErr || !userData.user) {
        setError("Musíte být přihlášen/a.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("guides")
        .select("*")
        .eq("user_id", userData.user.id)
        .single();

      if (error) {
        setError(error.message);
      } else {
        setProfile(data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  if (loading) return <p className="p-6">⏳ Načítám profil…</p>;
  if (error) return <p className="p-6 text-red-600">❌ {error}</p>;
  if (!profile) return <p className="p-6">❗ Profil nebyl nalezen.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Můj profil</h1>

      <div className="border rounded p-4 bg-white shadow">
        <p><strong>Jméno:</strong> {profile.name ?? "—"}</p>
        <p><strong>Popis:</strong> {profile.description ?? "—"}</p>
        <p><strong>Země:</strong> {profile.countries ?? "—"}</p>
        <p><strong>Jazyky:</strong> {profile.languages ?? "—"}</p>

        {/* Typ zážitku s fallback logikou */}
        <p>
          <strong>Typy zážitků:</strong>{" "}
          {profile.focus && profile.focus.trim() !== "" ? (
            profile.focus
          ) : profile.experience && profile.experience.trim() !== "" ? (
            profile.experience
          ) : (
            <span className="text-gray-500">Neurčeno</span>
          )}
        </p>

        {profile.profile_image && (
          <Image
            src={profile.profile_image}
            alt="Profilová fotka"
            width={128}
            height={128}
            className="w-32 h-32 object-cover rounded mt-3"
          />
        )}
      </div>

      <Link
        href="/guide/profile"
        className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        ✏️ Upravit profil
      </Link>
    </div>
  );
}
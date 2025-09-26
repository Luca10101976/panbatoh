"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import Image from "next/image"; // ✅ přidáno

type GuideProfile = {
  id: number;
  name: string;
  description: string | null;
  countries: string | null;
  languages: string | null;
  experience: string | null;
  photograph: string | null;
};

export default function GuideProfilePage() {
  const [profile, setProfile] = useState<GuideProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Načtení profilu
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
        .maybeSingle();

      if (error) {
        setError(error.message);
      } else {
        setProfile(data ?? null);
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  // Uložení změn
  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);

    const { error } = await supabase
      .from("guides")
      .update({
        name: profile.name,
        description: profile.description,
        countries: profile.countries,
        languages: profile.languages,
        experience: profile.experience,
        photograph: profile.photograph,
      })
      .eq("id", profile.id);

    setSaving(false);

    if (error) {
      setError(error.message);
    } else {
      alert("✅ Změny uloženy!");
    }
  };

  // Upload fotky
  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!profile) return;
      const file = e.target.files?.[0];
      if (!file) return;

      setUploading(true);

      const fileExt = file.name.split(".").pop();
      const fileName = `${profile.id}-${Date.now()}.${fileExt}`;
      const filePath = `guide-profile-images/${fileName}`;

      // Nahrajeme soubor
      const { error: uploadErr } = await supabase.storage
        .from("guide-profile-images")
        .upload(filePath, file, { upsert: true });

      if (uploadErr) throw uploadErr;

      // Získáme public URL
      const { data } = supabase.storage
        .from("guide-profile-images")
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;

      // Uložíme do DB
      const { error: updateErr } = await supabase
        .from("guides")
        .update({ photograph: publicUrl })
        .eq("id", profile.id);

      if (updateErr) throw updateErr;

      setProfile({ ...profile, photograph: publicUrl });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Nastala neznámá chyba při nahrávání fotky.");
      }
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <p className="p-6">⏳ Načítám editor…</p>;
  if (error) return <p className="p-6 text-red-600">❌ {error}</p>;
  if (!profile) return <p className="p-6">❗ Profil nebyl nalezen.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Upravit profil</h1>

      <div className="space-y-3">
        <input
          type="text"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          className="w-full border px-3 py-2 rounded"
          placeholder="Jméno"
        />
        <textarea
          value={profile.description ?? ""}
          onChange={(e) =>
            setProfile({ ...profile, description: e.target.value })
          }
          className="w-full border px-3 py-2 rounded"
          placeholder="Popis"
        />
        <input
          type="text"
          value={profile.countries ?? ""}
          onChange={(e) =>
            setProfile({ ...profile, countries: e.target.value })
          }
          className="w-full border px-3 py-2 rounded"
          placeholder="Země"
        />
        <input
          type="text"
          value={profile.languages ?? ""}
          onChange={(e) =>
            setProfile({ ...profile, languages: e.target.value })
          }
          className="w-full border px-3 py-2 rounded"
          placeholder="Jazyky"
        />
        <input
          type="text"
          value={profile.experience ?? ""}
          onChange={(e) =>
            setProfile({ ...profile, experience: e.target.value })
          }
          className="w-full border px-3 py-2 rounded"
          placeholder="Zkušenosti"
        />

        {/* Upload fotky */}
        <div>
          <label className="block font-medium mb-1">Profilová fotka</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleUploadPhoto}
            disabled={uploading}
          />
          {uploading && (
            <p className="text-sm text-gray-500">⏳ Nahrávám fotku…</p>
          )}
          {profile.photograph && (
            <Image
              src={profile.photograph}
              alt="Profilová fotka"
              width={128} // ✅ povinné u <Image />
              height={128}
              className="w-32 h-32 object-cover rounded mt-2"
            />
          )}
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Ukládám…" : "💾 Uložit změny"}
        </button>
        <button
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          onClick={() => (window.location.href = "/guide/dashboard")}
        >
          Zpět na dashboard
        </button>
      </div>
    </div>
  );
}
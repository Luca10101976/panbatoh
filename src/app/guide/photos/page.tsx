"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type GuidePhoto = {
  id: number;
  photo_url: string;
  approved: boolean;
  created_at: string;
};

export default function GuidePhotosPage() {
  const [photos, setPhotos] = useState<GuidePhoto[]>([]);
  const [guideId, setGuideId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Načti moje fotky
  const fetchPhotos = async () => {
    setLoading(true);
    setError(null);

    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData.user) {
      setError("Musíte být přihlášen/a.");
      setLoading(false);
      return;
    }

    // zjistíme ID průvodce
    const { data: guideRow, error: guideErr } = await supabase
      .from("guides")
      .select("id")
      .eq("user_id", userData.user.id)
      .single();

    if (guideErr || !guideRow) {
      setError("Nemáte vytvořený průvodcovský profil.");
      setLoading(false);
      return;
    }

    setGuideId(guideRow.id);

    const { data, error } = await supabase
      .from("guide_photos")
      .select("id, photo_url, approved, created_at")
      .eq("guide_id", guideRow.id)
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
      setPhotos([]);
    } else {
      setPhotos(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  // Upload fotky
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0 || !guideId) return;

      setUploading(true);
      const file = e.target.files[0];

      const filePath = `guide-${guideId}/${Date.now()}-${file.name}`;

      // nahrajeme do bucketu guide-photos
      const { error: uploadErr } = await supabase.storage
        .from("guide-photos")
        .upload(filePath, file);

      if (uploadErr) {
        setError("Chyba při nahrávání: " + uploadErr.message);
        setUploading(false);
        return;
      }

      const publicUrl = supabase.storage
        .from("guide-photos")
        .getPublicUrl(filePath).data.publicUrl;

      // uložení do tabulky guide_photos
      const { error: dbErr } = await supabase
        .from("guide_photos")
        .insert([{ guide_id: guideId, photo_url: publicUrl }]);

      if (dbErr) {
        setError("Chyba při ukládání do DB: " + dbErr.message);
      } else {
        fetchPhotos();
      }
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <p className="p-6">⏳ Načítám fotky…</p>;
  if (error) return <p className="p-6 text-red-600">❌ {error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Moje fotky</h1>

      <div>
        <label className="block mb-2 font-medium">📤 Nahrát novou fotku</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
        />
        {uploading && <p className="text-gray-500 mt-2">⏳ Nahrávám…</p>}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {photos.map((p) => (
          <div key={p.id} className="border rounded p-2 bg-white shadow">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.photo_url}
              alt="Guide photo"
              className="w-full h-32 object-cover rounded"
            />
            <div className="text-xs mt-1 text-gray-600">
              {p.approved ? "✅ Schváleno" : "🟡 Čeká na schválení"}
            </div>
          </div>
        ))}
      </div>

      {photos.length === 0 && (
        <p className="text-gray-600">Nemáte zatím žádné nahrané fotky.</p>
      )}
    </div>
  );
}
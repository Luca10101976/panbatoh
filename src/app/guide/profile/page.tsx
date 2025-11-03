"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);
import { useRouter } from "next/navigation";
import Image from "next/image";

const CONTINENTS: { [key: string]: string[] } = {
  Evropa: ["Česko", "Slovensko", "Polsko", "Německo", "Francie", "Španělsko", "Itálie", "Velká Británie"],
  Asie: ["Čína", "Japonsko", "Thajsko", "Vietnam", "Indie"],
  Afrika: ["Egypt", "Maroko", "Keňa", "JAR"],
  Amerika: ["USA", "Kanada", "Mexiko", "Argentina", "Brazílie"],
  Austrálie: ["Austrálie", "Nový Zéland"],
};

const LANGUAGES = ["čeština", "angličtina", "němčina", "francouzština", "španělština", "italština"];

const EXPERIENCES = [
  "Turistika", "Památky", "Gastronomie", "Kultura", "Příroda", "Sport", "Wellness", "Dobrodružství",
];

function CheckboxGrid({
  label,
  options = [],
  values,
  setValues,
}: {
  label: string;
  options?: string[];
  values: string[];
  setValues: (v: string[]) => void;
}) {
  return (
    <div>
      <label className="block mb-1 font-semibold">{label}</label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {options.map((option) => (
          <label key={option} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={values.includes(option)}
              onChange={(e) => {
                if (e.target.checked) {
                  setValues([...values, option]);
                } else {
                  setValues(values.filter((v) => v !== option));
                }
              }}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [continent, setContinent] = useState("");
  const [countries, setCountries] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [experiences, setExperiences] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.push("/login");
        return;
      }

      if (!data.user.email_confirmed_at) {
        alert("Nejdřív potvrď e-mail, který jsme ti poslali.");
        router.push("/login");
        return;
      }

      setUserId(data.user.id);
      setEmail(data.user.email ?? "");

      const { data: profile } = await supabase
        .from("guides")
        .select("*")
        .eq("user_id", data.user.id)
        .maybeSingle();

      if (profile) {
        setProfileId(profile.id ?? null);
        setName(profile.name ?? "");
        setContinent(profile.destination ?? "");
        setPhotoUrl(profile.profile_image || profile.photograph || "");
        setCountries(profile.countries ? profile.countries.split(", ").filter(Boolean) : []);
        setLanguages(profile.languages ? profile.languages.split(", ").filter(Boolean) : []);
        setExperiences(profile.experience ? profile.experience.split(", ").filter(Boolean) : []);
        setDescription(profile.description ?? "");
      }

      setLoading(false);
    };
    fetchUserAndProfile();
  }, [router]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSaving(true);

    if (!userId || !email || !name || !continent || countries.length === 0 || languages.length === 0 || experiences.length === 0) {
      setError("Vyplňte všechna pole.");
      setSaving(false);
      return;
    }

    let finalPhotoUrl = photoUrl;

    if (photoFile) {
      setUploading(true);
      const ext = photoFile.name.split(".").pop();
      const fileName = `${userId}/profile.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("guide-profile-images")
        .upload(fileName, photoFile, { upsert: true });

      if (uploadError) {
        setError("Chyba při nahrávání fotky: " + uploadError.message);
        setUploading(false);
        setSaving(false);
        return;
      }

      const { data } = supabase.storage
        .from("guide-profile-images")
        .getPublicUrl(fileName);
      finalPhotoUrl = data.publicUrl;
      setPhotoUrl(finalPhotoUrl);
      setUploading(false);
    }

    const guideData: Record<string, string | boolean> = {
      user_id: userId,
      name,
      email,
      destination: continent,
      countries: countries.join(", "),
      languages: languages.join(", "),
      experience: experiences.join(", "),
      focus: experiences.join(", "),
      profile_image: finalPhotoUrl,
      photograph: finalPhotoUrl,
      description,
      content: "",
      approved: false,
      is_approved: false,
    };

    try {
      // 🩵 Typizovaná verze bez any
      let fullResp: { data: { id?: string } | null; error: { message: string } | null } | null = null;

      if (profileId) {
        fullResp = await supabase.from("guides").update(guideData).eq("id", profileId).select().single();
      } else {
        fullResp = await supabase.from("guides").insert(guideData).select("id").single();
        if (fullResp?.data?.id) setProfileId(fullResp.data.id);
      }

      if (fullResp?.error) {
        setError("Chyba při ukládání profilu: " + fullResp.error.message);
      } else {
        setSuccess(true);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError("Chyba při ukládání profilu: " + err.message);
      } else {
        setError("Chyba při ukládání profilu.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6">⏳ Načítám profil…</p>;

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center py-12">
      <div className="w-full max-w-3xl bg-white/90 backdrop-blur rounded-xl shadow-lg p-12 border border-[#8ECAE6]">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block mb-1 font-semibold text-[#0077B6]">Jméno</label>
            <input
              type="text"
              className="border px-3 py-2 rounded w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-[#0077B6]">Pár slov o sobě</label>
            <textarea
              className="border px-3 py-2 rounded w-full"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-[#0077B6]">Kontinent</label>
            <select
              className="border px-3 py-2 rounded w-full"
              value={continent}
              onChange={(e) => {
                setContinent(e.target.value);
                setCountries([]);
              }}
            >
              <option value="">Vyberte kontinent</option>
              {Object.keys(CONTINENTS).map((cont) => (
                <option key={cont} value={cont}>
                  {cont}
                </option>
              ))}
            </select>
          </div>

          {continent && (
            <CheckboxGrid
              label="Země"
              options={CONTINENTS[continent]}
              values={countries}
              setValues={setCountries}
            />
          )}

          <CheckboxGrid
            label="Jazyky"
            options={LANGUAGES}
            values={languages}
            setValues={setLanguages}
          />

          <CheckboxGrid
            label="Typ zážitku"
            options={EXPERIENCES}
            values={experiences}
            setValues={setExperiences}
          />

          <div>
            <label className="block mb-1 font-semibold text-[#0077B6]">Fotka</label>
            <input
              type="file"
              accept="image/*"
              className="border px-3 py-2 rounded w-full"
              onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
            />

            {photoUrl ? (
              <Image
                src={photoUrl}
                alt="Profilová fotka"
                width={128}
                height={128}
                sizes="128px"
                className="w-32 h-32 object-cover rounded mt-2"
              />
            ) : (
              <p className="text-sm text-gray-500 mt-2">Žádná fotka zatím nahraná.</p>
            )}
          </div>

          <button
            type="submit"
            className="bg-[#FFB703] px-4 py-2 rounded font-bold hover:bg-[#40916C] transition"
            disabled={saving}
          >
            {saving ? "Ukládám…" : "Uložit profil"}
          </button>
        </form>

        {success && (
          <div className="mt-4 text-[#40916C] font-semibold">
            ✅ Profil uložen. Počkej na schválení adminem.
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
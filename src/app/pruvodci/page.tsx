"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import GlobalHero from "../components/GlobalHero";
import { supabase } from "../../supabaseClient";

type Guide = {
  id: number;
  name: string;
  countries: string;
  description: string | null;
  photograph: string | null;
  languages: string;
  experience: string;
};

const LANGUAGES = [
  "čeština",
  "angličtina",
  "němčina",
  "francouzština",
  "španělština",
  "italština",
];
const EXPERIENCES = [
  "Turistika",
  "Památky",
  "Gastronomie",
  "Kultura",
  "Příroda",
  "Sport",
  "Wellness",
  "Dobrodružství",
];

export default function GuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [avatars, setAvatars] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("");
  const [experience, setExperience] = useState("");

  const fetchGuides = async () => {
    console.log("▶️ Načítám průvodce…");

    let query = supabase
      .from("public_published_guides")
      .select(
        "id, name, countries, description, photograph, languages, experience"
      );

    if (search) {
      console.log("🔍 Filtruju podle search:", search);
      query = query.or(`name.ilike.%${search}%,countries.ilike.%${search}%`);
    }
    if (language) {
      console.log("🔍 Filtruju podle jazyka:", language);
      query = query.ilike("languages", `%${language}%`);
    }
    if (experience) {
      console.log("🔍 Filtruju podle zkušenosti:", experience);
      query = query.ilike("experience", `%${experience}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("❌ Chyba při načítání průvodců:", error);
      setGuides([]);
    } else {
      console.log("✅ Data z DB:", data);
      setGuides(data || []);

      setTimeout(async () => {
        const urls = await Promise.all(
          (data || []).map(async (g) => {
            const photo = g.photograph;

            if (!photo) return [g.id, "/hero.jpg"] as const;

            if (photo.startsWith("http")) {
              return [g.id, photo] as const;
            }

            try {
              const res = await fetch("/api/sign-url", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ path: photo, expiresIn: 3600 }),
              });
              if (!res.ok) throw new Error("sign failed");
              const { url } = await res.json();
              return [g.id, url || "/hero.jpg"] as const;
            } catch {
              return [g.id, "/hero.jpg"] as const;
            }
          })
        );
        setAvatars(Object.fromEntries(urls));
      }, 0);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchGuides();
  }, [search, language, experience]);

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <GlobalHero
        title="Průvodci"
        subtitle="Najdi svého průvodce pro cestu snů"
      />

      <div className="max-w-6xl mx-auto -mt-8 relative z-20">
        <div className="bg-white border border-[#8ECAE6] rounded-xl shadow p-4 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Hledat podle jména nebo země..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded flex-1"
          />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border px-3 py-2 rounded md:w-48"
          >
            <option value="">Všechny jazyky</option>
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="border px-3 py-2 rounded md:w-48"
          >
            <option value="">Všechny typy</option>
            {EXPERIENCES.map((ex) => (
              <option key={ex} value={ex}>
                {ex}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {loading ? (
          <p className="text-center">⏳ Načítám průvodce...</p>
        ) : guides.length === 0 ? (
          <p className="text-center text-gray-500">Žádní průvodci nenalezeni.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {guides.map((guide) => (
              <div
                key={guide.id}
                className="bg-white border border-[#8ECAE6] rounded-xl shadow hover:shadow-lg transition flex flex-col items-center text-center p-6"
              >
                <img
                  src={avatars[guide.id] || "/hero.jpg"}
                  alt={guide.name}
                  className="w-24 h-24 rounded-full object-cover border-2 border-[#8ECAE6] mb-4"
                />
                <h2 className="text-lg font-bold text-[#0077B6]">
                  {guide.name}
                </h2>
                <p className="text-sm text-gray-600 mb-2">{guide.countries}</p>
                <p className="text-sm text-gray-500">
                  {guide.description || "Zkušený průvodce"}
                </p>
                <Link
                  href={`/pruvodci/${guide.id}`}
                  className="mt-4 bg-[#40916C] text-white px-4 py-2 rounded-lg hover:bg-[#2d6a4f] transition"
                >
                  Zobrazit profil
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
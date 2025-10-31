"use client";

import { useEffect, useState } from "react";
import GuidesTeaser from "../components/GuidesTeaser";
import GlobalHero from "../components/GlobalHero";
import { supabase } from "../../supabaseClient";

// Typ odpovídající view public_published_guides
type Guide = {
  id: string;
  name: string;
  countries: string;
  languages: string;
  profile_image: string;
  description: string;
  created_at: string;
  experience: string;
  rating?: number | null;
  focus?: string | null;
};

export default function GuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [avatars, setAvatars] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("");
  const [experience, setExperience] = useState("");

  useEffect(() => {
    const fetchGuides = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("public_published_guides")
        .select(
          "id, name, countries, languages, profile_image, description, created_at, experience, rating, focus"
        )
        .or(search ? `name.ilike.%${search}%,countries.ilike.%${search}%` : "")
        .ilike("languages", language ? `%${language}%` : "%")
        .ilike("experience", experience ? `%${experience}%` : "%");

      if (error) {
        console.error("❌ Chyba při načítání průvodců:", error);
        setGuides([]);
        setAvatars({});
        setLoading(false);
        return;
      }

      // Mapování dat
      setGuides(
        (data ?? []).map((g) => ({
          id: g.id ?? "",
          name: g.name ?? "",
          countries: g.countries ?? "",
          languages: g.languages ?? "",
          profile_image: g.profile_image ?? "",
          description: g.description ?? "",
          created_at: g.created_at ?? "",
          experience: g.experience ?? "",
          rating: g.rating ?? null,
          focus: g.focus ?? null,
        }))
      );

      // Podepsané URL obrázků
      const urls = await Promise.all(
        (data ?? []).map(async (g) => {
          const id = g.id ?? "";
          const photo = g.profile_image;

          if (!photo) return [id, "/placeholder.jpg"] as const;
          if (photo.startsWith("http")) return [id, photo] as const;

          try {
            const res = await fetch("/api/sign-url", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ path: photo, expiresIn: 3600 }),
            });
            const { url } = await res.json();
            return [id, url || "/placeholder.jpg"] as const;
          } catch {
            return [id, "/placeholder.jpg"] as const;
          }
        })
      );

      setAvatars(Object.fromEntries(urls));
      setLoading(false);
    };

    fetchGuides();
  }, [search, language, experience]);

  const mappedGuides = guides.map((g) => ({
    ...g,
    profile_image: avatars[g.id] ?? g.profile_image ?? "/placeholder.jpg",
  }));

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <GlobalHero title="Průvodci" subtitle="Najdi svého průvodce pro cestu snů" />

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
            <option value="čeština">čeština</option>
            <option value="angličtina">angličtina</option>
            <option value="němčina">němčina</option>
            <option value="francouzština">francouzština</option>
            <option value="španělština">španělština</option>
            <option value="italština">italština</option>
          </select>
          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="border px-3 py-2 rounded md:w-48"
          >
            <option value="">Všechny typy</option>
            <option value="Turistika">Turistika</option>
            <option value="Památky">Památky</option>
            <option value="Gastronomie">Gastronomie</option>
            <option value="Kultura">Kultura</option>
            <option value="Příroda">Příroda</option>
            <option value="Sport">Sport</option>
            <option value="Wellness">Wellness</option>
            <option value="Dobrodružství">Dobrodružství</option>
          </select>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {loading ? (
          <p className="text-center">⏳ Načítám průvodce...</p>
        ) : mappedGuides.length === 0 ? (
          <p className="text-center text-gray-500">Žádní průvodci nenalezeni.</p>
        ) : (
          <GuidesTeaser guides={mappedGuides} />
        )}
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import GuidesTeaser from "../components/GuidesTeaser";
import GlobalHero from "../components/GlobalHero";
import { supabase } from "../../supabaseClient";
import type { Database } from "@/types/supabase";

type Guide = Database["public"]["Tables"]["public_published_guides"]["Row"];

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

      let query = supabase
        .from("public_published_guides")
        .select("id, name, countries, languages, profile_image, description, created_at, experience, rating, focus");

      if (search) {
        query = query.or(`name.ilike.%${search}%,countries.ilike.%${search}%`);
      }
      if (language) {
        query = query.ilike("languages", `%${language}%`);
      }
      if (experience) {
        query = query.ilike("experience", `%${experience}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("❌ Chyba při načítání průvodců:", error);
        setGuides([]);
        setAvatars({});
        setLoading(false);
        return;
      }

      console.log("✅ Průvodci načteni:", data);

      setGuides(data ?? []);

      const urls = await Promise.all(
        (data ?? []).map(async (g) => {
          const photo = g.profile_image;
          if (!photo) return [g.id, "/placeholder.jpg"] as const;
          if (photo.startsWith("http")) return [g.id, photo] as const;

          try {
            const res = await fetch("/api/sign-url", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ path: photo, expiresIn: 3600 }),
            });
            const { url } = await res.json();
            return [g.id, url || "/placeholder.jpg"] as const;
          } catch {
            return [g.id, "/placeholder.jpg"] as const;
          }
        })
      );

      setAvatars(Object.fromEntries(urls));
      setLoading(false);
    };

    fetchGuides();
  }, [search, language, experience]);

  // ❗ OPRAVA: countries a experience jsou vždy string
  const mappedGuides = guides.map((g) => ({
    ...g,
    profile_image: avatars[g.id] ?? g.profile_image ?? "/placeholder.jpg",
    countries: g.countries ?? "",
    experience: g.experience ?? "",
    languages: g.languages ?? "",
    description: g.description ?? "",
    rating: g.rating ?? null,
  }));

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
          <p className="text-center text-gray-500">
            Žádní průvodci nenalezeni.
          </p>
        ) : (
          <GuidesTeaser guides={mappedGuides} />
        )}
      </div>
    </div>
  );
}
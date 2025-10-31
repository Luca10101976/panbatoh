"use client";

import { useEffect, useState } from "react";
import GuideCard from "./GuideCard";

type Guide = {
  id: string;
  name: string;
  countries?: string | string[] | null;
  experience?: string | null;
  description?: string | null;
  focus?: string | null;
  languages?: string | null;
  rating?: number | null;
};

export default function GuidesGrid() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [images, setImages] = useState<Record<string, string>>({});

  // ✅ Načtení průvodců
  useEffect(() => {
    async function fetchGuides() {
      try {
        const res = await fetch("/api/guides");
        if (!res.ok) throw new Error("Nepodařilo se načíst průvodce");
        const data = await res.json();
        console.log("📦 Načtení průvodci:", data);
        setGuides(data);
      } catch (error) {
        console.error("❌ Chyba při načítání průvodců:", error);
      }
    }

    fetchGuides();
  }, []);

  // ✅ Načtení fotek průvodců
  useEffect(() => {
    async function fetchImages() {
      const urls: Record<string, string> = {};

      await Promise.all(
        guides.map(async (guide) => {
          try {
            const res = await fetch("/api/sign-url", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                path: `guide-profile-images/${guide.id}/profile.png`,
                expiresIn: 3600,
              }),
            });

            const { url } = await res.json();
            urls[guide.id] = url;
          } catch (error) {
            console.warn(`⚠️ Nelze načíst obrázek pro průvodce ${guide.id}`);
          }
        })
      );

      setImages(urls);
    }

    if (guides.length > 0) fetchImages();
  }, [guides]);

  // ✅ Výpis karet průvodců
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {guides.map((guide) => (
        <GuideCard
          key={guide.id}
          id={guide.id}
          name={guide.name}
          countries={
            Array.isArray(guide.countries)
              ? guide.countries.join(", ")
              : guide.countries ?? ""
          }
          experience={guide.experience ?? ""}
          focus={guide.focus ?? ""}
          description={guide.description ?? ""}
          languages={guide.languages ?? ""}
          rating={guide.rating ?? null}
          imageUrl={images[guide.id]}
        />
      ))}
    </div>
  );
}
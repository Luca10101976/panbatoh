"use client";

import { useEffect, useState } from "react";
import GuideCard from "./GuideCard";

type Guide = {
  id: string;
  name: string;
  destination?: string | null;
  description?: string | null;
  destination?: string | null;
  focus?: string | null;
  languages?: string | null;
  rating?: number | null;
};

export default function GuidesGrid() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [images, setImages] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchGuides() {
      const res = await fetch("/api/guides"); // uprav podle svého backendu
      const data = await res.json();
      console.log("📦 Načtení průvodci:", data); // ✅ debug
      setGuides(data);
    }

    fetchGuides();
  }, []);

  useEffect(() => {
    async function fetchImages() {
      const urls: Record<string, string> = {};

      await Promise.all(
        guides.map(async (guide) => {
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
        })
      );

      setImages(urls);
    }

    if (guides.length > 0) {
      fetchImages();
    }
  }, [guides]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {guides.map((guide) => (
        <GuideCard
          key={guide.id}
          id={guide.id}
          name={guide.name}
          destination={guide.destination}
          description={guide.description}
          destination={guide.destination}
          focus={guide.focus}
          languages={guide.languages}
          rating={guide.rating}
          imageUrl={images[guide.id]}
        />
      ))}
    </div>
  );
}
"use client";

import GuideCard from "./GuideCard";

// ✅ Rozšířený typ Guide
type Guide = {
  id?: string;
  name?: string;
  countries?: string;
  description?: string;
  profile_image?: string;
  experience?: string;
  languages?: string;
  rating?: number;
};

type Props = {
  guides: Guide[];
};

export default function GuidesTeaser({ guides }: Props) {
  if (!guides.length) {
    return <p className="text-center text-gray-500">Žádní průvodci nejsou k dispozici.</p>;
  }
console.log("🧭 Posílám průvodce do GuideCard:", guides);
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {guides.map((guide) => (
        <GuideCard
          key={guide.id || ""}
          id={guide.id || ""}
          name={guide.name || "Neznámý průvodce"}
          countries={guide.countries|| ""}
          description={guide.description || ""}
          experience={guide.experience || ""}
          languages={guide.languages || ""}
          rating={guide.rating ?? null}
          imageUrl={guide.profile_image || "/placeholder.jpg"}
        />
      ))}
    </div>
  );
}
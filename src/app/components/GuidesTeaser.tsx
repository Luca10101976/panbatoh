"use client";

import type { Database } from "@/types/supabase";

type Guide = Database["public"]["Views"]["public_published_guides"]["Row"];

type Props = {
  guides: Guide[];
};

/**
 * Local lightweight GuideCard component to replace the missing external module.
 * Keep this simple — adjust markup/props as needed to match your design.
 */
function GuideCard({
  id,
  name,
  countries,
  description,
  imageUrl,
}: {
  id: string;
  name: string;
  countries: string;
  description: string;
  imageUrl: string;
}) {
  return (
    <article className="rounded-lg overflow-hidden shadow-sm bg-white">
      <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        <p className="text-sm text-gray-500">{countries}</p>
        <p className="mt-2 text-sm text-gray-700">{description}</p>
      </div>
    </article>
  );
}

export default function GuidesTeaser({ guides }: Props) {
  if (!guides.length) {
    return <p className="text-center text-gray-500">Žádní průvodci nejsou k dispozici.</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {guides.map((guide) => (
        <GuideCard
          key={guide.id}
          id={guide.id ?? ""}
          name={guide.name ?? "Neznámý průvodce"}
          countries={guide.countries ?? ""}
          description={guide.description ?? ""}
          imageUrl={guide.profile_image ?? "/placeholder.jpg"}
        />
      ))}
    </div>
  );
}
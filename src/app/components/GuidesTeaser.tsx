"use client";

import GuideCard from "@/components/GuideCard";
import type { Database } from "@/types/supabase";

type Guide = Database["public"]["Views"]["public_published_guides"]["Row"];

type Props = {
  guides: Guide[];
};

export default function GuidesTeaser({ guides }: Props) {
  if (!guides.length) {
    return (
      <p className="text-center text-gray-500">
        Žádní průvodci nejsou k dispozici.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {guides.map((guide) => (
        <GuideCard
          key={guide.id}
          id={guide.id ?? ""}
          name={guide.name ?? "Neznámý průvodce"}
          countries={guide.countries ?? ""}
          experience={guide.experience ?? ""}
          focus={guide.focus ?? ""}
          description={guide.description ?? ""}
          imageUrl={guide.profile_image ?? "/placeholder.jpg"}
          languages={guide.languages ?? ""}
          rating={guide.rating ?? null}
        />
      ))}
    </div>
  );
}
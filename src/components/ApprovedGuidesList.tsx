"use client";

import { useEffect, useState } from "react";
import { getApprovedGuides } from "@/lib/supabase/guides";
import type { Database } from "@/types/supabase";
import GuideCard from "../app/components/GuideCard";

// ✅ Typ odpovídá view `public_published_guides`
type Guide = Database["public"]["Tables"]["public_published_guides"]["Row"];

export default function ApprovedGuidesList() {
  const [guides, setGuides] = useState<Guide[]>([]);

  useEffect(() => {
    const fetchGuides = async () => {
      const data = await getApprovedGuides();

      console.log("🧭 Načtení průvodci:", data);

      if (data && data.length > 0) {
        const first = data[0];
        console.log("🧪 Debug průvodce:");
        console.log("🌍 Země (countries):", first.countries);
        console.log("🎯 Zaměření (experience):", first.experience);
        console.log("📝 Popis:", first.description);
        console.log("🗣️ Jazyky:", first.languages);
        console.log("📷 Obrázek:", first.profile_image);
      }

      setGuides(data ?? []);
    };

    fetchGuides();
  }, []);

  if (!guides.length) {
    return <div>Žádní schválení průvodci zatím nejsou.</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {guides.map((g) => (
        <GuideCard
          key={g.id ?? "unknown"}
          id={g.id ?? ""}
          name={g.name ?? "Neznámý průvodce"}
          countries={g.countries ?? "Neuvedeno"}
          description={g.description ?? "Bez popisu"}
          imageUrl={g.profile_image ?? "/panbatoh-logo.png"}
          experience={g.experience ?? "Neuvedeno"}
          languages={g.languages ?? "Neuvedeno"}
          rating={g.rating ?? null}
        />
      ))}
    </div>
  );
}
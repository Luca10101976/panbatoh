"use client";

import { useEffect, useState } from "react";
import { getApprovedGuides } from "@/lib/supabase/guides";
import type { Database } from "@/types/supabase";
import GuideCard from "../app/components/GuideCard";

type Guide = Database["public"]["Tables"]["guides"]["Row"];

export default function ApprovedGuidesList() {
  const [guides, setGuides] = useState<Guide[]>([]);

  useEffect(() => {
    const fetchGuides = async () => {
      const data = await getApprovedGuides();
      setGuides(data);
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
          key={g.id}
          id={g.id}
          name={g.name}
          countries={g.countries ?? ""}
          description={g.description ?? ""}
          imageUrl={g.profile_image ?? "/hero.jpg"}
        />
      ))}
    </div>
  );
}
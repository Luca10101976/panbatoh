"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Database } from "@/types/supabase";

// ✅ Správný typ z tabulky
type Guide = Database["public"]["Tables"]["public_published_guides"]["Row"];

type GuideReview = {
  id: string;
  content?: string | null;
  rating?: number | null;
  user_id?: string | null;
  guide_id?: string | null;
  created_at?: string | null;
};

export default function GuidePage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const [guide, setGuide] = useState<Guide | null>(null);
  const [reviews, setReviews] = useState<GuideReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const guideId = params.id;

      // Načti průvodce
      const { data: guideDataRaw, error: guideError } = await supabase
        .from("public_published_guides")
        .select("*")
        .eq("id", guideId)
        .single();

      if (guideError || !guideDataRaw) {
        console.error("❌ Chyba při načítání průvodce:", guideError);
        router.push("/404");
        return;
      }

      const guideData = guideDataRaw as Guide;

      // Načti recenze
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("reviews")
        .select("*")
        .eq("guide_id", guideId)
        .order("created_at", { ascending: false });

      if (reviewsError) {
        console.error("❌ Chyba při načítání recenzí:", reviewsError);
      }

      setGuide(guideData);
      setReviews((reviewsData ?? []) as GuideReview[]);
      setLoading(false);
    };

    fetchData();
  }, [params.id, router]);

  if (loading) return <p>⏳ Načítám průvodce…</p>;
  if (!guide) return <p className="text-red-600">❌ Průvodce nebyl nalezen.</p>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="flex flex-col items-center mb-6">
        {guide.profile_image ? (
          <img
            src={guide.profile_image}
            alt={guide.name ?? "Průvodce"}
            className="w-40 h-40 object-cover rounded-full mb-4"
          />
        ) : (
          <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center mb-4">
            <span className="text-gray-500">Bez fotky</span>
          </div>
        )}
        <h1 className="text-3xl font-bold">{guide.name ?? "Neznámý průvodce"}</h1>
        <p className="text-gray-600">{guide.countries || "Neuvedeno"}</p>
      </div>

      <p className="mb-6">{guide.description || "Bez popisu"}</p>

      <h2 className="text-2xl font-semibold mb-4">Recenze</h2>
      {reviews.length === 0 ? (
        <p>Žádné recenze zatím nejsou.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((review) => (
            <li key={review.id} className="border rounded p-4">
              <p className="text-gray-800 mb-2">{review.content || "Bez komentáře"}</p>
              <p className="text-sm text-gray-500">
                Hodnocení: {review.rating ?? "–"} ★ — uživatel {review.user_id ?? "neznámý"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="text-gray-500">{children}</p>;
}
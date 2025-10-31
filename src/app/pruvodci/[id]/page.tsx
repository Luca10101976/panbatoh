"use client";

import { use } from "react";
import { useEffect, useState } from "react";
import { useRouter, notFound } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

interface Guide {
  id: string;
  name: string | null;
  countries: string | null;
  languages: string | null;
  profile_image: string | null;
  description: string | null;
  experience: string | null;
  focus: string | null;
  created_at: string | null;
  rating: number | null;
}

interface GuideReview {
  id: number;
  content?: string | null;
  rating?: number | null;
  user_id?: string | null;
  guide_id?: string | null;
  created_at?: string | null;
}

export default function GuidePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: guideId } = use(params);
  const router = useRouter();
  const [guide, setGuide] = useState<Guide | null>(null);
  const [reviews, setReviews] = useState<GuideReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("public_published_guides")
        .select(
          "id, name, countries, languages, profile_image, description, experience, focus, created_at, rating"
        )
        .eq("id", guideId)
        .single();

      if (error || !data) {
        console.error("❌ Chyba nebo prázdná data:", error);
        setGuide(null);
        setLoading(false);
        return;
      }

      setGuide(data as unknown as Guide);

      const { data: reviewsData, error: reviewsError } = await supabase
        .from("reviews")
        .select(
          "id, content, rating, user_id, guide_id, created_at"
        )
        .eq("guide_id", guideId)
        .order("created_at", { ascending: false });

      if (reviewsError) {
        console.error("❌ Chyba při načítání recenzí:", reviewsError);
      }

      setReviews(reviewsData ?? []);
      setLoading(false);
    };

    fetchData();
  }, [guideId, router]);

  if (loading)
    return (
      <p className="p-6 text-center text-gray-600 animate-pulse">
        Načítám profil průvodce…
      </p>
    );

  if (!loading && guide === null) {
    notFound(); // ✅ správná metoda pro Next.js 15
  }

  // ✅ Funkce pro barevné badge – pevné Tailwind třídy
  const renderBadges = (
    text: string | null,
    type: "languages" | "focus" | "experience"
  ) => {
    const colorClasses = {
      languages: "bg-blue-100 text-blue-800",
      focus: "bg-green-100 text-green-800",
      experience: "bg-yellow-100 text-yellow-800",
    };

    return text?.split(",").map((item) => (
      <span
        key={item.trim()}
        className={`inline-block ${colorClasses[type]} text-xs font-medium mr-2 mb-2 px-3 py-1 rounded-full shadow-sm`}
      >
        {item.trim()}
      </span>
    ));
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      {/* HLAVIČKA */}
      <div className="flex flex-col items-center text-center mb-10 bg-white/80 backdrop-blur rounded-xl shadow-md p-8 border border-[#8ECAE6]">
        {guide.profile_image ? (
          <img
            src={guide.profile_image}
            alt={guide.name ?? "Průvodce"}
            className="w-40 h-40 object-cover rounded-full shadow-md mb-4 border-4 border-[#219EBC]"
          />
        ) : (
          <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center mb-4">
            <span className="text-gray-500">Bez fotky</span>
          </div>
        )}

        <h1 className="text-3xl font-bold text-[#023047]">{guide.name}</h1>
        <p className="text-sm text-gray-500 mt-1">
          {guide.countries ?? "neuvedeno"}
        </p>
        <p className="text-sm text-gray-400">
          Registrován:{" "}
          {guide.created_at
            ? new Date(guide.created_at).toLocaleDateString("cs-CZ")
            : "neznámo"}
        </p>
      </div>

      {/* O PRŮVODCI */}
      <section className="mb-10 bg-[#f9fafb] rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-[#023047] mb-3">
          O průvodci
        </h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {guide.description || "Průvodce zatím nic nenapsal."}
        </p>
      </section>

      {/* DOVEDNOSTI A ZAMĚŘENÍ */}
      <section className="mb-10 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">
          Dovednosti a zaměření
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">
              Jazyky
            </h3>
            <div>{renderBadges(guide.languages, "languages")}</div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">
              Zaměření
            </h3>
            <div>{renderBadges(guide.focus, "focus")}</div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">
              Typy zážitků
            </h3>
            <div>{renderBadges(guide.experience, "experience")}</div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">
              Hodnocení
            </h3>
            <p className="text-gray-900 font-semibold">
              {guide.rating
                ? `${guide.rating.toFixed(1)} ★`
                : "Zatím žádné hodnocení"}
            </p>
          </div>
        </div>
      </section>

      {/* RECENZE */}
      <section className="bg-[#f9fafb] rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-[#023047] mb-4">Recenze</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500">Zatím žádné recenze.</p>
        ) : (
          <ul className="space-y-4">
            {reviews.map((review) => (
              <li
                key={review.id}
                className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
              >
                <p className="text-gray-800 mb-2">
                  {review.content || "Bez komentáře."}
                </p>
                <p className="text-sm text-gray-500">
                  Hodnocení: {review.rating ?? "–"} ★ —{" "}
                  {review.user_id
                    ? `uživatel ${review.user_id}`
                    : "anonymní"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
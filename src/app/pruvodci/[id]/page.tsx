"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "../../../supabaseClient";

const BUCKET = "guide-profile-images";

type Guide = {
  id: number;
  name: string;
  email?: string | null;
  countries?: string | null;
  description?: string | null;
  languages?: string | null;
  experience?: string | null;
  photograph?: string | null;
};

type Review = {
  id: number;
  author_name?: string | null;
  rating?: number | null;
  comment?: string | null;
  created_at?: string | null;
};

type Itinerary = {
  id: number;
  title: string;
  slug?: string | null;
  summary?: string | null;
};

async function getSignedUrl(
  path?: string | null,
  expiresInSec = 3600
): Promise<string> {
  if (!path) return "/hero.jpg";

  if (path.startsWith("http")) return path;

  try {
    const res = await fetch("/api/sign-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path, expiresIn: expiresInSec }),
    });
    if (!res.ok) throw new Error("sign failed");
    const { url } = await res.json();
    return url || "/hero.jpg";
  } catch {
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl || "/hero.jpg";
  }
}

export default function GuideDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [guide, setGuide] = useState<Guide | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [avatar, setAvatar] = useState("/hero.jpg");
  const [tab, setTab] = useState<
    "about" | "itineraries" | "reviews" | "gallery" | "contact"
  >("about");

  const [reviews, setReviews] = useState<Review[]>([]);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);

  useEffect(() => {
    const gid = Number(id);
    if (!gid) return;

    (async () => {
      const { data, error } = await supabase
        .from("public_published_guides")
        .select("*")
        .eq("id", gid)
        .single();

      if (error || !data) {
        setErr("Průvodce nenalezen nebo chyba");
        setGuide(null);
      } else {
        setGuide(data);
        if (data.photograph) {
          const url = await getSignedUrl(data.photograph);
          setAvatar(url);
        }
      }
      setLoading(false);
    })();
  }, [id]);

  useEffect(() => {
    const gid = Number(id);
    if (!gid) return;

    (async () => {
      try {
        const { data } = await supabase
          .from("guide_reviews")
          .select("id,author_name,rating,comment,created_at")
          .eq("guide_id", gid)
          .order("created_at", { ascending: false });
        setReviews((data as Review[]) || []);
      } catch {
        setReviews([]);
      }

      try {
        const { data } = await supabase
          .from("itineraries")
          .select("id,title,slug,summary")
          .eq("guide_id", gid)
          .order("id", { ascending: false });
        setItineraries((data as Itinerary[]) || []);
      } catch {
        setItineraries([]);
      }
    })();
  }, [id]);

  const ratingAvg = useMemo(() => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((a, r) => a + (r.rating || 0), 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }, [reviews]);

  if (loading) return <div className="p-10 text-[#666]">Načítám…</div>;
  if (err || !guide)
    return (
      <div className="p-10 text-red-600">
        {err ?? "Průvodce nenalezen"}
        <div className="mt-4">
          <button
            className="bg-[#0077B6] text-white px-4 py-2 rounded"
            onClick={() => router.push("/pruvodci")}
          >
            Zpět na seznam
          </button>
        </div>
      </div>
    );

  return (
    <div className="bg-[#F5F5F5] text-[#333333] min-h-screen flex flex-col">
      {/* Profil */}
      <section className="max-w-5xl mx-auto px-4 w-full mt-6">
        <div className="bg-white rounded-2xl shadow-lg border border-[#8ECAE6] p-6 flex flex-col md:flex-row gap-5 items-center">
          <Image
            src={avatar}
            alt={guide.name}
            width={96}
            height={96}
            className="w-24 h-24 rounded-full object-cover border-2 border-[#8ECAE6]"
          />
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-bold text-[#0077B6]">{guide.name}</h2>
            <p className="text-sm text-[#555]">
              {guide.countries ?? "Neuvedeno"}
            </p>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
              <StarRow value={ratingAvg} />
              <span className="text-sm text-[#666]">
                {ratingAvg
                  ? `${ratingAvg} · ${reviews.length} recenzí`
                  : "Bez hodnocení"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Taby */}
      <section className="max-w-5xl mx-auto px-4 w-full mt-8">
        <div className="flex gap-2 mb-6">
          {[
            { key: "about", label: "O mně" },
            { key: "itineraries", label: "Itineráře" },
            { key: "reviews", label: "Recenze" },
            { key: "contact", label: "Kontakt" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as typeof tab)}
              className={`px-4 py-2 rounded ${
                tab === t.key
                  ? "bg-[#0077B6] text-white"
                  : "bg-white border border-[#8ECAE6] text-[#0077B6]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "about" && (
          <div className="bg-white rounded p-6">
            <h3 className="text-lg font-semibold mb-2">O mně</h3>
            <p>{guide.description || "Průvodce zatím nemá popis."}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <InfoCard title="Jazyky">{guide.languages}</InfoCard>
              <InfoCard title="Zkušenosti">{guide.experience}</InfoCard>
              <InfoCard title="Oblast působení">{guide.countries}</InfoCard>
            </div>
          </div>
        )}

        {tab === "itineraries" && (
          <div className="bg-white rounded p-6">
            <h3 className="text-lg font-semibold mb-2">Itineráře</h3>
            {itineraries.length === 0 ? (
              <Empty>Žádné itineráře</Empty>
            ) : (
              <ul className="list-disc ml-5">
                {itineraries.map((it) => (
                  <li key={it.id}>{it.title}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {tab === "reviews" && (
          <div className="bg-white rounded p-6">
            <h3 className="text-lg font-semibold mb-2">Recenze</h3>
            {reviews.length === 0 ? (
              <Empty>Bez recenzí</Empty>
            ) : (
              <ul className="space-y-2">
                {reviews.map((r) => (
                  <li key={r.id} className="border-b pb-2">
                    <strong>{r.author_name ?? "Anonym"}</strong> –{" "}
                    <StarRow value={r.rating ?? 0} />
                    <p>{r.comment}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {tab === "contact" && (
          <div className="bg-white rounded p-6">
            <h3 className="text-lg font-semibold mb-2">Kontakt</h3>
            {guide.email ? (
              <a
                href={`mailto:${guide.email}`}
                className="text-blue-600 underline"
              >
                {guide.email}
              </a>
            ) : (
              <Empty>Email není k dispozici</Empty>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function StarRow({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const stars = Array.from({ length: 5 }, (_, i) => {
    if (i < full) return "★";
    if (i === full && half) return "☆";
    return "☆";
  });
  return <span className="text-[#FFB703]">{stars.join(" ")}</span>;
}

function InfoCard({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="border p-3 rounded">
      <div className="font-semibold text-[#0077B6] mb-1">{title}</div>
      <div>{children ?? "Neuvedeno"}</div>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="text-gray-500">{children}</p>;
}
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../../supabaseClient";

type DayPhoto = {
  id: number;
  photo_url: string;
  caption: string | null;
  created_at: string;
};

type Day = {
  id: number;
  day_number: number;
  title: string | null;
  description: string | null;
  photos: DayPhoto[];
};

type Itinerary = {
  id: number;
  title: string;
  description: string | null;
  approved: boolean | null;
  created_at: string;
  days: Day[];
};

export default function MyItinerariesPage() {
  const [itins, setItins] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [openDayForm, setOpenDayForm] = useState<number | null>(null);

  const fetchMy = async () => {
    setLoading(true);
    setErr(null);

    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData.user) {
      setErr("Nejste přihlášen/a.");
      setLoading(false);
      return;
    }
    const uid = userData.user.id;
    setUserEmail(userData.user.email ?? null);

    const { data, error } = await supabase
      .from("itineraries")
      .select(
        `
        id, title, description, approved, created_at,
        days:itinerary_days (
          id, day_number, title, description,
          photos:itinerary_day_photos (
            id, photo_url, caption, created_at
          )
        )
      `
      )
      .eq("guide_id", uid)
      .order("id", { ascending: true })
      .order("day_number", { foreignTable: "itinerary_days", ascending: true })
      .order("created_at", { foreignTable: "itinerary_day_photos", ascending: true });

    if (error) {
      setErr(error.message);
      setItins([]);
    } else {
      setItins(
        (data ?? []).map((it): Itinerary => ({
          ...it,
          days: (it.days ?? []).map((d): Day => ({
            ...d,
            photos: d.photos ?? [],
          })),
        }))
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMy();
  }, []);

  if (loading) return <div className="max-w-5xl mx-auto p-6">⏳ Načítám…</div>;
  if (err)
    return (
      <div className="max-w-5xl mx-auto p-6 text-red-600">
        ❌ {err}{" "}
        <Link href="/login" className="text-blue-600 underline ml-2">
          Přihlásit se
        </Link>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="flex items-baseline justify-between">
        <h1 className="text-3xl font-bold">Moje itineráře</h1>
        <div className="text-sm text-gray-500">{userEmail}</div>
      </div>

      <div className="flex gap-3">
        <Link
          href="/itineraries/my"
          className="px-3 py-2 bg-gray-100 rounded border hover:bg-gray-200"
        >
          Přehled
        </Link>
        <Link
          href="/itineraries/new"
          className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          ➕ Přidat nový itinerář
        </Link>
      </div>

      {itins.length === 0 ? (
        <p className="text-gray-600">
          Zatím nemáte žádné itineráře. Vytvořte si první kliknutím na{" "}
          <Link href="/itineraries/new" className="text-blue-600 underline">
            „Přidat nový itinerář“
          </Link>
          .
        </p>
      ) : (
        itins.map((it) => (
          <div key={it.id} className="rounded border bg-white shadow-sm">
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  {it.title}{" "}
                  <span className="text-sm text-gray-500">(ID: {it.id})</span>
                </h2>
                {it.description && (
                  <p className="text-gray-700 mt-1">{it.description}</p>
                )}
                <div className="mt-2 text-sm">
                  Stav:{" "}
                  {it.approved ? (
                    <span className="text-green-600">✅ Schváleno</span>
                  ) : (
                    <span className="text-amber-600">🟡 Čeká na schválení</span>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  className="px-3 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                  onClick={() => setOpenDayForm(it.id)}
                >
                  ➕ Přidat den
                </button>
                <button
                  className="px-3 py-2 bg-gray-100 rounded border hover:bg-gray-200"
                  onClick={() => alert("Editace itineráře – později")}
                >
                  ✏️ Upravit
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {it.days.length === 0 ? (
                <p className="text-gray-600">
                  Zatím žádné dny. Použij „➕ Přidat den“.
                </p>
              ) : (
                it.days.map((d) => (
                  <div key={d.id} className="border rounded p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">
                          Den {d.day_number}
                          {d.title ? ` — ${d.title}` : ""}
                        </h3>
                        {d.description && (
                          <p className="text-gray-700 mt-1">{d.description}</p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                          onClick={() =>
                            alert(
                              `Přidat fotky k dni #${d.day_number} – napojíme příště`
                            )
                          }
                        >
                          📷 Přidat fotky
                        </button>
                        <button
                          className="px-3 py-1 bg-gray-100 rounded border hover:bg-gray-200"
                          onClick={() => alert("Upravit den – později")}
                        >
                          ✏️ Upravit den
                        </button>
                      </div>
                    </div>

                    <div className="mt-3">
                      {d.photos.length === 0 ? (
                        <p className="text-gray-500">
                          Žádné fotky. Přidej je tlačítkem nahoře.
                        </p>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {d.photos.map((p) => (
                            <figure
                              key={p.id}
                              className="border rounded overflow-hidden bg-gray-50"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={p.photo_url}
                                alt={p.caption ?? ""}
                                className="w-full h-32 object-cover"
                              />
                              {p.caption && (
                                <figcaption className="p-2 text-xs text-gray-700">
                                  {p.caption}
                                </figcaption>
                              )}
                            </figure>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {openDayForm === it.id && (
              <div className="p-4 border-t">
                <p className="text-sm text-gray-600">
                  Tady se objeví formulář na přidání dne (ItineraryDaysForm).
                </p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
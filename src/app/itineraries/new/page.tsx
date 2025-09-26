"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import ItineraryForm from "../../../components/ItineraryForm";
import ItineraryDaysForm from "../../../components/ItineraryDaysForm";

type Day = {
  id: number;
  day_number: number;
  title: string | null;
  description: string | null;
};

export default function NewItineraryPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [approvedGuide, setApprovedGuide] = useState<boolean | null>(null);
  const [itineraryId, setItineraryId] = useState<number | null>(null);
  const [days, setDays] = useState<Day[]>([]);
  const [checking, setChecking] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // Kontrola přihlášení a schválení průvodce
  useEffect(() => {
    (async () => {
      setChecking(true);
      setErr(null);

      const { data: u, error: ue } = await supabase.auth.getUser();
      if (ue || !u.user) {
        setErr("Pro vytvoření itineráře se prosím přihlas.");
        setChecking(false);
        return;
      }
      setUserId(u.user.id);

      // ověření v tabulce guides
      const { data: g, error: ge } = await supabase
        .from("guides")
        .select("id, approved")
        .eq("user_id", u.user.id)
        .single();

      if (ge) {
        setErr("Nemáte vyplněnou žádost průvodce.");
        setApprovedGuide(false);
      } else {
        setApprovedGuide(!!g?.approved);
      }
      setChecking(false);
    })();
  }, []);

  // Načíst dny konkrétního itineráře
  const fetchDays = async (itinId: number) => {
    const { data, error } = await supabase
      .from("itinerary_days")
      .select("id, day_number, title, description")
      .eq("itinerary_id", itinId)
      .order("day_number", { ascending: true });

    if (!error) {
      setDays(data || []);
    }
  };

  if (checking) {
    return <div className="max-w-2xl mx-auto mt-16">⏳ Ověřuji oprávnění…</div>;
  }

  if (err) {
    return (
      <div className="max-w-2xl mx-auto mt-16 text-red-600">
        ❌ {err}
      </div>
    );
  }

  if (!approvedGuide) {
    return (
      <div className="max-w-2xl mx-auto mt-16">
        ❗ Zdá se, že ještě nejste schválený/á jako průvodce. Požádejte správce o schválení.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-8">
      <h1 className="text-2xl font-bold">Nový itinerář</h1>

      {!itineraryId ? (
        <>
          <p className="text-gray-700">
            Nejprve vyplňte základní informace. Po uložení můžete postupně přidávat dny.
          </p>
          <ItineraryForm
            onCreated={(newId) => {
              setItineraryId(newId);
              fetchDays(newId); // hned si připravíme prázdný seznam dnů
            }}
          />
        </>
      ) : (
        <>
          <div className="p-4 border rounded bg-green-50">
            ✅ Základ itineráře byl uložen (ID: <strong>{itineraryId}</strong>). Níže přidejte dny.
          </div>

          {/* Opraveno: onSaved → onDayAdded */}
          <ItineraryDaysForm
            itineraryId={itineraryId}
            onDayAdded={() => fetchDays(itineraryId)}
          />

          {/* Seznam dnů */}
          <div className="mt-6 space-y-4">
            {days.length === 0 ? (
              <p className="text-gray-600">Zatím žádné dny.</p>
            ) : (
              days.map((d) => (
                <div key={d.id} className="border rounded p-3 bg-white shadow-sm">
                  <h3 className="font-semibold">
                    Den {d.day_number} {d.title && `— ${d.title}`}
                  </h3>
                  {d.description && (
                    <p className="text-gray-700 mt-1">{d.description}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
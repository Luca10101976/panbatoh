"use client";
import { useState } from "react";
import { supabase } from "../../supabaseClient";

// Kontinenty a jejich země
const CONTINENTS: { [key: string]: string[] } = {
  Evropa: [
    "Česko",
    "Slovensko",
    "Polsko",
    "Německo",
    "Francie",
    "Španělsko",
    "Itálie",
    "Velká Británie",
  ],
  Asie: ["Čína", "Japonsko", "Thajsko", "Vietnam", "Indie"],
  Afrika: ["Egypt", "Maroko", "Keňa", "JAR"],
  Amerika: ["USA", "Kanada", "Mexiko", "Argentina", "Brazílie"],
  Austrálie: ["Austrálie", "Nový Zéland"],
};

const EXPERIENCES = [
  "Turistika",
  "Památky",
  "Gastronomie",
  "Kultura",
  "Příroda",
  "Sport",
  "Wellness",
  "Dobrodružství",
];
const LANGUAGES = [
  "čeština",
  "angličtina",
  "němčina",
  "francouzština",
  "španělština",
  "italština",
];

function CheckboxGrid({
  label,
  options,
  values,
  setValues,
}: {
  label: string;
  options: string[];
  values: string[];
  setValues: (v: string[]) => void;
}) {
  return (
    <div>
      <label className="block mb-1 font-semibold">{label}</label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={values.includes(option)}
              onChange={(e) => {
                if (e.target.checked) {
                  setValues([...values, option]);
                } else {
                  setValues(values.filter((v) => v !== option));
                }
              }}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default function RegistracePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [continent, setContinent] = useState("");
  const [countries, setCountries] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [experiences, setExperiences] = useState<string[]>([]);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (
      !name ||
      !email ||
      !continent ||
      countries.length === 0 ||
      languages.length === 0 ||
      experiences.length === 0 ||
      !photoFile
    ) {
      setError("Vyplňte všechna pole a nahrajte fotku.");
      return;
    }

    // Nahraj fotku do Supabase Storage
    const fileExt = photoFile.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("photos")
      .upload(fileName, photoFile);

    if (uploadError) {
      setError("Chyba při nahrávání fotky: " + uploadError.message);
      return;
    }

    const photoUrl = uploadData
      ? supabase.storage.from("photos").getPublicUrl(fileName).data.publicUrl
      : "";

    // Ulož průvodce do databáze
    const { error: dbError } = await supabase.from("guides").insert([
      {
        name,
        email,
        countries: countries.join(", "),
        languages: languages.join(", "),
        experience: experiences.join(", "),
        photopath: photoUrl, // ✅ správně
        approved: false,
      },
    ]);

    if (dbError) {
      setError("Chyba při registraci: " + dbError.message);
    } else {
      setSuccess(true);
      setName("");
      setEmail("");
      setContinent("");
      setCountries([]);
      setLanguages([]);
      setExperiences([]);
      setPhotoFile(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center py-12">
      {/* Hero sekce */}
      <section className="relative w-full mb-8" style={{ minHeight: "260px" }}>
        <img
          src="/registrace-hero.jpg"
          alt="Registrace průvodce"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ minHeight: "260px" }}
        />
        <div className="absolute inset-0 bg-[#0077B6] opacity-60"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0077B6]/40 to-[#F5F5F5]/80"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
            Registrace průvodce
          </h1>
          <p className="text-lg md:text-xl text-white mb-2 drop-shadow">
            Staň se součástí Pan Batoh a nabídni své zážitky cestovatelům!
          </p>
        </div>
      </section>

      {/* Formulář */}
      <div className="w-full max-w-3xl bg-white/90 backdrop-blur rounded-xl shadow-lg p-12 border border-[#8ECAE6]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 font-semibold text-[#0077B6]">
              Jméno
            </label>
            <input
              type="text"
              className="border border-[#8ECAE6] px-3 py-2 rounded w-full bg-white/80"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-[#0077B6]">
              E-mail
            </label>
            <input
              type="email"
              className="border border-[#8ECAE6] px-3 py-2 rounded w-full bg-white/80"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-[#0077B6]">
              Kontinent
            </label>
            <select
              className="border border-[#8ECAE6] px-3 py-2 rounded w-full bg-white/80"
              value={continent}
              onChange={(e) => {
                setContinent(e.target.value);
                setCountries([]);
              }}
            >
              <option value="">Vyberte kontinent</option>
              {Object.keys(CONTINENTS).map((cont) => (
                <option key={cont} value={cont}>
                  {cont}
                </option>
              ))}
            </select>
          </div>
          {continent && (
            <CheckboxGrid
              label="Země"
              options={CONTINENTS[continent]}
              values={countries}
              setValues={setCountries}
            />
          )}
          <CheckboxGrid
            label="Jazyky"
            options={LANGUAGES}
            values={languages}
            setValues={setLanguages}
          />
          <CheckboxGrid
            label="Typ zážitku"
            options={EXPERIENCES}
            values={experiences}
            setValues={setExperiences}
          />
          <div>
            <label className="block mb-1 font-semibold text-[#0077B6]">
              Fotka
            </label>
            <input
              type="file"
              accept="image/*"
              className="border border-[#8ECAE6] px-3 py-2 rounded w-full bg-white/80"
              onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
            />
          </div>
          <button
            type="submit"
            className="bg-[#FFB703] text-[#333333] px-4 py-2 rounded font-bold hover:bg-[#40916C] transition"
          >
            Registrovat
          </button>
        </form>

        {success && (
          <div className="mt-4 text-[#40916C] font-semibold">
            Registrace proběhla úspěšně!
          </div>
        )}
        {error && (
          <div className="mt-4 text-[#F44336] font-semibold">{error}</div>
        )}

        {/* Odkaz pro admina */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Jsi admin?{" "}
            <a
              href="/login"
              className="text-[#0077B6] font-semibold hover:underline"
            >
              Přihlas se zde
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
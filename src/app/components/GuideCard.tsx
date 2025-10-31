"use client";

import Link from "next/link";
import Image from "next/image";

type Props = {
  id: string;
  name: string;
  countries: string;
  experience: string;
  description: string;
  imageUrl: string;
  languages: string;
  rating: number | null;
};

export default function GuideCard({
  id,
  name,
  countries,
  experience,
  description,
  imageUrl,
  languages,
  rating,
}: Props) {
  const safeImageUrl = imageUrl?.trim() || "/panbatoh-logo.png";

  const renderInlineList = (label: string, value: string) => {
    const items = value
      ?.split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    return (
      <p className="text-sm text-gray-700 mt-1 w-full text-left">
        <strong>{label}:</strong>{" "}
        {items && items.length > 0
          ? items.map((item, idx) => (
              <span key={idx}>
                {idx > 0 && " • "}
                {item}
              </span>
            ))
          : "Neuvedeno"}
      </p>
    );
  };

  return (
    <Link
      href={`/pruvodci/${id}`}
      className="flex flex-col items-center text-center bg-white border border-[#8ECAE6] rounded-2xl shadow hover:shadow-lg transition p-6"
    >
      <div className="w-24 h-24 relative mb-3 rounded-full overflow-hidden border-2 border-[#8ECAE6]">
        <Image
          src={safeImageUrl}
          alt={name || "Průvodce"}
          fill
          sizes="96px"
          unoptimized
          className="rounded-full object-cover"
        />
      </div>

      <h3 className="text-lg font-bold text-[#0077B6] mb-1">
        {name || "Neznámý průvodce"}
      </h3>

      {renderInlineList("Země", countries)}
      {renderInlineList("Zaměření", experience)}

      <p className="text-sm text-yellow-600 mt-1 w-full text-left">
        <strong>Recenze:</strong>{" "}
        {rating !== null && rating !== undefined
          ? `${rating.toFixed(1)} / 5 ⭐`
          : "Zatím bez hodnocení"}
      </p>

      {renderInlineList("Jazyky", languages)}

      <p className="text-sm text-gray-500 mt-2 w-full text-left line-clamp-2">
        <strong>Pár slov o sobě:</strong> {description || "Bez popisu"}
      </p>
    </Link>
  );
}
"use client";

import Link from "next/link";
import Image from "next/image";

type Props = {
  id: string;
  name: string;
  countries: string | string[];
  experience: string;
  focus: string;
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
  focus,
  description,
  imageUrl,
  languages,
  rating,
}: Props) {
  const safeImageUrl = imageUrl?.trim() || "/panbatoh-logo.png";

  const renderInlineList = (value: string | string[]) => {
    const items = Array.isArray(value)
      ? value
      : value
          ?.split(",")
          .map((item) => item.trim())
          .filter((item) => item.length > 0);

    return items && items.length > 0 ? items.join(", ") : "neuvedeno";
  };

  return (
    <Link
      href={`/pruvodci/${id}`}
      className="flex flex-col bg-white border border-[#8ECAE6] rounded-2xl shadow hover:shadow-lg transition p-6 text-left hover:scale-[1.01]"
    >
      <div className="w-full h-48 relative mb-4 rounded-xl overflow-hidden">
        <Image
          src={safeImageUrl}
          alt={name || "Průvodce"}
          fill
          sizes="100%"
          unoptimized
          className="object-cover"
        />
      </div>

      <h3 className="text-xl font-bold text-[#023047] mb-1">{name}</h3>

      <p className="text-gray-600 text-sm mb-1">
        <strong>Země:</strong> {renderInlineList(countries)}
      </p>
      <p className="text-gray-600 text-sm mb-1">
        <strong>Zaměření:</strong> {renderInlineList(experience)}
      </p>
      <p className="text-gray-600 text-sm mb-1">
        <strong>Specializace:</strong> {renderInlineList(focus)}
      </p>
      <p className="text-yellow-700 text-sm mb-1">
        <strong>Recenze:</strong>{" "}
        {rating ? `${rating.toFixed(1)} / 5 ⭐` : "Zatím bez hodnocení"}
      </p>
      <p className="text-gray-600 text-sm mb-1">
        <strong>Jazyky:</strong> {renderInlineList(languages)}
      </p>
      <p className="text-gray-500 text-sm mt-2">
        <strong>Pár slov o sobě:</strong>{" "}
        {description?.trim() || "Bez popisu"}
      </p>
    </Link>
  );
}
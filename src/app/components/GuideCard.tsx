"use client";

import Link from "next/link";
import Image from "next/image";

type Props = {
  id: string;
  name: string;
  countries?: string | null;
  description?: string | null;
  imageUrl: string;
};

export default function GuideCard({ id, name, countries, description, imageUrl }: Props) {
  return (
    <Link
      href={`/pruvodci/${id}`}
      className="flex flex-col items-center text-center bg-white border border-[#8ECAE6] rounded-2xl shadow hover:shadow-lg transition p-6"
    >
      <div className="w-24 h-24 relative mb-3">
        <Image
          src={imageUrl}
          alt={name ?? "Průvodce"}
          fill
          className="rounded-full object-cover border-2 border-[#8ECAE6]"
        />
      </div>

      <h3 className="text-lg font-bold text-[#0077B6]">
        {name ?? "Neznámý průvodce"}
      </h3>

      {countries && (
        <p className="text-sm text-gray-600 mt-1">{countries}</p>
      )}

      {description && (
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {description}
        </p>
      )}
    </Link>
  );
}
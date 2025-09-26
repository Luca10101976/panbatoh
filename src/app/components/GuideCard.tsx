"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  id: number;
  name: string;
  countries?: string | null;
  description?: string | null;
  image?: string | null;
  href?: string;
};

export default function GuideCard({
  id,
  name,
  countries,
  description,
  image,
  href = `/pruvodci/${id}`,
}: Props) {
  const [imgUrl, setImgUrl] = useState("/hero.jpg");

  useEffect(() => {
    let alive = true;

    (async () => {
      if (!image) {
        if (alive) setImgUrl("/hero.jpg");
        return;
      }

      if (image.startsWith("http")) {
        if (alive) setImgUrl(image);
        return;
      }

      try {
        const res = await fetch("/api/sign-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: image, expiresIn: 3600 }),
        });
        if (!res.ok) throw new Error("sign failed");
        const { url } = await res.json();
        if (alive) setImgUrl(url || "/hero.jpg");
      } catch {
        if (alive) setImgUrl("/hero.jpg");
      }
    })();

    return () => {
      alive = false;
    };
  }, [image]);

  return (
    <Link
      href={href}
      className="flex flex-col items-center text-center bg-white border border-[#8ECAE6] rounded-2xl shadow hover:shadow-lg transition p-6"
    >
      <div className="w-24 h-24 relative mb-3">
        <Image
          src={imgUrl}
          alt={name}
          fill
          className="rounded-full object-cover border-2 border-[#8ECAE6]"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/hero.jpg";
          }}
        />
      </div>
      <h3 className="text-lg font-bold text-[#0077B6]">{name}</h3>
      {countries && <p className="text-sm text-gray-600 mt-1">{countries}</p>}
      {description && (
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{description}</p>
      )}
    </Link>
  );
}
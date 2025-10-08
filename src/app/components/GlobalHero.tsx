"use client";

import Image from "next/image";

type GlobalHeroProps = {
  title: string;
  subtitle?: string;
};

export default function GlobalHero({ title, subtitle }: GlobalHeroProps) {
  return (
    <section className="relative w-full h-[340px] md:h-[380px]">
      <Image
        src="/hero.jpg"
        alt="Pan Batoh"
        fill
        priority
        className="absolute inset-0 object-cover"
      />
      <div className="absolute inset-0 bg-black/25" />
      <div className="relative z-10 h-full max-w-6xl mx-auto px-4 flex flex-col items-center justify-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow">
          {title}
        </h1>
        {subtitle && (
          <p className="text-white/90 mt-2 text-lg">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
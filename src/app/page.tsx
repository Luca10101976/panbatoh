import { createServerClientTyped } from "@/lib/supabase-server";
import GlobalHero from "./components/GlobalHero";
import Link from "next/link";
import Image from "next/image";
import GuidesTeaser from "./components/GuidesTeaser";
import type { Database } from "@/types/supabase";

type Guide = Database["public"]["Tables"]["public_published_guides"]["Row"];

export default async function HomePage() {
  const supabase = await createServerClientTyped();

  const { data, error } = await supabase
    .from("public_published_guides")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Chyba při načítání průvodců:", error.message);
  }

  const guides = (data ?? []) as Guide[];

  // ✅ Podepsat obrázky synchronně na serveru
  const signedGuides = await Promise.all(
    guides.map(async (g) => {
      const photo = g.profile_image;
      let signedUrl = "/placeholder.jpg";

      if (photo && !photo.startsWith("http")) {
        const { data: signed, error: signError } = await supabase.storage
          .from("guide-profile-images")
          .createSignedUrl(photo.replace("guide-profile-images/", ""), 3600);

        if (signed?.signedUrl) {
          signedUrl = signed.signedUrl;
        } else {
          console.error("❌ Chyba při podepisování obrázku:", signError?.message);
        }
      } else if (photo?.startsWith("http")) {
        signedUrl = photo;
      }

      return {
        ...g,
        profile_image: signedUrl,
      };
    })
  );

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <GlobalHero title="Pan Batoh" subtitle="Objevuj svět s námi" />

      {/* Boxy na hlavní stránce */}
      <div className="max-w-6xl mx-auto px-6 py-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {/* ... odkazy na sekce ... */}
      </div>

      {/* ✅ Výpis schválených průvodců */}
      {signedGuides.length > 0 ? (
        <GuidesTeaser guides={signedGuides} />
      ) : (
        <p className="text-center text-gray-500 py-8">
          Zatím žádní průvodci nejsou k dispozici.
        </p>
      )}
    </div>
  );
}
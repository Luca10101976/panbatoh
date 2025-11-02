import { createServerClientTyped } from "@/lib/supabase-server";
import GlobalHero from "./components/GlobalHero";
import Link from "next/link";
import Image from "next/image";
import GuidesTeaser from "./components/GuidesTeaser";
import type { Database } from "@/types/supabase";

type Guide = Database["public"]["Views"]["public_published_guides"]["Row"];

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
        } else if (signError) {
          console.error("❌ Chyba při podepisování obrázku:", signError.message);
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

      <div className="max-w-6xl mx-auto px-6 py-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/pruvodci"
          className="bg-white border border-[#8ECAE6] rounded-xl shadow hover:shadow-lg transition p-6 flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 mb-4 relative">
            <Image src="/globe.svg" alt="Průvodci" fill className="object-contain" />
          </div>
          <h2 className="text-lg font-bold text-[#0077B6]">Průvodci</h2>
          <p className="text-sm text-gray-600 mt-2">Najdi svého průvodce pro cestu snů.</p>
        </Link>

        <Link
          href="/itinerare"
          className="bg-white border border-[#8ECAE6] rounded-xl shadow hover:shadow-lg transition p-6 flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 mb-4 relative">
            <Image src="/file.svg" alt="Itineráře" fill className="object-contain" />
          </div>
          <h2 className="text-lg font-bold text-[#0077B6]">Itineráře</h2>
          <p className="text-sm text-gray-600 mt-2">Připrav si cestu krok za krokem.</p>
        </Link>

        <Link
          href="/cesty"
          className="bg-white border border-[#8ECAE6] rounded-xl shadow hover:shadow-lg transition p-6 flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 mb-4 relative">
            <Image src="/next.svg" alt="Cesty" fill className="object-contain" />
          </div>
          <h2 className="text-lg font-bold text-[#0077B6]">Cesty</h2>
          <p className="text-sm text-gray-600 mt-2">Inspiruj se dobrodružstvími ostatních.</p>
        </Link>
      </div>

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

import GuideCard from "./GuideCard";

// ✅ id jako string (odpovídá Supabase UUID)
type Guide = {
  id: string;
  name: string;
  countries: string;
  description: string;
  profile_image: string;
};

export default function GuidesTeaser({ guides = [] }: { guides?: Guide[] }) {
  return (
    <div className="max-w-6xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-8">Naši průvodci</h2>

      {guides.length === 0 ? (
        <p className="text-center">Zatím žádní průvodci</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {guides.map((g) => (
            <GuideCard
              key={g.id}
              id={g.id}
              name={g.name}
              countries={g.countries}
              description={g.description}
              imageUrl={g.profile_image || "/hero.jpg"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import PrintButton from './PrintButton';

// ── Typy ──────────────────────────────────────────────────────────────────────
interface Task {
  title: string;
  copy: string;
  options?: string;
}

interface Episode {
  kicker: string;
  title: string;
  intro: string;
  bg: string;
  tasks: Task[];
}

interface GameData {
  meta: {
    title: string;
    subtitle: string;
    printNote: string;
  };
  location: {
    kicker: string;
    title: string;
    subtitle: string;
    story: string[];
    episodes: Episode[];
    finalCard: {
      title: string;
      paragraphs: string[];
    };
    scoreBox: {
      title: string;
    };
  };
}

// ── Načtení dat ───────────────────────────────────────────────────────────────
async function getGameData(slug: string): Promise<GameData | null> {
  // Zkus Supabase
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', `hra_${slug}`)
      .single();
    if (data?.value) return data.value as GameData;
  } catch { /* fallback */ }

  // Fallback na defaultní JSON soubor
  try {
    const def = await import(`@/data/hry/${slug}-default.json`);
    return def.default as GameData;
  } catch {
    return null;
  }
}

// ── Stránka ───────────────────────────────────────────────────────────────────
export default async function HraPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = await getGameData(slug);
  if (!game) notFound();

  const { meta, location: loc } = game;

  return (
    <>
      <style>{`
        @page { size: A4; margin: 12mm; }
        * { box-sizing: border-box; }
        body { font-family: "Inter","Segoe UI","Arial",sans-serif; line-height: 1.45; color: #112038; margin: 0; background: #f5f8ff; }
        h1,h2,h3 { margin: 0; line-height: 1.2; }
        p { margin: 0; }
        .sheet-header { border-radius: 16px; padding: 14px 16px; margin-bottom: 12px; color: #fff; background: linear-gradient(135deg,#0f2142 0%,#1f3a71 70%,#3a4f87 100%); }
        .sheet-title { font-size: 24px; font-weight: 800; }
        .sheet-sub { margin-top: 6px; font-size: 13px; color: rgba(255,255,255,0.9); }
        .location-page { page-break-after: always; border: 1px solid #d9e5ff; border-radius: 16px; background: #fff; overflow: hidden; margin-bottom: 10px; }
        .location-page:last-child { page-break-after: auto; }
        .location-hero { padding: 16px; color: #fff; background: radial-gradient(circle at top right,rgba(182,240,122,0.28),transparent 45%),linear-gradient(135deg,#0f2142 0%,#1f3a71 70%,#2e4f82 100%); }
        .location-kicker { font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(255,255,255,0.82); }
        .location-hero h2 { margin-top: 8px; font-size: 28px; }
        .location-hero p { margin-top: 6px; font-size: 14px; color: rgba(255,255,255,0.92); }
        .story-card,.episode-card,.final-card,.score-box { margin: 12px; border: 1px solid #dfe8ff; border-radius: 14px; padding: 12px; background: #fbfdff; }
        .story-card h3,.episode-card h3,.final-card h3 { font-size: 17px; margin-bottom: 8px; }
        .story-card p + p { margin-top: 8px; }
        .episode-kicker { display: inline-block; padding: 3px 8px; border-radius: 999px; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: #1f3a71; background: #e8f0ff; margin-bottom: 8px; }
        .episode-intro { margin-top: 8px; font-weight: 700; }
        .episode-bg { margin-top: 8px; color: #2c3f60; }
        .tasks-list { margin: 10px 0 0; padding: 0; list-style: none; }
        .task-card { border: 1px dashed #c6d6ff; border-radius: 12px; padding: 10px; background: #ffffff; }
        .task-card + .task-card { margin-top: 8px; }
        .task-head { font-size: 14px; font-weight: 800; margin-bottom: 5px; }
        .task-copy { font-size: 14px; }
        .task-meta { margin-top: 6px; font-size: 13px; color: #38548c; }
        .answer-line { margin-top: 8px; font-size: 14px; color: #2a3f6b; }
        .final-title { font-weight: 800; margin-bottom: 6px; }
        .final-card p + p { margin-top: 8px; }
        .score-box { border-color: #b9d595; background: #f8fff0; }
        .score-title { font-size: 15px; font-weight: 800; color: #324f1a; margin-bottom: 8px; }
        .score-box div + div { margin-top: 6px; }
        .print-note { margin: 0 2px 10px; font-size: 12px; color: #556b90; }
        @media print { .no-print { display: none !important; } body { background: white; } }
      `}</style>

      {/* Tlačítko tisku — skryje se při tisku */}
      <div className="no-print" style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 999 }}>
        <PrintButton />
      </div>

      <header className="sheet-header">
        <div className="sheet-title">{meta.title}</div>
        <div className="sheet-sub">{meta.subtitle}</div>
      </header>

      <p className="print-note">{meta.printNote}</p>

      <section className="location-page">
        <header className="location-hero">
          <div className="location-kicker">{loc.kicker}</div>
          <h2>{loc.title}</h2>
          <p>{loc.subtitle}</p>
        </header>

        <section className="story-card">
          <h3>Příběh mise</h3>
          {loc.story.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </section>

        {loc.episodes.map((ep, epIdx) => (
          <section key={epIdx} className="episode-card">
            <div className="episode-kicker">{ep.kicker}</div>
            <h3>{ep.title}</h3>
            <p className="episode-intro">{ep.intro}</p>
            {ep.bg && <p className="episode-bg">{ep.bg}</p>}
            <ol className="tasks-list">
              {ep.tasks.map((task, tIdx) => (
                <li key={tIdx} className="task-card">
                  <div className="task-head">Úkol {tIdx + 1} • {task.title}</div>
                  <div className="task-copy">{task.copy}</div>
                  {task.options && (
                    <div className="task-meta">
                      <strong>Možnosti:</strong> {task.options}
                    </div>
                  )}
                  <div className="answer-line">
                    Odpověď: ....................................................................................
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ))}

        <section className="final-card">
          <h3>Závěr mise</h3>
          <p className="final-title">{loc.finalCard.title}</p>
          {loc.finalCard.paragraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </section>

        <section className="score-box">
          <div className="score-title">{loc.scoreBox.title}</div>
          <div>Jméno: ............................................</div>
          <div>Správně: ............</div>
          <div>Nevím: ............</div>
          <div>Body celkem: ............</div>
        </section>
      </section>
    </>
  );
}

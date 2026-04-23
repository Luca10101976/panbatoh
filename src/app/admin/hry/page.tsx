'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

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

const SLUG = 'klamovka';

// ── Pomocné komponenty ────────────────────────────────────────────────────────
function Field({
  label, value, onChange, textarea, rows,
}: {
  label: string; value: string; onChange: (v: string) => void;
  textarea?: boolean; rows?: number;
}) {
  const cls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-300';
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      {textarea
        ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows ?? 3} className={cls + ' resize-y'} />
        : <input type="text" value={value} onChange={e => onChange(e.target.value)} className={cls} />
      }
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-6 mb-2 border-b border-gray-100 pb-1">
      {children}
    </h3>
  );
}

// ── Hlavní komponenta ─────────────────────────────────────────────────────────
export default function HryAdminPage() {
  const [game, setGame] = useState<GameData | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState('');
  const [openEp, setOpenEp] = useState<number | null>(null);

  // Načti data z API
  const load = useCallback(async () => {
    const res = await fetch(`/api/hry/${SLUG}`);
    if (res.ok) setGame(await res.json());
  }, []);

  useEffect(() => { load(); }, [load]);

  // Uložit do Supabase
  const save = async () => {
    if (!game) return;
    setSaving(true);
    setErr('');
    const res = await fetch(`/api/hry/${SLUG}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(game),
    });
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } else {
      const d = await res.json().catch(() => ({}));
      setErr(d.error ?? 'Chyba při ukládání');
    }
    setSaving(false);
  };

  // Helpers pro hlubokou mutaci stavu
  function setMeta(field: keyof GameData['meta'], v: string) {
    setGame(g => g ? { ...g, meta: { ...g.meta, [field]: v } } : g);
  }

  function setLoc(field: keyof GameData['location'], v: unknown) {
    setGame(g => g ? { ...g, location: { ...g.location, [field]: v } } : g);
  }

  function setStory(i: number, v: string) {
    if (!game) return;
    const s = [...game.location.story];
    s[i] = v;
    setLoc('story', s);
  }

  function setEpisode(epIdx: number, field: keyof Episode, v: string) {
    if (!game) return;
    const eps = game.location.episodes.map((ep, i) =>
      i === epIdx ? { ...ep, [field]: v } : ep
    );
    setLoc('episodes', eps);
  }

  function setTask(epIdx: number, tIdx: number, field: keyof Task, v: string) {
    if (!game) return;
    const eps = game.location.episodes.map((ep, i) => {
      if (i !== epIdx) return ep;
      const tasks = ep.tasks.map((t, j) =>
        j === tIdx ? { ...t, [field]: v } : t
      );
      return { ...ep, tasks };
    });
    setLoc('episodes', eps);
  }

  function addTask(epIdx: number) {
    if (!game) return;
    const eps = game.location.episodes.map((ep, i) => {
      if (i !== epIdx) return ep;
      return { ...ep, tasks: [...ep.tasks, { title: '', copy: '', options: '' }] };
    });
    setLoc('episodes', eps);
  }

  function removeTask(epIdx: number, tIdx: number) {
    if (!game) return;
    const eps = game.location.episodes.map((ep, i) => {
      if (i !== epIdx) return ep;
      return { ...ep, tasks: ep.tasks.filter((_, j) => j !== tIdx) };
    });
    setLoc('episodes', eps);
  }

  function setFinalPara(i: number, v: string) {
    if (!game) return;
    const p = [...game.location.finalCard.paragraphs];
    p[i] = v;
    setGame(g => g ? { ...g, location: { ...g.location, finalCard: { ...g.location.finalCard, paragraphs: p } } } : g);
  }

  if (!game) {
    return (
      <div className="py-16 text-center text-gray-400 text-sm">Načítám hru…</div>
    );
  }

  return (
    <div className="max-w-3xl">
      {/* Hlavička */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Hra: {game.location.title}</h1>
          <p className="text-sm text-gray-400 mt-1">
            Edituj texty → ulož → otevři{' '}
            <Link href={`/hra/${SLUG}`} target="_blank" className="text-blue-500 underline">
              /hra/{SLUG}
            </Link>{' '}
            a vytiskni
          </p>
        </div>
        <div className="flex items-center gap-3">
          {err && <span className="text-red-500 text-sm">{err}</span>}
          <button
            onClick={save}
            disabled={saving}
            className={`px-5 py-2 rounded-xl font-bold text-sm transition-colors disabled:opacity-50 ${
              saved ? 'bg-green-600 text-white' : 'bg-[#1f3a71] text-white hover:bg-[#0f2142]'
            }`}
          >
            {saving ? 'Ukládám…' : saved ? '✅ Uloženo' : 'Uložit změny'}
          </button>
        </div>
      </div>

      <div className="space-y-4">

        {/* ── Meta ── */}
        <details open className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <summary className="px-5 py-3 font-semibold text-sm cursor-pointer hover:bg-gray-50">
            Záhlaví tiskového listu
          </summary>
          <div className="px-5 pb-5 pt-3 space-y-3 border-t border-gray-100">
            <Field label="Název hry" value={game.meta.title} onChange={v => setMeta('title', v)} />
            <Field label="Podtitulek" value={game.meta.subtitle} onChange={v => setMeta('subtitle', v)} />
            <Field label="Poznámka pro tisk" value={game.meta.printNote} onChange={v => setMeta('printNote', v)} />
          </div>
        </details>

        {/* ── Lokace ── */}
        <details open className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <summary className="px-5 py-3 font-semibold text-sm cursor-pointer hover:bg-gray-50">
            Místo — {game.location.title}
          </summary>
          <div className="px-5 pb-5 pt-3 space-y-3 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Popis místa (kicker)" value={game.location.kicker} onChange={v => setLoc('kicker', v)} />
              <Field label="Název místa" value={game.location.title} onChange={v => setLoc('title', v)} />
            </div>
            <Field label="Podtitulek místa" value={game.location.subtitle} onChange={v => setLoc('subtitle', v)} />

            <SectionTitle>Příběh mise</SectionTitle>
            {game.location.story.map((para, i) => (
              <Field key={i} label={`Odstavec ${i + 1}`} value={para}
                onChange={v => setStory(i, v)} textarea rows={3} />
            ))}
          </div>
        </details>

        {/* ── Zastavení (epizody) ── */}
        {game.location.episodes.map((ep, epIdx) => (
          <details
            key={epIdx}
            open={openEp === epIdx}
            onToggle={e => setOpenEp((e.currentTarget as HTMLDetailsElement).open ? epIdx : null)}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
          >
            <summary className="px-5 py-3 font-semibold text-sm cursor-pointer hover:bg-gray-50 flex items-center gap-3">
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-semibold">{ep.kicker}</span>
              {ep.title}
            </summary>
            <div className="px-5 pb-5 pt-3 space-y-3 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Kicker (Zastavení X)" value={ep.kicker}
                  onChange={v => setEpisode(epIdx, 'kicker', v)} />
                <Field label="Název zastavení" value={ep.title}
                  onChange={v => setEpisode(epIdx, 'title', v)} />
              </div>
              <Field label="Intro (tučný úvod)" value={ep.intro}
                onChange={v => setEpisode(epIdx, 'intro', v)} textarea rows={2} />
              <Field label="Historický kontext" value={ep.bg}
                onChange={v => setEpisode(epIdx, 'bg', v)} textarea rows={3} />

              <SectionTitle>Úkoly</SectionTitle>
              <div className="space-y-3">
                {ep.tasks.map((task, tIdx) => (
                  <div key={tIdx} className="bg-gray-50 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-400">Úkol {tIdx + 1}</span>
                      <button
                        onClick={() => removeTask(epIdx, tIdx)}
                        className="text-xs text-red-400 hover:text-red-600"
                      >✕ Smazat</button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Field label="Název úkolu" value={task.title}
                        onChange={v => setTask(epIdx, tIdx, 'title', v)} />
                      <Field label="Možnosti (oddělené |)" value={task.options ?? ''}
                        onChange={v => setTask(epIdx, tIdx, 'options', v)} />
                    </div>
                    <Field label="Text úkolu" value={task.copy}
                      onChange={v => setTask(epIdx, tIdx, 'copy', v)} textarea rows={2} />
                  </div>
                ))}
                <button
                  onClick={() => addTask(epIdx)}
                  className="text-sm text-blue-600 font-semibold hover:underline"
                >+ Přidat úkol</button>
              </div>
            </div>
          </details>
        ))}

        {/* ── Závěr mise ── */}
        <details className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <summary className="px-5 py-3 font-semibold text-sm cursor-pointer hover:bg-gray-50">
            Závěr mise
          </summary>
          <div className="px-5 pb-5 pt-3 space-y-3 border-t border-gray-100">
            <Field label="Název závěru" value={game.location.finalCard.title}
              onChange={v => setGame(g => g ? { ...g, location: { ...g.location, finalCard: { ...g.location.finalCard, title: v } } } : g)} />
            {game.location.finalCard.paragraphs.map((para, i) => (
              <Field key={i} label={`Odstavec ${i + 1}`} value={para}
                onChange={v => setFinalPara(i, v)} textarea rows={3} />
            ))}
          </div>
        </details>

        {/* ── Score box ── */}
        <details className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <summary className="px-5 py-3 font-semibold text-sm cursor-pointer hover:bg-gray-50">
            Výsledkový list
          </summary>
          <div className="px-5 pb-5 pt-3 border-t border-gray-100">
            <Field label="Nadpis" value={game.location.scoreBox.title}
              onChange={v => setGame(g => g ? { ...g, location: { ...g.location, scoreBox: { title: v } } } : g)} />
          </div>
        </details>

      </div>

      {/* Dolní lišta — tlačítko uložit + odkaz na tisk */}
      <div className="mt-8 flex items-center justify-between flex-wrap gap-3 py-4 border-t border-gray-100">
        <Link
          href={`/hra/${SLUG}`}
          target="_blank"
          className="text-sm text-[#1f3a71] font-semibold hover:underline"
        >
          👁 Náhled hry →
        </Link>
        <button
          onClick={save}
          disabled={saving}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-colors disabled:opacity-50 ${
            saved ? 'bg-green-600 text-white' : 'bg-[#1f3a71] text-white hover:bg-[#0f2142]'
          }`}
        >
          {saving ? 'Ukládám…' : saved ? '✅ Uloženo' : 'Uložit změny'}
        </button>
      </div>
    </div>
  );
}

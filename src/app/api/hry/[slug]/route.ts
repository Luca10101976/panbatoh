import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ── GET — veřejné, vrátí data hry (z DB nebo defaultní JSON) ─────────────────
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const { data } = await supabaseAdmin
      .from('site_settings')
      .select('value')
      .eq('key', `hra_${slug}`)
      .single();

    if (data?.value) {
      return NextResponse.json(data.value);
    }

    // Fallback na defaultní JSON soubor
    const defaultData = await import(`@/data/hry/${slug}-default.json`);
    return NextResponse.json(defaultData.default);
  } catch {
    return NextResponse.json({ error: 'Hra nenalezena' }, { status: 404 });
  }
}

// ── POST — uloží data hry (jen pro přihlášeného admina) ──────────────────────
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Ověř přihlášeného uživatele přes Supabase session
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Neautorizovaný přístup' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Neplatný JSON' }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('site_settings')
    .upsert({ key: `hra_${slug}`, value: body, updated_at: new Date().toISOString() });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

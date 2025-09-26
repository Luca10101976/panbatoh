import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const BUCKET = "guides";

function normalize(p: string) {
  return p.replace(/^\/+/, "").replace(/^guides\//, "");
}

export const dynamic = "force-dynamic";

type SignUrlRequest = {
  path: string;
  expiresIn?: number;
};

export async function POST(req: Request) {
  try {
    const body: SignUrlRequest = await req.json(); // ✅ typ místo `any`
    const { path, expiresIn = 3600 } = body;

    if (!path) {
      return NextResponse.json({ error: "Missing path" }, { status: 400 });
    }

    const key = normalize(path);
    const guideId = Number(key.split("/")[0]);
    if (!Number.isFinite(guideId)) {
      return NextResponse.json({ error: "Bad path" }, { status: 400 });
    }

    const supa = createClient(url, serviceKey, {
      auth: { persistSession: false },
    });

    // povol zobrazit jen schválené
    const { data: g } = await supa
      .from("guides")
      .select("approved")
      .eq("id", guideId)
      .maybeSingle();

    if (!g?.approved) {
      return NextResponse.json({ error: "Not approved" }, { status: 403 });
    }

    const { data, error } = await supa.storage
      .from(BUCKET)
      .createSignedUrl(key, expiresIn);

    if (error || !data?.signedUrl) {
      return NextResponse.json(
        { error: error?.message || "Signing failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: data.signedUrl });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error"; // ✅ žádný `any`
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
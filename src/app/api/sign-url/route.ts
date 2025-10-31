import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const BUCKET = "guide-profile-images";

function normalize(path: string) {
  return path.replace(/^\/+/, "");
}

export const dynamic = "force-dynamic";

type SignUrlRequest = {
  path: string;
  expiresIn?: number;
};

function isUuid(value: string) {
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(value);
}

export async function POST(req: Request) {
  try {
    const body: SignUrlRequest = await req.json();
    const { path, expiresIn = 3600 } = body;

    if (!path) {
      return NextResponse.json({ error: "Missing path" }, { status: 400 });
    }

    const key = normalize(path);
    const relativePath = key.replace(`${BUCKET}/`, "");
    const segments = relativePath.split("/");
    const guideId = segments[0];

    if (!guideId || !isUuid(guideId)) {
      return NextResponse.json({ error: "Invalid guide ID in path" }, { status: 400 });
    }

    const supabase = createClient(url, serviceKey, {
      auth: { persistSession: false },
    });

    // ✅ Opraveno: hledáme v public_published_guides
    const { data: guide, error: guideError } = await supabase
      .from("public_published_guides")
      .select("id")
      .eq("id", guideId)
      .maybeSingle();

    if (guideError) {
      return NextResponse.json({ error: "Supabase error", details: guideError.message }, { status: 500 });
    }

    if (!guide) {
      return NextResponse.json({ error: "Guide not found" }, { status: 404 });
    }

    const { data, error: signError } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(relativePath, expiresIn);

    if (signError || !data?.signedUrl) {
      return NextResponse.json(
        { error: signError?.message || "Signing failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: data.signedUrl });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from("public_published_guides")
    .select(`
      id,
      name,
      description,
      destination,
      focus,
      languages,
      rating,
      profile_image
    `);

  if (error) {
    console.error("❌ Supabase error:", error);
    return NextResponse.json({ error: "Failed to fetch guides" }, { status: 500 });
  }

  return NextResponse.json(data);
}
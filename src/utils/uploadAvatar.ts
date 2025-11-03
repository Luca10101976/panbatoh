// src/utils/uploadAvatar.ts
import { supabase } from "@/lib/supabaseClient";

export async function uploadAvatar(file: File, guideId: string) {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const key = `${guideId}/avatar.${ext}`; // tohle se uloží do guides.profile_image

  // 1) Upload do Supabase storage
  const { error: upErr } = await supabase
    .storage
    .from("guides")
    .upload(key, file, { upsert: true, contentType: file.type || "image/jpeg" });

  if (upErr) throw upErr;

  // 2) Update profile_image v tabulce guides
  const { error: dbErr } = await supabase
    .from("guides")
    .update({ profile_image: key })
    .eq("id", guideId);

  if (dbErr) throw dbErr;

  return key;
}
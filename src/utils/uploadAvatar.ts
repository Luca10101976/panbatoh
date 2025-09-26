import { supabase } from "../supabaseClient";

export async function uploadAvatar(file: File, guideId: number) {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const key = `${guideId}/avatar.${ext}`; // tohle se uloží do guides.photopath

  // 1) upload (RLS povolí jen do vlastního prefixu)
  const { error: upErr } = await supabase
    .storage
    .from("guides")
    .upload(key, file, { upsert: true, contentType: file.type || "image/jpeg" });
  if (upErr) throw upErr;

  // 2) zapsat cestu do DB
  const { error: dbErr } = await supabase
    .from("guides")
    .update({ photopath: key })
    .eq("id", guideId);
  if (dbErr) throw dbErr;

  return key;
}
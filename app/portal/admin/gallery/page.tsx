import type { Metadata } from "next";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { GalleryAdmin } from "./gallery-admin";

export const metadata: Metadata = { title: "Gallery", robots: { index: false } };
export default async function AdminGalleryPage() {
  await requireRole(["super_admin", "committee"], "/portal/admin/gallery");
  const supabase = await createClient();
  const [{ data }, { data: lgas }, { data: stages }] = await Promise.all([
    supabase.from("gallery_items").select("*").order("sort_order").order("created_at", { ascending: false }),
    supabase.from("lgas").select("id, name").order("sort_order"),
    supabase.from("stages").select("id, name, ordinal").order("ordinal"),
  ]);
  return <div><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/50">Organising Committee</p><h1 className="mt-3 font-display text-[clamp(1.9rem,4vw,2.6rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">Gallery</h1><p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-primary/60">Review and publish the photographs shown on the public gallery. Add taxonomy tags so visitors can find moments by place, stage, and content type.</p><div className="mt-10"><GalleryAdmin items={data ?? []} lgas={lgas ?? []} stages={stages ?? []} /></div></div>;
}

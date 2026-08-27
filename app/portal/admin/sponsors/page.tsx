import type { Metadata } from "next";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { SponsorsAdmin } from "./sponsors-admin";

export const metadata: Metadata = { title: "Sponsors", robots: { index: false } };
export default async function AdminSponsorsPage() {
  await requireRole(["super_admin", "committee"], "/portal/admin/sponsors");
  const supabase = await createClient();
  const { data } = await supabase.from("sponsors").select("*").order("sort_order").order("created_at", { ascending: false });
  return <div><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/50">Organising Committee</p><h1 className="mt-3 font-display text-[clamp(1.9rem,4vw,2.6rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">Sponsors &amp; partners</h1><p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-primary/60">Manage the partners credited on the public site. Publish only names and logos approved for public use.</p><div className="mt-10"><SponsorsAdmin sponsors={data ?? []} /></div></div>;
}

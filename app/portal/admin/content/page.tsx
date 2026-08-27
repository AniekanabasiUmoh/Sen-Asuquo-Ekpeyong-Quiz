import type { Metadata } from "next";

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

import { ContentAdmin } from "./content-admin";

export const metadata: Metadata = {
  title: "FAQs and Downloads",
  robots: { index: false },
};

export default async function AdminContentPage() {
  await requireRole(["super_admin", "committee"], "/portal/admin/content");
  const supabase = await createClient();
  const [faqResult, downloadResult] = await Promise.all([
    supabase.from("faqs").select("*").order("sort_order").order("created_at", { ascending: false }),
    supabase.from("downloads").select("*").order("published_at", { ascending: false, nullsFirst: false }).order("created_at", { ascending: false }),
  ]);
  const schemaUnavailable = faqResult.error || downloadResult.error;

  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/50">Organising Committee</p>
      <h1 className="mt-3 font-display text-[clamp(1.9rem,4vw,2.6rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">FAQs &amp; Downloads</h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-primary/60">Manage committee-approved answers and downloadable rules or resources.</p>
      {schemaUnavailable ? (
        <p role="alert" className="mt-10 max-w-2xl rounded-2xl border border-gold/40 bg-gold/10 px-5 py-4 text-[13px] leading-relaxed text-gold-ink">Content management is not enabled in this environment yet. Apply the content CMS migration before creating or publishing FAQs and downloads.</p>
      ) : (
        <div className="mt-10"><ContentAdmin faqs={faqResult.data ?? []} downloads={downloadResult.data ?? []} /></div>
      )}
    </div>
  );
}

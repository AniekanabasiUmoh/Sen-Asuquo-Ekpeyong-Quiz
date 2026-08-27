import type { Metadata } from "next";

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

import { NewsAdmin } from "./news-admin";

export const metadata: Metadata = {
  title: "News management",
  robots: { index: false },
};

export default async function AdminNewsPage() {
  await requireRole(["super_admin", "committee"], "/portal/admin/news");
  const supabase = await createClient();
  const { data } = await supabase.from("news").select("*").order("created_at", { ascending: false });

  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/50">Organising Committee</p>
      <h1 className="mt-3 font-display text-[clamp(1.9rem,4vw,2.6rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">News management</h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-primary/60">
        Draft, review, publish, and archive public championship updates. Anonymous visitors see published articles only.
      </p>
      <div className="mt-9"><NewsAdmin articles={data ?? []} /></div>
    </div>
  );
}

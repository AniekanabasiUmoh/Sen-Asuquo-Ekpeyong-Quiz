import type { Metadata } from "next";

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

import { BroadcastAdmin } from "./broadcast-admin";

export const metadata: Metadata = {
  title: "Broadcast",
  robots: { index: false },
};

export default async function AdminBroadcastPage() {
  await requireRole(["super_admin", "committee"], "/portal/admin/broadcast");
  const supabase = await createClient();

  const [{ data: broadcasts }, { data: matches }] = await Promise.all([
    supabase.from("broadcasts").select("*").order("created_at", { ascending: false }),
    supabase.from("matches").select("id, name").order("created_at", { ascending: false }),
  ]);

  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#003090]/50">
        Organising Committee
      </p>
      <h1 className="mt-3 font-display text-[clamp(1.9rem,4vw,2.6rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
        Broadcast
      </h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[#003090]/60">
        The livestream embed for the public match centre, and the overlay URLs
        the production team adds to OBS or vMix as browser sources.
      </p>

      <div className="mt-9">
        <BroadcastAdmin
          broadcasts={broadcasts ?? []}
          matches={matches ?? []}
        />
      </div>
    </div>
  );
}

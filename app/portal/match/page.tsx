import type { Metadata } from "next";
import Link from "next/link";

import { getSessionUser, isAdmin, requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

import { NewMatchForm } from "./new-match";

export const metadata: Metadata = {
  title: "Matches",
  robots: { index: false },
};

export default async function MatchListPage() {
  await requireUser("/portal/match");
  const user = await getSessionUser();
  const admin = isAdmin(user);
  const supabase = await createClient();

  // RLS narrows this to matches the viewer may see: everything for the
  // committee, assigned fixtures for a judge.
  const [{ data: matches }, { data: fixtures }, { data: schools }] =
    await Promise.all([
      supabase
        .from("matches")
        .select("id, name, status, publish, fixture_id, created_at")
        .order("created_at", { ascending: false }),
      supabase.from("fixtures").select("id, name").order("scheduled_at"),
      admin
        ? supabase
            .from("schools")
            .select("id, name")
            .eq("status", "approved")
            .order("name")
        : Promise.resolve({ data: [] as { id: string; name: string }[] }),
    ]);

  const fixtureName = new Map((fixtures ?? []).map((f) => [f.id, f.name]));

  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#003090]/50">
        {admin ? "Organising Committee" : "Quiz Master"}
      </p>
      <h1 className="mt-3 font-display text-[clamp(1.9rem,4vw,2.6rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
        Matches
      </h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[#003090]/60">
        {admin
          ? "Create a match against a fixture, then run it from the console. Results reach the public only when you publish them."
          : "The matches you are assigned to. Open one to run it."}
      </p>

      <div className="mt-9 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        <section>
          {(matches ?? []).length === 0 ? (
            <p className="rounded-2xl border border-dashed border-black/15 px-5 py-8 text-center text-[13px] text-[#003090]/45">
              {admin ? "No matches yet." : "You have no assigned matches."}
            </p>
          ) : (
            <ul className="space-y-3">
              {(matches ?? []).map((m) => (
                <li key={m.id}>
                  <Link
                    href={`/portal/match/${m.id}`}
                    className="block rounded-[24px] bg-white p-6 transition hover:bg-white/70"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h2 className="font-display text-lg font-bold">{m.name}</h2>
                        <p className="mt-1 text-[13px] text-[#003090]/55">
                          {fixtureName.get(m.fixture_id) ?? "Fixture"}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge
                          label={m.status}
                          tone={m.status === "live" ? "live" : "plain"}
                        />
                        {m.publish === "published" ? (
                          <Badge label="Published" tone="done" />
                        ) : null}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {admin ? (
          <div className="lg:sticky lg:top-28 lg:self-start">
            <NewMatchForm fixtures={fixtures ?? []} schools={schools ?? []} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Badge({ label, tone }: { label: string; tone: "live" | "done" | "plain" }) {
  const tones = {
    live: "bg-[#f44423]/15 text-[#c1300f]",
    done: "bg-[#2dc653]/20 text-[#155d27]",
    plain: "bg-black/[0.06] text-[#003090]/60",
  };
  return (
    <span className={`rounded-full px-3.5 py-1.5 text-[11px] font-bold ${tones[tone]}`}>
      {label.charAt(0).toUpperCase() + label.slice(1)}
    </span>
  );
}

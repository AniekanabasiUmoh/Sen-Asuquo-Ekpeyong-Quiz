import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isAdmin, requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Student } from "@/lib/supabase/types";

import { MatchConsole, type EventRow, type Standing } from "./console";

export const metadata: Metadata = {
  title: "Match console",
  robots: { index: false },
};

export default async function MatchConsolePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireRole(["super_admin", "committee", "judge"], `/portal/match/${id}`);
  const supabase = await createClient();

  // RLS decides visibility: an unassigned judge sees nothing and lands on 404,
  // which is the right answer rather than an access-denied page that confirms
  // the match exists.
  const { data: match } = await supabase
    .from("matches")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!match) notFound();

  const { data: participants } = await supabase
    .from("fixture_participants")
    .select("school_id")
    .eq("fixture_id", match.fixture_id);

  const schoolIds = (participants ?? []).map((p) => p.school_id);

  const [{ data: schools }, { data: students }, { data: standings }, { data: events }] =
    await Promise.all([
      schoolIds.length
        ? supabase.from("schools").select("id, name").in("id", schoolIds)
        : Promise.resolve({ data: [] as { id: string; name: string }[] }),
      schoolIds.length
        ? supabase.from("students").select("*").in("school_id", schoolIds)
        : Promise.resolve({ data: [] as Student[] }),
      supabase.from("match_standings").select("*").eq("match_id", id),
      supabase
        .from("match_events")
        .select("id, school_id, event_type, points, question_no, note, created_at")
        .eq("match_id", id)
        .order("created_at", { ascending: false })
        .limit(60),
    ]);

  const bySchool: Record<string, Student[]> = {};
  for (const s of students ?? []) {
    (bySchool[s.school_id] ??= []).push(s);
  }

  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/50">
        Match console
      </p>
      <h1 className="mt-3 font-display text-[clamp(1.9rem,4vw,2.6rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
        {match.name}
      </h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-primary/60">
        A Striker scores 1 point, an Assist half a point, and a VAR answer
        nothing. Every entry is recorded in the log, and the standings are the
        sum of that log rather than a total anyone types.
      </p>

      <div className="mt-9">
        <MatchConsole
          matchId={id}
          matchName={match.name}
          status={match.status}
          publishState={match.publish}
          schools={schools ?? []}
          students={bySchool}
          standings={(standings ?? []) as Standing[]}
          events={(events ?? []) as EventRow[]}
          isAdmin={isAdmin(user)}
        />
      </div>
    </div>
  );
}

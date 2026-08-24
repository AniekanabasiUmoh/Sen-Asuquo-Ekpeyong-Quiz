"use server";

import { revalidatePath } from "next/cache";

import { requireRole, requireUser, writeAudit } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

/**
 * Quizmaster and judge console, Phase 3 sprint 3.2.
 *
 * Scores are never typed in directly. Every point comes from a recorded event,
 * so a final table can be recomputed from the log rather than argued over. The
 * event table has no update or delete policy: a mistake is corrected by
 * recording an adjustment, which leaves both the error and the correction
 * visible.
 */

export type MatchState = { error?: string; notice?: string };

const ADMIN_ROLES = ["super_admin", "committee"] as const;

/** Points per event, from the RD deck. Stored on the event, not derived later. */
const POINTS: Record<string, number> = {
  striker_correct: 1,
  striker_wrong: 0,
  striker_pass: 0,
  assist_correct: 0.5,
  assist_wrong: 0,
  substitution: 0,
  var_referral: 0,
  penalty: 0,
};

export async function recordEvent(
  _prev: MatchState,
  formData: FormData,
): Promise<MatchState> {
  const user = await requireUser("/portal/match");
  const supabase = await createClient();

  const matchId = String(formData.get("match_id") ?? "");
  const schoolId = String(formData.get("school_id") ?? "");
  const eventType = String(formData.get("event_type") ?? "");
  const studentId = String(formData.get("student_id") ?? "");
  const questionNo = String(formData.get("question_no") ?? "");
  const note = String(formData.get("note") ?? "").trim();

  if (!matchId || !schoolId) return { error: "Missing match or school." };
  if (!(eventType in POINTS)) return { error: "Unknown event type." };

  const { error } = await supabase.from("match_events").insert({
    match_id: matchId,
    school_id: schoolId,
    student_id: studentId || null,
    event_type: eventType as never,
    points: POINTS[eventType],
    question_no: questionNo ? Number(questionNo) : null,
    note: note || null,
    recorded_by: user.id,
  });

  if (error) return { error: `Could not record it: ${error.message}` };

  revalidatePath(`/portal/match/${matchId}`);
  return { notice: "Recorded." };
}

/** Coach substitution: an Assist comes on for a Striker. Scores nothing. */
export async function recordSubstitution(
  _prev: MatchState,
  formData: FormData,
): Promise<MatchState> {
  const user = await requireUser("/portal/match");
  const supabase = await createClient();

  const matchId = String(formData.get("match_id") ?? "");
  const schoolId = String(formData.get("school_id") ?? "");
  const out = String(formData.get("student_out") ?? "");
  const inn = String(formData.get("student_in") ?? "");

  if (!out || !inn) return { error: "Choose who comes off and who comes on." };
  if (out === inn) return { error: "That is the same student." };

  const { error } = await supabase.from("match_events").insert({
    match_id: matchId,
    school_id: schoolId,
    event_type: "substitution",
    points: 0,
    student_out: out,
    student_in: inn,
    recorded_by: user.id,
  });

  if (error) return { error: `Could not record it: ${error.message}` };

  revalidatePath(`/portal/match/${matchId}`);
  return { notice: "Substitution recorded." };
}

/**
 * Manual adjustment. Requires a reason, and is itself an event, so the trail
 * shows what was changed and why rather than a total that silently moved.
 */
export async function adjustScore(
  _prev: MatchState,
  formData: FormData,
): Promise<MatchState> {
  const user = await requireRole(ADMIN_ROLES, "/portal/match");
  const supabase = await createClient();

  const matchId = String(formData.get("match_id") ?? "");
  const schoolId = String(formData.get("school_id") ?? "");
  const points = Number(formData.get("points") ?? 0);
  const reason = String(formData.get("reason") ?? "").trim();

  if (!reason) return { error: "Give a reason for the adjustment." };
  if (!Number.isFinite(points) || points === 0) {
    return { error: "Enter the number of points to add or subtract." };
  }

  const { error } = await supabase.from("match_events").insert({
    match_id: matchId,
    school_id: schoolId,
    event_type: "adjustment",
    points,
    note: reason,
    recorded_by: user.id,
  });

  if (error) return { error: `Could not adjust: ${error.message}` };

  await writeAudit({
    action: "match.score_adjusted",
    entity: "matches",
    entityId: matchId,
    after: { school_id: schoolId, points },
    reason,
  });

  revalidatePath(`/portal/match/${matchId}`);
  return { notice: `Adjustment of ${points > 0 ? "+" : ""}${points} recorded.` };
}

export async function setMatchStatus(
  _prev: MatchState,
  formData: FormData,
): Promise<MatchState> {
  await requireUser("/portal/match");
  const supabase = await createClient();

  const matchId = String(formData.get("match_id") ?? "");
  const status = String(formData.get("status") ?? "");

  const patch: Record<string, unknown> = { status };
  if (status === "live") patch.started_at = new Date().toISOString();
  if (status === "completed") patch.ended_at = new Date().toISOString();

  const { error } = await supabase
    .from("matches")
    .update(patch as never)
    .eq("id", matchId);

  if (error) return { error: `Could not update: ${error.message}` };

  revalidatePath(`/portal/match/${matchId}`);
  return { notice: `Match ${status}.` };
}

/**
 * Publishes the standings as official results.
 *
 * Committee only, enforced in the database function as well as here. Takes a
 * snapshot rather than leaving results as a live query, so a later event cannot
 * silently rewrite a published table.
 */
export async function publishResults(
  _prev: MatchState,
  formData: FormData,
): Promise<MatchState> {
  await requireRole(ADMIN_ROLES, "/portal/match");
  const supabase = await createClient();

  const matchId = String(formData.get("match_id") ?? "");
  const { data, error } = await supabase.rpc("publish_match_results", {
    target_match: matchId,
  });

  if (error) return { error: `Could not publish: ${error.message}` };

  await writeAudit({
    action: "match.results_published",
    entity: "matches",
    entityId: matchId,
    after: { rows: data },
  });

  revalidatePath(`/portal/match/${matchId}`);
  revalidatePath("/results");
  return { notice: `Published results for ${data} schools.` };
}

export async function createMatch(
  _prev: MatchState,
  formData: FormData,
): Promise<MatchState> {
  await requireRole(ADMIN_ROLES, "/portal/match");
  const supabase = await createClient();

  const fixtureId = String(formData.get("fixture_id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const schoolIds = formData.getAll("school_ids").map(String).filter(Boolean);

  if (!fixtureId) return { error: "Select a fixture." };
  if (!name) return { error: "Give the match a name." };

  const { data: match, error } = await supabase
    .from("matches")
    .insert({ fixture_id: fixtureId, name })
    .select("id")
    .single();

  if (error) return { error: `Could not create the match: ${error.message}` };

  // Grand Finale rounds, per the RD deck.
  const rounds = [
    { ordinal: 1, name: "Advanced Mathematics and English" },
    { ordinal: 2, name: "Advanced Science, Art and Commercial" },
    { ordinal: 3, name: "Advanced Current Affairs Showdown" },
    { ordinal: 4, name: "Advanced General Knowledge" },
  ];
  await supabase
    .from("match_rounds")
    .insert(rounds.map((r) => ({ ...r, match_id: match.id })));

  if (schoolIds.length) {
    await supabase.from("fixture_participants").insert(
      schoolIds.map((school_id) => ({ fixture_id: fixtureId, school_id })),
    );
  }

  await writeAudit({
    action: "match.created",
    entity: "matches",
    entityId: match.id,
    after: { name },
  });

  revalidatePath("/portal/match");
  return { notice: `${name} created.` };
}

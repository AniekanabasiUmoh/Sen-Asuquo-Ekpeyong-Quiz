"use client";

import { useActionState } from "react";
import { FormError, FormNotice, SubmitButton, Textarea } from "@/components/form";
import type { Appeal, AppealStatus } from "@/lib/supabase/types";
import { updateAppeal, type AppealAdminState } from "./actions";

const EMPTY: AppealAdminState = {};
const STATUSES: AppealStatus[] = ["submitted", "under_review", "resolved", "rejected", "withdrawn"];
export function AppealsAdmin({ appeals, schoolNames }: { appeals: Appeal[]; schoolNames: Record<string, string> }) {
  const [state, action, pending] = useActionState(updateAppeal, EMPTY);
  return <div><FormError message={state.error} /><FormNotice message={state.notice} />{appeals.length ? <ul className="mt-6 space-y-4">{appeals.map((appeal) => <li key={appeal.id} className="rounded-[24px] bg-white p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="font-display text-lg font-bold">{appeal.subject}</h2><p className="mt-1 text-[12px] capitalize text-primary/50">{appeal.kind} · {schoolNames[appeal.school_id] || "School"} · {new Date(appeal.created_at).toLocaleString("en-GB")}</p></div><span className="rounded-full bg-black/[0.05] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary/60">{appeal.status.replace("_", " ")}</span></div><p className="mt-4 whitespace-pre-wrap text-[14px] leading-relaxed text-primary/65">{appeal.details}</p>{appeal.evidence_url ? <a href={appeal.evidence_url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-[12px] font-semibold underline">View evidence</a> : null}<form action={action} className="mt-5 grid gap-4 border-t border-black/10 pt-5 sm:grid-cols-[auto_1fr_auto] sm:items-end"><input type="hidden" name="appeal_id" value={appeal.id} /><label className="text-[12px] font-semibold text-primary">Status<select name="status" defaultValue={appeal.status} className="mt-1.5 block rounded-xl border border-black/15 bg-white px-3 py-2 text-[13px]">{STATUSES.map((status) => <option key={status} value={status}>{status.replace("_", " ")}</option>)}</select></label><Textarea label="Committee response" name="resolution" rows={2} defaultValue={appeal.resolution || ""} /><SubmitButton pending={pending}>Save response</SubmitButton></form></li>)}</ul> : <p className="mt-5 rounded-2xl border border-dashed border-black/15 px-5 py-8 text-center text-[13px] text-primary/45">No appeals have been submitted.</p>}</div>;
}

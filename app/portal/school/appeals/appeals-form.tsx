"use client";

import { useActionState } from "react";
import { FormError, FormNotice, Input, Select, SubmitButton, Textarea } from "@/components/form";
import { submitAppeal, type AppealState } from "./actions";

const EMPTY: AppealState = {};
export function AppealForm() {
  const [state, action, pending] = useActionState(submitAppeal, EMPTY);
  return <form action={action} className="mt-6 rounded-[28px] bg-white p-7"><div className="space-y-5"><FormError message={state.error} /><FormNotice message={state.notice} /><Select label="Appeal type" name="kind" required placeholder="Choose one" options={[{ value: "registration", label: "Registration" }, { value: "result", label: "Result or score" }, { value: "schedule", label: "Schedule or venue" }, { value: "other", label: "Other" }]} /><Input label="Subject" name="subject" required placeholder="Clarification about our result" /><Textarea label="Details" name="details" required rows={6} hint="Include the relevant fixture, stage or registration detail. Do not include unnecessary student information." /><Input label="Evidence link (optional)" name="evidence_url" type="url" placeholder="https://..." /><SubmitButton pending={pending}>Submit appeal</SubmitButton></div></form>;
}

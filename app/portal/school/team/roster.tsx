"use client";

import { useActionState } from "react";

import {
  FormError,
  FormNotice,
  Input,
  Select,
  SubmitButton,
} from "@/components/form";
import type { SchoolDocument, Student } from "@/lib/supabase/types";

import {
  addStudent,
  deleteSchoolDocument,
  removeStudent,
  setConsent,
  uploadSchoolDocument,
  uploadStudentPhoto,
  type RosterState,
} from "./actions";

const EMPTY: RosterState = {};

export type RosterCounts = {
  total: number;
  strikers: number;
  assists: number;
  is_valid: boolean;
};

const STREAM_LABEL: Record<string, string> = {
  science: "Science",
  art: "Art",
  commercial: "Commercial",
};

export function Roster({
  students,
  counts,
  photoUrls,
  locked,
}: {
  students: Student[];
  counts: RosterCounts;
  photoUrls: Record<string, string>;
  locked: boolean;
}) {
  const [addState, addAction, addPending] = useActionState(addStudent, EMPTY);

  const strikers = students.filter((s) => s.is_striker);
  const assists = students.filter((s) => !s.is_striker);

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Count label="Strikers" value={counts.strikers} of={3} />
        <Count label="Assists" value={counts.assists} of={2} />
        <Count label="Team" value={counts.total} of={5} />
      </div>

      {counts.is_valid ? (
        <p
          role="status"
          className="mt-5 rounded-2xl border border-grass/30 bg-grass/8 px-5 py-3.5 text-[13px] font-semibold text-forest"
        >
          The team is complete: 3 Strikers and 2 Assists.
        </p>
      ) : null}

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
        <div>
          <Group
            title="Strikers"
            note="Three students who answer in their own right."
            students={strikers}
            photoUrls={photoUrls}
            locked={locked}
          />
          <div className="mt-10">
            <Group
              title="Assists"
              note="Two students who support the Strikers. An Assist answer is worth 0.5 points."
              students={assists}
              photoUrls={photoUrls}
              locked={locked}
            />
          </div>
        </div>

        {!locked && counts.total < 5 ? (
          <div className="lg:sticky lg:top-28 lg:self-start">
            <form action={addAction} className="rounded-[28px] bg-white p-7 sm:p-8">
              <h3 className="font-display text-lg font-bold">Add a student</h3>
              <div className="mt-5 space-y-5">
                <FormError message={addState.error} />
                <FormNotice message={addState.notice} />
                <Input label="Full name" name="full_name" required />
                <Select
                  label="Stream"
                  name="stream"
                  required
                  placeholder="Select a stream"
                  options={[
                    { value: "science", label: "Science" },
                    { value: "art", label: "Art" },
                    { value: "commercial", label: "Commercial" },
                  ]}
                />
                <Select
                  label="Role"
                  name="is_striker"
                  required
                  options={[
                    { value: "striker", label: `Striker (${counts.strikers} of 3)` },
                    { value: "assist", label: `Assist (${counts.assists} of 2)` },
                  ]}
                />
                <Input label="Class" name="class_level" placeholder="SS2" />
                <Input label="Date of birth" name="date_of_birth" type="date" />
                <SubmitButton pending={addPending}>Add student</SubmitButton>
              </div>
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Count({ label, value, of }: { label: string; value: number; of: number }) {
  const done = value >= of;
  return (
    <div className="rounded-[22px] bg-white p-6">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary/45">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl font-extrabold tabular-nums">
        <span className={done ? "text-forest" : undefined}>{value}</span>
        <span className="text-primary/30"> / {of}</span>
      </p>
    </div>
  );
}

function Group({
  title,
  note,
  students,
  photoUrls,
  locked,
}: {
  title: string;
  note: string;
  students: Student[];
  photoUrls: Record<string, string>;
  locked: boolean;
}) {
  return (
    <section>
      <h3 className="font-display text-xl font-bold">{title}</h3>
      <p className="mt-1.5 text-[14px] leading-relaxed text-primary/55">{note}</p>
      {students.length === 0 ? (
        <p className="mt-5 rounded-2xl border border-dashed border-black/15 px-5 py-6 text-center text-[13px] text-primary/45">
          None added yet.
        </p>
      ) : (
        <ul className="mt-5 space-y-3">
          {students.map((s) => (
            <StudentCard
              key={s.id}
              student={s}
              photoUrl={photoUrls[s.id]}
              locked={locked}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function StudentCard({
  student,
  photoUrl,
  locked,
}: {
  student: Student;
  photoUrl?: string;
  locked: boolean;
}) {
  const [removeState, removeAction, removePending] = useActionState(
    removeStudent,
    EMPTY,
  );
  const [consentState, consentAction, consentPending] = useActionState(
    setConsent,
    EMPTY,
  );
  const [photoState, photoAction, photoPending] = useActionState(
    uploadStudentPhoto,
    EMPTY,
  );

  return (
    <li className="rounded-[24px] bg-white p-6">
      <div className="flex flex-wrap items-start gap-5">
        <div className="h-16 w-16 flex-none overflow-hidden rounded-2xl bg-primary/8">
          {photoUrl ? (
            // Signed URL from a private bucket, so next/image cannot optimise it.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photoUrl}
              alt={student.full_name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center font-display text-lg font-bold text-primary/25">
              {student.full_name.charAt(0)}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="font-display text-base font-bold">{student.full_name}</h4>
          <p className="mt-1 text-[13px] text-primary/55">
            {STREAM_LABEL[student.stream] ?? student.stream}
            {student.class_level ? ` · ${student.class_level}` : ""}
          </p>
          <p className="mt-2 text-[12px] font-semibold">
            {student.consent_given ? (
              <span className="text-forest">Consent recorded</span>
            ) : (
              <span className="text-red-ink">Consent not yet recorded</span>
            )}
          </p>
        </div>

        {!locked ? (
          <form action={removeAction}>
            <input type="hidden" name="student_id" value={student.id} />
            <button
              type="submit"
              disabled={removePending}
              className="rounded-full border border-black/15 px-4 py-2 text-[12px] font-semibold transition hover:bg-cream disabled:opacity-55"
            >
              Remove
            </button>
          </form>
        ) : null}
      </div>

      <FormError message={removeState.error ?? consentState.error ?? photoState.error} />
      <FormNotice message={consentState.notice ?? photoState.notice} />

      {!locked ? (
        <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-black/10 pt-4">
          <form action={consentAction}>
            <input type="hidden" name="student_id" value={student.id} />
            <input
              type="hidden"
              name="consent"
              value={student.consent_given ? "0" : "1"}
            />
            <button
              type="submit"
              disabled={consentPending}
              className="rounded-full border border-black/15 px-4 py-2 text-[12px] font-semibold transition hover:bg-cream disabled:opacity-55"
            >
              {student.consent_given ? "Withdraw consent" : "Record consent"}
            </button>
          </form>

          <form action={photoAction} className="flex flex-wrap items-center gap-3">
            <input type="hidden" name="student_id" value={student.id} />
            <label className="text-[12px] font-semibold text-primary/60">
              <span className="sr-only">Photograph for {student.full_name}</span>
              <input
                type="file"
                name="photo"
                accept="image/jpeg,image/png,image/webp"
                className="w-52 text-[12px] file:mr-3 file:rounded-full file:border-0 file:bg-primary/8 file:px-4 file:py-2 file:text-[12px] file:font-semibold file:text-primary"
              />
            </label>
            <button
              type="submit"
              disabled={photoPending}
              className="rounded-full border border-black/15 px-4 py-2 text-[12px] font-semibold transition hover:bg-cream disabled:opacity-55"
            >
              {photoPending ? "Uploading…" : "Upload"}
            </button>
          </form>
        </div>
      ) : null}
    </li>
  );
}

export function Documents({
  documents,
  locked,
}: {
  documents: SchoolDocument[];
  locked: boolean;
}) {
  const [upState, upAction, upPending] = useActionState(uploadSchoolDocument, EMPTY);
  const [delState, delAction] = useActionState(deleteSchoolDocument, EMPTY);

  return (
    <section className="mt-14">
      <h2 className="font-display text-xl font-bold">Supporting documents</h2>
      <p className="mt-1.5 max-w-2xl text-[14px] leading-relaxed text-primary/55">
        Anything the committee has asked for: a letter from the principal, proof
        of registration, or consent forms. Files are private to your school and
        the committee.
      </p>

      <FormError message={upState.error ?? delState.error} />
      <FormNotice message={upState.notice ?? delState.notice} />

      {documents.length > 0 ? (
        <ul className="mt-5 space-y-3">
          {documents.map((d) => (
            <li
              key={d.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-[22px] bg-white p-5"
            >
              <div>
                <p className="font-display text-[15px] font-bold">{d.label}</p>
                <p className="mt-0.5 text-[12px] text-primary/50">
                  {d.size_bytes
                    ? `${(d.size_bytes / 1024).toFixed(0)} KB`
                    : "Uploaded"}
                </p>
              </div>
              {!locked ? (
                <form action={delAction}>
                  <input type="hidden" name="document_id" value={d.id} />
                  <button
                    type="submit"
                    className="rounded-full border border-black/15 px-4 py-2 text-[12px] font-semibold transition hover:bg-cream"
                  >
                    Remove
                  </button>
                </form>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}

      {!locked ? (
        <form
          action={upAction}
          className="mt-5 flex flex-wrap items-end gap-4 rounded-[24px] bg-white p-6"
        >
          <div className="min-w-[14rem] flex-1">
            <Input label="Document name" name="label" placeholder="Principal's letter" />
          </div>
          <label className="text-[12px] font-semibold text-primary/60">
            <span className="sr-only">Choose a file</span>
            <input
              type="file"
              name="document"
              accept="application/pdf,image/jpeg,image/png,image/webp"
              className="w-60 text-[12px] file:mr-3 file:rounded-full file:border-0 file:bg-primary/8 file:px-4 file:py-2 file:text-[12px] file:font-semibold file:text-primary"
            />
          </label>
          <SubmitButton pending={upPending} className="!px-6 !py-3">
            Upload
          </SubmitButton>
        </form>
      ) : null}
    </section>
  );
}

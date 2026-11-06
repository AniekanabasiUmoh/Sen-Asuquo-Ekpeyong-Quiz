import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "School details", robots: { index: false, follow: false } };

export default async function SchoolDetails({ params }: { params: Promise<{ id: string }> }) {
  await requireRole(["super_admin", "committee"], "/portal/admin");
  const { id } = await params;
  if (!/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(id)) notFound();
  const db = await createClient();
  const schoolResult = await db.from("schools").select("*").eq("id", id).maybeSingle();
  if (schoolResult.error) throw new Error("Could not load this school. Please try again.");
  const school = schoolResult.data;
  if (!school) notFound();
  const [studentsResult, coachesResult, documentsResult, lgaResult] = await Promise.all([
    db.from("students").select("*").eq("school_id", id).order("created_at"),
    db.from("coaches").select("*").eq("school_id", id),
    db.from("school_documents").select("*").eq("school_id", id),
    db.from("lgas").select("name").eq("id", school.lga_id).maybeSingle(),
  ]);
  if (studentsResult.error || coachesResult.error || documentsResult.error || lgaResult.error) throw new Error("Some school details could not be loaded. Please refresh and try again.");
  const students = studentsResult.data ?? [];
  const photos = await Promise.all(students.map(async (student) => {
    if (!student.photo_path) return { id: student.id, preview: null, download: null };
    const bucket = db.storage.from("student-photos");
    const [preview, download] = await Promise.all([
      bucket.createSignedUrl(student.photo_path, 600),
      bucket.createSignedUrl(student.photo_path, 600, { download: true }),
    ]);
    return { id: student.id, preview: preview.data?.signedUrl, download: download.data?.signedUrl };
  }));
  const documents = await Promise.all((documentsResult.data ?? []).map(async (doc) => {
    const result = await db.storage.from("school-documents").createSignedUrl(doc.storage_path, 600, { download: true });
    return { ...doc, url: result.data?.signedUrl };
  }));
  return <div className="max-w-5xl">
    <Link href="/portal/admin" className="text-sm font-semibold underline underline-offset-4">Back to school registrations</Link>
    <h1 className="mt-6 break-words font-display text-3xl font-extrabold">{school.name}</h1>
    <p className="mt-3 text-sm text-primary/75">{school.status.replaceAll("_", " ")} · {school.registration_no || "No registration number yet"}</p>
    <p className="mt-4 text-sm text-primary/75">Private committee records. Download only for authorised championship work. Photo links expire after 10 minutes; refresh this page to renew them.</p>
    {school.status === "draft" && <p className="mt-5 rounded-2xl border border-gold bg-white p-4">This registration is saved as a draft and has not been submitted. The details below may be incomplete.</p>}
    <section className="mt-9 rounded-3xl bg-white p-6">
      <h2 className="font-display text-xl font-bold">School and coordinator</h2>
      <dl className="mt-5 grid gap-4 sm:grid-cols-2">
        <Detail label="LGA" value={lgaResult.data?.name} /><Detail label="School type" value={school.is_private ? "Private" : "Public"} />
        <Detail label="Principal" value={school.principal_name} /><Detail label="Coordinator" value={school.contact_name} />
        <Detail label="Email" value={school.contact_email} /><Detail label="Phone" value={school.contact_phone} />
        <Detail label="Address" value={school.address} /><Detail label="Submitted" value={school.submitted_at ? new Date(school.submitted_at).toLocaleDateString("en-GB") : "Not submitted"} />
        {school.rejection_reason && <Detail label="Review reason" value={school.rejection_reason} />}
      </dl>
    </section>
    <section className="mt-10">
      <div className="flex flex-wrap items-center justify-between gap-4"><h2 className="font-display text-xl font-bold">Students ({students.length})</h2><a href={`/portal/admin/schools/${id}/export`} className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white">Download details (CSV)</a></div>
      {!students.length && <p className="mt-5 text-primary/75">No students have been saved for this school yet.</p>}
      <ul className="mt-5 space-y-5">{students.map((student) => {
        const photo = photos.find((p) => p.id === student.id);
        return <li key={student.id} className="flex flex-col gap-6 rounded-3xl bg-white p-6 sm:flex-row">
          <div className="w-36 shrink-0">
            {/* Private, short-lived URLs are intentionally not sent through the image optimiser. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {photo?.preview ? <img src={photo.preview} alt={`Passport of ${student.full_name}`} width={144} height={180} className="h-44 w-36 rounded-xl object-contain" /> : <p className="rounded-xl bg-cream p-4 text-sm">{student.photo_path ? "Photo unavailable. Refresh or contact support." : "No passport uploaded"}</p>}
            {photo?.preview && <a href={photo.preview} target="_blank" rel="noreferrer" className="mt-3 block text-sm font-semibold underline">Open passport</a>}
            {photo?.download && <a href={photo.download} className="mt-3 block text-sm font-semibold underline">Download passport</a>}
          </div>
          <div className="min-w-0 flex-1"><h3 className="break-words font-display text-lg font-bold">{student.full_name}</h3><dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <Detail label="Team role" value={student.is_striker ? "Striker" : "Assist"} /><Detail label="Stream" value={student.stream} />
            <Detail label="Class" value={student.class_level} /><Detail label="Date of birth" value={student.date_of_birth} />
            <Detail label="Consent" value={student.consent_withdrawn_at ? "Withdrawn — not for public use" : student.consent_given ? "Recorded" : "Not recorded — not for public use"} />
          </dl></div>
        </li>;
      })}</ul>
    </section>
    <section className="mt-10"><h2 className="font-display text-xl font-bold">Coaches</h2>{!(coachesResult.data ?? []).length && <p className="mt-4 text-primary/75">No coach details saved yet.</p>}<ul className="mt-4 space-y-4">{coachesResult.data?.map((coach) => <li key={coach.id} className="break-words rounded-2xl bg-white p-5"><h3 className="font-bold">{coach.full_name}</h3><p className="mt-2">{coach.email || "No email provided"}</p><p>{coach.phone || "No phone provided"}</p></li>)}</ul></section>
    <section className="mt-10"><h2 className="font-display text-xl font-bold">Supporting documents</h2>{!documents.length && <p className="mt-4 text-primary/75">No supporting documents uploaded.</p>}<ul className="mt-4 space-y-3">{documents.map((doc) => <li key={doc.id}>{doc.url ? <a href={doc.url} className="break-words font-semibold underline">Download {doc.label}</a> : <span>{doc.label} — unavailable; refresh to retry</span>}</li>)}</ul></section>
  </div>;
}

function Detail({ label, value }: { label: string; value: string | null | undefined }) {
  return <div className="min-w-0"><dt className="text-xs font-semibold text-primary/75">{label}</dt><dd className="mt-1 break-words text-sm">{value || "Not provided"}</dd></div>;
}

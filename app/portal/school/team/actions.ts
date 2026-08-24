"use server";

import { revalidatePath } from "next/cache";

import { requireUser, writeAudit } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Stream } from "@/lib/supabase/types";

/**
 * Student roster: the five qualifying students a school sends forward.
 *
 * Team shape is the competition's, not the UI's: 3 Strikers and 2 Assists, the
 * mentor being the Coach. The database caps the roster at five and
 * roster_status() reports whether the 3/2 split is met; neither is enforced
 * here, so a school can build the team over several sittings.
 */

export type RosterState = { error?: string; notice?: string };

const STREAMS: Stream[] = ["science", "art", "commercial"];

async function ownSchool() {
  const user = await requireUser("/portal/school/team");
  const supabase = await createClient();
  const { data } = await supabase
    .from("schools")
    .select("id, status, name")
    .eq("owner_id", user.id)
    .maybeSingle();
  return { user, supabase, school: data };
}

export async function addStudent(
  _prev: RosterState,
  formData: FormData,
): Promise<RosterState> {
  const { supabase, school } = await ownSchool();
  if (!school) return { error: "Register your school before adding students." };

  const fullName = String(formData.get("full_name") ?? "").trim();
  const stream = String(formData.get("stream") ?? "") as Stream;
  const isStriker = formData.get("is_striker") === "striker";
  const classLevel = String(formData.get("class_level") ?? "").trim();
  const dob = String(formData.get("date_of_birth") ?? "").trim();

  if (!fullName) return { error: "Enter the student's full name." };
  if (!STREAMS.includes(stream)) return { error: "Select the student's stream." };

  // Guard the 3/2 split before the insert so the message names the problem,
  // rather than letting the roster cap fire with a blunter one.
  const { data: counts } = await supabase.rpc("roster_status", {
    target: school.id,
  });
  const current = counts?.[0];
  if (current) {
    if (isStriker && current.strikers >= 3) {
      return { error: "There are already 3 Strikers. Add this student as an Assist." };
    }
    if (!isStriker && current.assists >= 2) {
      return { error: "There are already 2 Assists. Add this student as a Striker." };
    }
    if (current.total >= 5) {
      return { error: "The team is complete: 3 Strikers and 2 Assists." };
    }
  }

  const { data: created, error } = await supabase
    .from("students")
    .insert({
      school_id: school.id,
      full_name: fullName,
      stream,
      is_striker: isStriker,
      class_level: classLevel || null,
      date_of_birth: dob || null,
    })
    .select("id")
    .single();

  if (error) return { error: `Could not add the student: ${error.message}` };

  await writeAudit({
    action: "student.added",
    entity: "students",
    entityId: created?.id,
    after: { full_name: fullName, stream, is_striker: isStriker },
  });

  revalidatePath("/portal/school/team");
  return { notice: `${fullName} added.` };
}

export async function removeStudent(
  _prev: RosterState,
  formData: FormData,
): Promise<RosterState> {
  const { supabase, school } = await ownSchool();
  if (!school) return { error: "No school found for this account." };

  const id = String(formData.get("student_id") ?? "");
  if (!id) return { error: "No student given." };

  const { data: before } = await supabase
    .from("students")
    .select("full_name")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase
    .from("students")
    .delete()
    .eq("id", id)
    .eq("school_id", school.id);

  if (error) return { error: `Could not remove the student: ${error.message}` };

  await writeAudit({
    action: "student.removed",
    entity: "students",
    entityId: id,
    before: before ?? undefined,
  });

  revalidatePath("/portal/school/team");
  return { notice: `${before?.full_name ?? "Student"} removed.` };
}

/**
 * Records guardian or school consent for a student's photograph and details to
 * appear publicly.
 *
 * consent_at is set with it: the schema refuses consent_given without a
 * timestamp, because "when was this given" is the first question anyone asks of
 * a consent record for a minor.
 */
export async function setConsent(
  _prev: RosterState,
  formData: FormData,
): Promise<RosterState> {
  const { supabase, school } = await ownSchool();
  if (!school) return { error: "No school found for this account." };

  const id = String(formData.get("student_id") ?? "");
  const given = formData.get("consent") === "1";

  const { error } = await supabase
    .from("students")
    .update({
      consent_given: given,
      consent_at: given ? new Date().toISOString() : null,
    })
    .eq("id", id)
    .eq("school_id", school.id);

  if (error) return { error: `Could not record consent: ${error.message}` };

  await writeAudit({
    action: given ? "student.consent_given" : "student.consent_withdrawn",
    entity: "students",
    entityId: id,
    after: { consent_given: given },
  });

  revalidatePath("/portal/school/team");
  return {
    notice: given ? "Consent recorded." : "Consent withdrawn.",
  };
}

/**
 * Uploads a student photograph to the private student-photos bucket.
 *
 * Private, not public: a public bucket means a guessable URL is world-readable
 * regardless of the consent flag, and these are photographs of minors. Reads go
 * through short-lived signed URLs instead.
 */
export async function uploadStudentPhoto(
  _prev: RosterState,
  formData: FormData,
): Promise<RosterState> {
  const { supabase, school } = await ownSchool();
  if (!school) return { error: "No school found for this account." };

  const id = String(formData.get("student_id") ?? "");
  const file = formData.get("photo");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose a photograph to upload." };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { error: "That photograph is larger than 5MB. Please use a smaller one." };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${school.id}/${id}-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("student-photos")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (uploadError) return { error: `Upload failed: ${uploadError.message}` };

  const { error } = await supabase
    .from("students")
    .update({ photo_path: path })
    .eq("id", id)
    .eq("school_id", school.id);

  if (error) return { error: `Uploaded, but could not save: ${error.message}` };

  revalidatePath("/portal/school/team");
  return { notice: "Photograph uploaded." };
}

/** Supporting document for the registration itself, not a student. */
export async function uploadSchoolDocument(
  _prev: RosterState,
  formData: FormData,
): Promise<RosterState> {
  const { user, supabase, school } = await ownSchool();
  if (!school) return { error: "Register your school before uploading documents." };

  const label = String(formData.get("label") ?? "").trim();
  const file = formData.get("document");

  if (!label) return { error: "Give the document a name." };
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose a file to upload." };
  }
  if (file.size > 10 * 1024 * 1024) {
    return { error: "That file is larger than 10MB. Please use a smaller one." };
  }

  const safe = file.name.replace(/[^\w.-]/g, "_").slice(-60);
  const path = `${school.id}/${Date.now()}-${safe}`;

  const { error: uploadError } = await supabase.storage
    .from("school-documents")
    .upload(path, file, { contentType: file.type });

  if (uploadError) return { error: `Upload failed: ${uploadError.message}` };

  const { error } = await supabase.from("school_documents").insert({
    school_id: school.id,
    label,
    storage_path: path,
    mime_type: file.type || null,
    size_bytes: file.size,
    uploaded_by: user.id,
  });

  if (error) return { error: `Uploaded, but could not record it: ${error.message}` };

  await writeAudit({
    action: "document.uploaded",
    entity: "school_documents",
    entityId: school.id,
    after: { label, path },
  });

  revalidatePath("/portal/school/team");
  revalidatePath("/portal/school");
  return { notice: `${label} uploaded.` };
}

export async function deleteSchoolDocument(
  _prev: RosterState,
  formData: FormData,
): Promise<RosterState> {
  const { supabase, school } = await ownSchool();
  if (!school) return { error: "No school found for this account." };

  const id = String(formData.get("document_id") ?? "");
  const { data: doc } = await supabase
    .from("school_documents")
    .select("storage_path, label")
    .eq("id", id)
    .maybeSingle();

  if (!doc) return { error: "That document could not be found." };

  await supabase.storage.from("school-documents").remove([doc.storage_path]);
  const { error } = await supabase.from("school_documents").delete().eq("id", id);

  if (error) return { error: `Could not remove it: ${error.message}` };

  revalidatePath("/portal/school/team");
  return { notice: `${doc.label} removed.` };
}

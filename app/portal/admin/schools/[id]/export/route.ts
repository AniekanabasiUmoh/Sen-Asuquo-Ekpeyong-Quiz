import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

// Neutralise spreadsheet formulas as well as quoting commas, quotes and newlines.
function cell(value: unknown) {
  let text = String(value ?? "");
  if (/^[\s]*[=+\-@]/.test(text) || /^[\t\r\n]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireRole(["super_admin", "committee"], "/portal/admin");
  const { id } = await params;
  if (!/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(id)) return new Response("Not found", { status: 404 });
  const db = await createClient();
  const [school, students, coaches] = await Promise.all([
    db.from("schools").select("*").eq("id", id).maybeSingle(),
    db.from("students").select("*").eq("school_id", id).order("created_at"),
    db.from("coaches").select("*").eq("school_id", id),
  ]);
  if (school.error || students.error || coaches.error) return new Response("Could not export details. Please try again.", { status: 500 });
  if (!school.data) return new Response("Not found", { status: 404 });
  const s = school.data;
  const rows: unknown[][] = [
    ["School", "Registration number", "Status", "Principal", "Coordinator", "Email", "Phone", "Address"],
    [s.name, s.registration_no, s.status, s.principal_name, s.contact_name, s.contact_email, s.contact_phone, s.address],
    [], ["Student", "Role", "Stream", "Class", "Date of birth", "Passport uploaded", "Consent"],
    ...(students.data ?? []).map((p) => [p.full_name, p.is_striker ? "Striker" : "Assist", p.stream, p.class_level, p.date_of_birth, p.photo_path ? "Yes" : "No", p.consent_withdrawn_at ? "Withdrawn" : p.consent_given ? "Recorded" : "Not recorded"]),
    [], ["Coach", "Email", "Phone"], ...(coaches.data ?? []).map((c) => [c.full_name, c.email, c.phone]),
  ];
  return new Response("\uFEFF" + rows.map((row) => row.map(cell).join(",")).join("\r\n"), { headers: {
    "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="school-${id}.csv"`,
    "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff",
  } });
}

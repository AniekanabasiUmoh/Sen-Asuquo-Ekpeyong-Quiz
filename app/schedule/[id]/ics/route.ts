import { createPublicClient } from "@/lib/supabase/server";

function escapeIcs(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createPublicClient();
  if (!supabase) return new Response("Schedule unavailable", { status: 503 });
  const { data: fixture } = await supabase.from("fixtures").select("id, name, scheduled_at, venue, venue_id, notes").eq("id", id).maybeSingle();
  if (!fixture || !fixture.scheduled_at) return new Response("Fixture not found", { status: 404 });
  let location = fixture.venue ?? "";
  if (fixture.venue_id) {
    const { data: venue } = await supabase.from("venues").select("name, address").eq("id", fixture.venue_id).maybeSingle();
    if (venue) location = [venue.name, venue.address].filter(Boolean).join(", ");
  }
  const start = new Date(fixture.scheduled_at);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const format = (date: Date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const body = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//SAEAC//Schedule//EN", "BEGIN:VEVENT",
    `UID:${fixture.id}@saeac.org`, `DTSTAMP:${format(new Date())}`, `DTSTART:${format(start)}`, `DTEND:${format(end)}`,
    `SUMMARY:${escapeIcs(fixture.name)}`, `LOCATION:${escapeIcs(location)}`, fixture.notes ? `DESCRIPTION:${escapeIcs(fixture.notes)}` : "",
    "END:VEVENT", "END:VCALENDAR", "",
  ].filter(Boolean).join("\r\n");
  return new Response(body, { headers: { "Content-Type": "text/calendar; charset=utf-8", "Content-Disposition": `attachment; filename="saeac-${fixture.id}.ics"`, "Cache-Control": "public, max-age=300" } });
}

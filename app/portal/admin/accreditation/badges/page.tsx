import type { Metadata } from "next";
import QRCode from "qrcode";

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { AccreditationHolder } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Printable badges",
  robots: { index: false },
};

const HOLDER_LABEL: Record<AccreditationHolder, string> = {
  student: "Student",
  coach: "Coach",
  volunteer: "Change Maker",
  judge: "Judge",
};

/**
 * Printable badges, Phase 4 sprint 4.3.
 *
 * A stopgap for before the confirmation email is active (see
 * supabase/functions/send-email): once Resend is live, a badge normally
 * reaches its holder by email, generated the same way this page generates
 * one, just server-side into an attachment instead of onto a page. Until
 * then, this is how the committee gets a printable code at all — open this
 * page, print, cut. Browser print (Ctrl/Cmd+P) rather than a download
 * button: the print stylesheet below is the actual layout, one badge per
 * card at a size that survives a home printer and a pair of scissors.
 */
export default async function BadgesPage() {
  await requireRole(["super_admin", "committee"], "/portal/admin/accreditation");
  const supabase = await createClient();

  const { data: accreditations } = await supabase
    .from("accreditations")
    .select("*")
    .is("revoked_at", null)
    .order("holder_type")
    .limit(200);

  const rows = accreditations ?? [];
  const ids = {
    student: rows.filter((a) => a.holder_type === "student").map((a) => a.holder_id),
    coach: rows.filter((a) => a.holder_type === "coach").map((a) => a.holder_id),
    volunteer: rows.filter((a) => a.holder_type === "volunteer").map((a) => a.holder_id),
    judge: rows.filter((a) => a.holder_type === "judge").map((a) => a.holder_id),
  };

  const [{ data: students }, { data: coaches }, { data: volunteers }, { data: judges }] =
    await Promise.all([
      ids.student.length
        ? supabase.from("students").select("id, full_name, school_id").in("id", ids.student)
        : Promise.resolve({ data: [] as { id: string; full_name: string; school_id: string }[] }),
      ids.coach.length
        ? supabase.from("coaches").select("id, full_name, school_id").in("id", ids.coach)
        : Promise.resolve({ data: [] as { id: string; full_name: string; school_id: string }[] }),
      ids.volunteer.length
        ? supabase.from("volunteers").select("id, full_name").in("id", ids.volunteer)
        : Promise.resolve({ data: [] as { id: string; full_name: string }[] }),
      ids.judge.length
        ? supabase.from("judges").select("id, full_name").in("id", ids.judge)
        : Promise.resolve({ data: [] as { id: string; full_name: string }[] }),
    ]);

  // Joined in application code, not via an embedded select: the hand-written
  // Database type does not declare the students/coaches -> schools foreign
  // key relationship the query builder needs to type an embedded join, so
  // this stays a second explicit query rather than fighting that inference.
  const schoolIds = [
    ...new Set([...(students ?? []), ...(coaches ?? [])].map((r) => r.school_id)),
  ];
  const { data: schools } = schoolIds.length
    ? await supabase.from("schools").select("id, name").in("id", schoolIds)
    : { data: [] as { id: string; name: string }[] };
  const schoolName = new Map((schools ?? []).map((s) => [s.id, s.name]));

  const info: Record<string, { name: string; sub: string | null }> = {};
  for (const s of students ?? []) {
    info[`student:${s.id}`] = { name: s.full_name, sub: schoolName.get(s.school_id) ?? null };
  }
  for (const c of coaches ?? []) {
    info[`coach:${c.id}`] = { name: c.full_name, sub: schoolName.get(c.school_id) ?? null };
  }
  for (const v of volunteers ?? []) info[`volunteer:${v.id}`] = { name: v.full_name, sub: null };
  for (const j of judges ?? []) info[`judge:${j.id}`] = { name: j.full_name, sub: null };

  const badges = await Promise.all(
    rows.map(async (a) => {
      const key = `${a.holder_type}:${a.holder_id}`;
      // The QR encodes the bare code, not a URL: the scanner in scanner.tsx
      // reads jsQR's decoded string directly as the code to check in, so a
      // wrapping URL here would need to be parsed back out there for no
      // benefit — nobody scans this badge with a generic camera app expecting
      // a web page, only with this page's own scanner.
      const qr = await QRCode.toDataURL(a.code, {
        width: 240,
        margin: 1,
        // Literal hex, not a token: this is encoded into a PNG data URI by
        // the qrcode library, which never sees the page's CSS. Keep in step
        // with --color-primary by hand.
        color: { dark: "#003090", light: "#ffffff" },
      });
      return { ...a, qr, ...(info[key] ?? { name: "Unknown", sub: null }) };
    }),
  );

  return (
    <div>
      <div className="print:hidden">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/50">
          Organising Committee
        </p>
        <h1 className="mt-3 font-display text-[clamp(1.9rem,4vw,2.6rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
          Printable badges
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-primary/60">
          {badges.length} active accreditation{badges.length === 1 ? "" : "s"}. Print
          this page (each badge is sized to cut out) or screenshot an individual
          code below.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 print:grid-cols-2 print:gap-6">
        {badges.map((b) => (
          <div
            key={b.id}
            className="break-inside-avoid rounded-2xl border border-black/10 bg-white p-4 text-center print:border-black/20"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary/45">
              {HOLDER_LABEL[b.holder_type]}
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element -- a generated data: URI, next/image cannot optimise it and there is nothing to optimise */}
            <img src={b.qr} alt="" className="mx-auto mt-2 h-auto w-full max-w-[10rem]" />
            <p className="mt-2 truncate font-display text-[13px] font-bold">{b.name}</p>
            {b.sub ? (
              <p className="truncate text-[11px] text-primary/50">{b.sub}</p>
            ) : null}
          </div>
        ))}
      </div>

      {badges.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-black/15 px-5 py-8 text-center text-[13px] text-primary/45">
          No accreditations issued yet.
        </p>
      ) : null}
    </div>
  );
}

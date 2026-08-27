import { NextResponse } from "next/server";

import { createPublicClient } from "@/lib/supabase/server";

/**
 * Small, non-sensitive readiness endpoint for Vercel/UptimeRobot checks.
 * It uses the anonymous client and reports only dependency health, never
 * counts, credentials or database error text.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const started = Date.now();
  const supabase = createPublicClient();

  if (!supabase) {
    return NextResponse.json(
      { status: "degraded", checks: { configuration: false }, latency_ms: Date.now() - started },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  const { error } = await supabase.from("lgas").select("id", { head: true, count: "exact" });
  const healthy = !error;
  return NextResponse.json(
    {
      status: healthy ? "ok" : "degraded",
      checks: { configuration: true, supabase: healthy },
      latency_ms: Date.now() - started,
    },
    { status: healthy ? 200 : 503, headers: { "Cache-Control": "no-store" } },
  );
}

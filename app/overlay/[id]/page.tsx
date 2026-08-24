import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { createPublicClient } from "@/lib/supabase/server";

import type { Row } from "../../live/[id]/scoreboard";
import { OverlayBoard } from "./overlay-board";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Broadcast overlay",
  // Never index an overlay: it is a production tool, not a page for readers.
  robots: { index: false, follow: false },
};

/**
 * Browser source for OBS or vMix, Phase 4 sprint 4.2.
 *
 * Add the page URL as a browser source at 1920x1080 with the background
 * transparent. `?top=3` shows the leading three only, which is what fits a
 * lower third during play.
 */
export default async function OverlayPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ top?: string }>;
}) {
  const { id } = await params;
  const { top } = await searchParams;
  // Null when Supabase is not configured. Falling through to notFound() is
  // right here: an OBS browser source pointing at an overlay that cannot load
  // its scores should 404 loudly, not render empty chrome over the broadcast.
  const supabase = createPublicClient();

  const [{ data: match }, { data: rows }] = supabase
    ? await Promise.all([
        supabase.from("matches").select("id, name").eq("id", id).maybeSingle(),
        supabase.rpc("live_scoreboard", { target_match: id }),
      ])
    : [{ data: null }, { data: null }];

  if (!match) notFound();

  return (
    <>
      {/*
        The overlay must be transparent for OBS to key it, but the site's own
        body carries a background colour. Overriding it here rather than in
        globals.css keeps the change scoped to this route.
      */}
      <style>{`
        html, body { background: transparent !important; }
        body > * { background: transparent; }
      `}</style>
      <OverlayBoard
        matchId={id}
        initial={(rows ?? []) as Row[]}
        top={Number(top ?? 0) || 0}
      />
    </>
  );
}

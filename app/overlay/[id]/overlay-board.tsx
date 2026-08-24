"use client";

import { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";

import type { Row } from "../../live/[id]/scoreboard";

/**
 * Broadcast overlay, Phase 4 sprint 4.2.
 *
 * Added to OBS or vMix as a browser source, so it composites over the camera
 * feed. Two rules follow from that and are easy to break by accident:
 *
 *   1. The page background must be transparent. OBS keys on it, and any painted
 *      colour becomes an opaque rectangle over the video.
 *   2. Type has to survive video compression at broadcast distance, so
 *      everything here is larger and heavier than the site's own scale.
 *
 * `?top=3` limits the board to the leading three, which is what fits a lower
 * third during play.
 */
export function OverlayBoard({
  matchId,
  initial,
  top,
}: {
  matchId: string;
  initial: Row[];
  top: number;
}) {
  const [rows, setRows] = useState<Row[]>(initial);

  useEffect(() => {
    const supabase = createClient();

    async function refresh() {
      const { data } = await supabase.rpc("live_scoreboard", {
        target_match: matchId,
      });
      if (data) setRows(data as Row[]);
    }

    const channel = supabase
      .channel(`overlay-${matchId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "match_events",
          filter: `match_id=eq.${matchId}`,
        },
        () => void refresh(),
      )
      .subscribe();

    // The overlay must never be the thing that fails on air, so it polls behind
    // the socket as well.
    const poll = window.setInterval(refresh, 15000);

    return () => {
      window.clearInterval(poll);
      void supabase.removeChannel(channel);
    };
  }, [matchId]);

  const shown = top > 0 ? rows.slice(0, top) : rows;

  return (
    <div className="p-10">
      <ol className="space-y-3">
        {shown.map((r) => (
          <li
            key={r.school_id}
            className="flex items-center gap-6 rounded-2xl bg-[#003090]/95 px-8 py-5 text-white shadow-2xl"
          >
            <span className="font-mono text-2xl font-bold tabular-nums text-white/40">
              {String(r.rank).padStart(2, "0")}
            </span>
            <span className="flex-1 truncate font-display text-3xl font-extrabold tracking-[-0.01em]">
              {r.school_name}
            </span>
            <span className="font-display text-4xl font-extrabold tabular-nums text-[#f0a800]">
              {Number(r.score).toFixed(1)}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

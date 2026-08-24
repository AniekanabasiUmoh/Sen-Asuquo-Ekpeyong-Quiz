"use client";

import { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";

/**
 * Live scoreboard, Phase 4 sprint 4.1.
 *
 * Subscribes to match_events over Supabase Realtime and refetches the standings
 * when one lands. RLS applies to the realtime stream as well as the query, so a
 * viewer only receives events for a match they are allowed to see.
 *
 * Refetching the aggregate rather than adding points client-side is deliberate:
 * the server's total is the only one that counts, and a dropped websocket frame
 * would otherwise leave the board quietly wrong for the rest of the match.
 *
 * The football metaphor is brand-sanctioned and carried through here: Strikers,
 * Assists at half a point, substitutions and VAR.
 */

export type Row = {
  school_id: string;
  school_name: string;
  score: number;
  striker_correct: number;
  assist_correct: number;
  var_referrals: number;
  substitutions: number;
  rank: number;
};

export function Scoreboard({
  matchId,
  initial,
  matchStatus,
}: {
  matchId: string;
  initial: Row[];
  matchStatus: string;
}) {
  const [rows, setRows] = useState<Row[]>(initial);
  const [live, setLive] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function refresh() {
      const { data } = await supabase.rpc("live_scoreboard", {
        target_match: matchId,
      });
      if (data) setRows(data as Row[]);
    }

    const channel = supabase
      .channel(`match-${matchId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "match_events",
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          const schoolId = (payload.new as { school_id?: string })?.school_id;
          if (schoolId) {
            setFlash(schoolId);
            window.setTimeout(() => setFlash(null), 1200);
          }
          void refresh();
        },
      )
      .subscribe((status) => setLive(status === "SUBSCRIBED"));

    // A slow poll behind the socket: if the websocket drops on a patchy mobile
    // connection the board still catches up rather than freezing mid-match.
    const poll = window.setInterval(refresh, 30000);

    return () => {
      window.clearInterval(poll);
      void supabase.removeChannel(channel);
    };
  }, [matchId]);

  const leader = rows[0]?.score ?? 0;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={
            "inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-bold " +
            (matchStatus === "live"
              ? "bg-[#f44423]/15 text-[#c1300f]"
              : "bg-black/[0.06] text-[#003090]/60")
          }
        >
          {matchStatus === "live" ? (
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#f44423]" />
          ) : null}
          {matchStatus === "live" ? "Live" : matchStatus}
        </span>
        <span className="text-[12px] text-[#003090]/45">
          {live ? "Updating automatically" : "Reconnecting…"}
        </span>
      </div>

      <ol className="mt-8 space-y-3">
        {rows.map((r) => {
          const share = leader > 0 ? (r.score / leader) * 100 : 0;
          return (
            <li
              key={r.school_id}
              className={
                "relative overflow-hidden rounded-[24px] bg-white p-6 transition " +
                (flash === r.school_id ? "ring-2 ring-[#f0a800]" : "")
              }
            >
              {/* Score bar, drawn behind the content. */}
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 bg-[#003090]/[0.05] transition-all duration-700"
                style={{ width: `${share}%` }}
              />
              <div className="relative flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-5">
                  <span className="font-mono text-[13px] tabular-nums text-[#003090]/30">
                    {String(r.rank).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold">{r.school_name}</h3>
                    <p className="mt-1 text-[12px] text-[#003090]/50">
                      {r.striker_correct} striker · {r.assist_correct} assist
                      {r.substitutions > 0 ? ` · ${r.substitutions} sub` : ""}
                      {r.var_referrals > 0 ? ` · ${r.var_referrals} VAR` : ""}
                    </p>
                  </div>
                </div>
                <p className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-extrabold leading-none tabular-nums">
                  {Number(r.score).toFixed(1)}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      {rows.length === 0 ? (
        <p className="rounded-[24px] bg-white px-6 py-10 text-center text-[14px] text-[#003090]/50">
          The scoreboard appears when the match begins.
        </p>
      ) : null}

      <p className="mt-8 text-[12px] leading-relaxed text-[#003090]/45">
        A Striker scores one point, an Assist half a point. A question referred
        to the VAR is answered for the audience and scores nothing.
      </p>
    </div>
  );
}

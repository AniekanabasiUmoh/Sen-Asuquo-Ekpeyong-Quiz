/**
 * SAEAC — event-day load test, Phase 4 sprint 4.3.
 *
 * WRITTEN, NOT RUN: this has not been executed against the live project. It
 * sends real traffic and should only be pointed at production with someone
 * watching the Supabase dashboard, ideally in a quiet window rather than
 * during real registration or a real broadcast. Running it requires a
 * decision, not just a command, which is why it stops here rather than being
 * fired off automatically.
 *
 * Covers the three endpoints most likely to spike on event day:
 *   1. The homepage — a static, CDN-cached page, included as the control:
 *      it should show near-zero load on Postgres regardless of concurrency,
 *      and if it doesn't, the caching from Sprint 4.3's other fix has broken.
 *   2. live_scoreboard() — the RPC every phone in the room hits repeatedly
 *      during the Grand Finale (Sprint 4.1's 30-second poll fallback alone
 *      means every connected viewer calls this at least twice a minute, on
 *      top of every Realtime-triggered refetch).
 *   3. Anonymous read of public schools/news — the shape of traffic on
 *      registration-deadline day, when many visitors check status pages at
 *      once rather than posting anything.
 *
 * Requires k6 (https://k6.io). Not an npm dependency — a separate binary,
 * deliberately not added to package.json since it has nothing to do with the
 * app running.
 *
 * Usage once there is a go-ahead to actually run it:
 *
 *   k6 run \
 *     -e BASE_URL=https://saeac.org \
 *     -e SUPABASE_URL=https://lmohoeikidbsiioabmsz.supabase.co \
 *     -e SUPABASE_ANON_KEY=<the anon key, safe to use here, RLS is the boundary> \
 *     -e MATCH_ID=<a real match id, or omit to skip the scoreboard RPC> \
 *     supabase/load-test.js
 *
 * Start with the `smoke` scenario (10 VUs) before ever running `event_day`
 * (ramping to 300) against a live project.
 */

import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";
const SUPABASE_URL = __ENV.SUPABASE_URL;
const SUPABASE_ANON_KEY = __ENV.SUPABASE_ANON_KEY;
const MATCH_ID = __ENV.MATCH_ID || "";

export const options = {
  scenarios: {
    // Sanity check: does everything respond correctly at all, before asking
    // "how much load can it take". Run this first, always.
    smoke: {
      executor: "constant-vus",
      vus: 10,
      duration: "30s",
      exec: "smoke",
    },
    // A plausible ceiling for the Grand Finale: a few hundred concurrent
    // phones open to the live scoreboard at once, which is a generous
    // estimate for a regional event, not a national one. Adjust once real
    // attendance numbers or ticketing figures exist.
    event_day: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "1m", target: 50 },
        { duration: "3m", target: 300 },
        { duration: "2m", target: 300 },
        { duration: "1m", target: 0 },
      ],
      exec: "eventDay",
      startTime: "35s", // after the smoke scenario finishes
    },
  },
  thresholds: {
    // A live scoreboard that takes over a second to update on a phone
    // connection is failing at its one job. 95% under 800ms is the bar; the
    // Supabase Edge region (eu-west-1) and Nigerian mobile RTT set a real
    // floor here that a threshold tuned only against a nearby test runner
    // would miss — run this from a runner geographically close to the actual
    // audience, not from wherever k6 happens to execute by default.
    http_req_duration: ["p(95)<800"],
    http_req_failed: ["rate<0.01"],
  },
};

function supabaseHeaders() {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
  };
}

export function smoke() {
  const home = http.get(BASE_URL);
  check(home, { "homepage 200": (r) => r.status === 200 });

  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    const schools = http.get(`${SUPABASE_URL}/rest/v1/schools?select=id,name&status=eq.approved&limit=20`, {
      headers: supabaseHeaders(),
    });
    check(schools, { "approved schools readable": (r) => r.status === 200 });

    const news = http.get(`${SUPABASE_URL}/rest/v1/news?select=id,title&status=eq.published&limit=10`, {
      headers: supabaseHeaders(),
    });
    check(news, { "published news readable": (r) => r.status === 200 });

    if (MATCH_ID) {
      const scoreboard = http.post(
        `${SUPABASE_URL}/rest/v1/rpc/live_scoreboard`,
        JSON.stringify({ target_match: MATCH_ID }),
        { headers: supabaseHeaders() },
      );
      check(scoreboard, { "live_scoreboard callable": (r) => r.status === 200 });
    }
  }

  sleep(1);
}

export function eventDay() {
  // Weighted toward the scoreboard: this is what event-day concurrency
  // actually looks like, not an even split across endpoints.
  const roll = Math.random();

  if (roll < 0.15) {
    http.get(BASE_URL);
  } else if (roll < 0.25 && SUPABASE_URL) {
    http.get(`${SUPABASE_URL}/rest/v1/schools?select=id,name&status=eq.approved&limit=20`, {
      headers: supabaseHeaders(),
    });
  } else if (MATCH_ID && SUPABASE_URL) {
    // The scoreboard's own 30-second poll means a real viewer calls this
    // roughly every 30s, not on every k6 iteration — sleep() below
    // approximates that per-VU cadence rather than hammering as fast as
    // possible, which would overstate load no real browser generates.
    http.post(
      `${SUPABASE_URL}/rest/v1/rpc/live_scoreboard`,
      JSON.stringify({ target_match: MATCH_ID }),
      { headers: supabaseHeaders() },
    );
  } else {
    http.get(BASE_URL);
  }

  sleep(25 + Math.random() * 10); // 25-35s, centred on the real poll interval
}

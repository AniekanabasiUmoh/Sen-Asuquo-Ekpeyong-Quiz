import type { Metadata } from "next";
import Link from "next/link";

import { Countdown } from "@/components/countdown";
import { PageHero } from "@/components/page-hero";
import { createPublicClient } from "@/lib/supabase/server";
import type { SimulcastLink } from "@/lib/supabase/types";

const PLATFORM_LABEL: Record<string, string> = {
  facebook: "Facebook Live",
  tiktok: "TikTok",
  x: "X (Twitter)",
  instagram: "Instagram Live",
  youtube: "YouTube",
  other: "Also live on",
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Live",
  description:
    "Follow the Senator Asuquo Ekpenyong Academic Championship live, with round by round scores from the Grand Finale.",
};

export default async function LiveIndexPage() {
  const supabase = createPublicClient();

  const [{ data: matches }, { data: broadcasts }] = await Promise.all([
    supabase
      .from("matches")
      .select("id, name, status, publish")
      .order("created_at", { ascending: false }),
    supabase.from("broadcasts").select("*").order("starts_at", { ascending: true }),
  ]);

  const rows = matches ?? [];
  const liveNow = rows.filter((m) => m.status === "live");
  const others = rows.filter((m) => m.status !== "live");
  const upcoming = (broadcasts ?? []).filter((b) => b.status === "upcoming");

  return (
    <>
      <PageHero
        eyebrow="Live"
        title="Follow the"
        titleTrail="Championship Live"
        intro="Round by round scores as they happen, with the Grand Finale broadcast in full."
        image="/img/students-posing.jpg"
        imageAlt="Students at the championship"
      />

      <section className="mx-auto max-w-7xl px-5 py-14 sm:py-16">
        {liveNow.length > 0 ? (
          <div className="mb-12">
            <h2 className="font-display text-xl font-bold">Live now</h2>
            <ul className="mt-5 space-y-3">
              {liveNow.map((m) => (
                <li key={m.id}>
                  <Link
                    href={`/live/${m.id}`}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] bg-[#003090] p-7 text-white transition hover:bg-[#0d2270]"
                  >
                    <div>
                      <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/70">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-[#f0a800]" />
                        Live
                      </span>
                      <h3 className="mt-2 font-display text-xl font-extrabold">
                        {m.name}
                      </h3>
                    </div>
                    <span className="rounded-full bg-[#f0a800] px-6 py-3 text-[13px] font-bold text-[#003090]">
                      Watch the scoreboard
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {upcoming.length > 0 ? (
          <div className="mb-12">
            <h2 className="font-display text-xl font-bold">Coming up</h2>
            <ul className="mt-5 space-y-4">
              {upcoming.map((b) => {
                const links = (b.simulcast_links as SimulcastLink[] | null) ?? [];
                return (
                  <li key={b.id} className="overflow-hidden rounded-[28px] bg-[#003090] text-white">
                    <div className="p-8 sm:p-9">
                      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/55">
                        Holding for broadcast
                      </p>
                      <h3 className="mt-2 font-display text-[clamp(1.5rem,3.2vw,2rem)] font-extrabold leading-[1.1]">
                        {b.title}
                      </h3>

                      {b.starts_at ? (
                        <>
                          <Countdown
                            targetIso={b.starts_at}
                            className="mt-6 gap-5"
                            boxClass="!min-w-0 !flex-none text-left"
                            valueClass="font-display text-3xl font-extrabold text-white"
                            labelClass="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-white/45"
                          />
                          <p className="mt-4 text-[13px] text-white/60">
                            {new Date(b.starts_at).toLocaleString("en-GB", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </>
                      ) : (
                        <p className="mt-4 text-[13px] text-white/60">
                          Start time to be confirmed.
                        </p>
                      )}

                      {links.length > 0 ? (
                        <div className="mt-7 border-t border-white/15 pt-6">
                          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/45">
                            Also streaming on
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2.5">
                            {links.map((l, i) => (
                              <a
                                key={`${l.platform}-${i}`}
                                href={l.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full border border-white/25 px-4 py-2 text-[12px] font-semibold text-white transition hover:bg-white/10"
                              >
                                {l.label || PLATFORM_LABEL[l.platform] || l.platform}
                              </a>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      {b.match_id ? (
                        <Link
                          href={`/live/${b.match_id}`}
                          className="mt-7 inline-block rounded-full bg-[#f0a800] px-6 py-3 text-[13px] font-bold text-[#003090] transition hover:bg-white"
                        >
                          Go to the match centre
                        </Link>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        {others.length > 0 ? (
          <div>
            <h2 className="font-display text-xl font-bold">Match centres</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {others.map((m) => (
                <li key={m.id}>
                  <Link
                    href={`/live/${m.id}`}
                    className="block rounded-[24px] bg-white p-6 transition hover:bg-white/70"
                  >
                    <h3 className="font-display text-base font-bold">{m.name}</h3>
                    <p className="mt-1 text-[13px] text-[#003090]/50">
                      {m.status === "completed" ? "Final score" : "Not started"}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {rows.length === 0 && upcoming.length === 0 ? (
          <div className="rounded-[28px] bg-white p-10 text-center">
            <h2 className="font-display text-xl font-bold">
              Nothing is live at the moment
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-[#003090]/60">
              Scores appear here as each stage is played, and the Grand Finale is
              broadcast in full.
            </p>
          </div>
        ) : null}
      </section>
    </>
  );
}

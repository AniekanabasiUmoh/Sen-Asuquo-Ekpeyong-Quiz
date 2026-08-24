import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getSessionUser, isAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { ChatMessage, SimulcastLink } from "@/lib/supabase/types";

import { LiveChat } from "./chat";
import { Scoreboard, type Row } from "./scoreboard";

const PLATFORM_LABEL: Record<string, string> = {
  facebook: "Facebook Live",
  tiktok: "TikTok",
  x: "X (Twitter)",
  instagram: "Instagram Live",
  youtube: "YouTube",
  other: "Also live on",
};

export const metadata: Metadata = {
  title: "Live scoreboard",
  description:
    "Live scores from the Senator Asuquo Ekpenyong Academic Championship.",
};

/**
 * Public live match centre, Phase 4 sprints 4.1 and 4.2.
 *
 * Dynamic rather than cached: this is the one page where a stale render is
 * worse than a slow one. The scoreboard itself then keeps itself current over
 * a websocket.
 */
export const dynamic = "force-dynamic";

export default async function LiveMatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const user = await getSessionUser();

  const [{ data: match }, { data: rows }, { data: broadcasts }, { data: chat }] =
    await Promise.all([
      supabase.from("matches").select("id, name, status, publish").eq("id", id).maybeSingle(),
      supabase.rpc("live_scoreboard", { target_match: id }),
      supabase.from("broadcasts").select("*").eq("match_id", id).limit(1),
      supabase
        .from("chat_messages")
        .select("*")
        .eq("match_id", id)
        .order("created_at", { ascending: true })
        .limit(200),
    ]);

  if (!match) notFound();

  const broadcast = broadcasts?.[0];
  const chatMessages = (chat ?? []) as ChatMessage[];

  // Display names for chat authors. profiles is not publicly readable, so this
  // is only ever the small set of people who have actually posted here, not a
  // way to browse every account.
  const authorIds = [...new Set(chatMessages.map((m) => m.user_id))];
  const { data: authors } = authorIds.length
    ? await supabase.from("profiles").select("id, full_name").in("id", authorIds)
    : { data: [] as { id: string; full_name: string | null }[] };
  const names = Object.fromEntries(
    (authors ?? []).map((a) => [a.id, a.full_name ?? "Supporter"]),
  );

  return (
    <main className="min-h-screen bg-[#faf6ee]">
      <div className="mx-auto max-w-5xl px-5 py-14 sm:py-20">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#003090]/50">
          {broadcast?.status === "ended" ? "Watch again" : "Live"}
        </p>
        <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3.25rem)] font-extrabold leading-[1.02] tracking-[-0.02em]">
          {match.name}
        </h1>

        {broadcast?.embed_id ? (
          <div className="mt-9 overflow-hidden rounded-[28px] bg-black">
            {/* 16:9 without a plugin. */}
            <div className="relative w-full pt-[56.25%]">
              <iframe
                src={`https://www.youtube.com/embed/${broadcast.embed_id}`}
                title={broadcast.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </div>
        ) : null}

        {broadcast && ((broadcast.simulcast_links as SimulcastLink[] | null)?.length ?? 0) > 0 ? (
          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <span className="text-[12px] font-semibold text-[#003090]/50">Also live on</span>
            {(broadcast.simulcast_links as SimulcastLink[]).map((l, i) => (
              <a
                key={`${l.platform}-${i}`}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-black/15 px-4 py-2 text-[12px] font-semibold transition hover:bg-white"
              >
                {l.label || PLATFORM_LABEL[l.platform] || l.platform}
              </a>
            ))}
          </div>
        ) : null}

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-start lg:gap-10">
          <Scoreboard
            matchId={id}
            initial={(rows ?? []) as Row[]}
            matchStatus={match.status}
          />
          <LiveChat
            matchId={id}
            initial={chatMessages}
            currentUserId={user?.id ?? null}
            isModerator={isAdmin(user)}
            names={names}
          />
        </div>
      </div>
    </main>
  );
}

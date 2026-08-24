"use client";

import { useActionState } from "react";

import { FormError, FormNotice, Input, Select, SubmitButton } from "@/components/form";
import type { Broadcast } from "@/lib/supabase/types";

import {
  addSimulcastLink,
  removeSimulcastLink,
  saveBroadcast,
  setBroadcastState,
  type BroadcastState,
} from "./actions";

const EMPTY: BroadcastState = {};

const PLATFORMS = [
  { value: "facebook", label: "Facebook Live" },
  { value: "tiktok", label: "TikTok" },
  { value: "x", label: "X (Twitter)" },
  { value: "instagram", label: "Instagram Live" },
  { value: "youtube", label: "Another YouTube channel" },
  { value: "other", label: "Other" },
];

export function BroadcastAdmin({
  broadcasts,
  matches,
}: {
  broadcasts: Broadcast[];
  matches: { id: string; name: string }[];
}) {
  const [saveState, saveAction, savePending] = useActionState(saveBroadcast, EMPTY);
  const [stateState, stateAction] = useActionState(setBroadcastState, EMPTY);

  const matchName = new Map(matches.map((m) => [m.id, m.name]));

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
      <section>
        <h2 className="font-display text-xl font-bold">Broadcasts</h2>
        <FormError message={saveState.error ?? stateState.error} />
        <FormNotice message={saveState.notice ?? stateState.notice} />

        {broadcasts.length === 0 ? (
          <p className="mt-5 rounded-2xl border border-dashed border-black/15 px-5 py-8 text-center text-[13px] text-[#003090]/45">
            No broadcasts set up yet.
          </p>
        ) : (
          <ul className="mt-5 space-y-4">
            {broadcasts.map((b) => (
              <li key={b.id} className="rounded-[24px] bg-white p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-lg font-bold">{b.title}</h3>
                    <p className="mt-1 text-[13px] text-[#003090]/55">
                      {b.match_id ? matchName.get(b.match_id) ?? "Match" : "No match linked"}
                      {b.embed_id ? ` · ${b.embed_id}` : " · no stream yet"}
                    </p>
                  </div>
                  <span
                    className={
                      "rounded-full px-3.5 py-1.5 text-[11px] font-bold " +
                      (b.publish === "published"
                        ? "bg-[#2dc653]/20 text-[#155d27]"
                        : "bg-black/[0.06] text-[#003090]/60")
                    }
                  >
                    {b.publish === "published" ? "Published" : "Draft"}
                  </span>
                </div>

                {b.match_id ? (
                  <div className="mt-4 rounded-2xl bg-[#faf6ee] p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#003090]/45">
                      Browser sources for OBS or vMix
                    </p>
                    <p className="mt-2 break-all font-mono text-[12px] text-[#003090]/70">
                      /overlay/{b.match_id}
                    </p>
                    <p className="mt-1 break-all font-mono text-[12px] text-[#003090]/70">
                      /overlay/{b.match_id}?top=3
                    </p>
                    <p className="mt-2 text-[12px] leading-relaxed text-[#003090]/50">
                      Add at 1920x1080 with a transparent background. The second
                      shows the leading three only, for a lower third.
                    </p>
                  </div>
                ) : null}

                <form
                  action={stateAction}
                  className="mt-4 flex flex-wrap gap-3 border-t border-black/10 pt-4"
                >
                  <input type="hidden" name="broadcast_id" value={b.id} />
                  <input
                    type="hidden"
                    name="publish"
                    value={b.publish === "published" ? "0" : "1"}
                  />
                  <button
                    type="submit"
                    className="rounded-full border border-black/15 px-4 py-2 text-[12px] font-semibold transition hover:bg-[#faf6ee]"
                  >
                    {b.publish === "published" ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    type="submit"
                    name="status"
                    value="live"
                    className="rounded-full bg-[#003090] px-4 py-2 text-[12px] font-bold text-white transition hover:bg-[#0d2270]"
                  >
                    Mark live
                  </button>
                  <button
                    type="submit"
                    name="status"
                    value="ended"
                    className="rounded-full border border-black/15 px-4 py-2 text-[12px] font-semibold transition hover:bg-[#faf6ee]"
                  >
                    Mark ended
                  </button>
                </form>

                <p className="mt-3 text-[11px] text-[#003090]/40">
                  Status: {b.status}
                  {b.status === "ended"
                    ? " — the embed now plays back YouTube's automatic archive of the stream."
                    : ""}
                </p>

                <SimulcastLinks broadcastId={b.id} links={b.simulcast_links ?? []} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="lg:sticky lg:top-28 lg:self-start">
        <form action={saveAction} className="rounded-[28px] bg-white p-7">
          <h2 className="font-display text-lg font-bold">New broadcast</h2>
          <div className="mt-5 space-y-5">
            <Input label="Title" name="title" required placeholder="Grand Finale 2026" />
            <Select
              label="Match"
              name="match_id"
              placeholder="Not linked yet"
              options={matches.map((m) => ({ value: m.id, label: m.name }))}
            />
            <Input
              label="YouTube link or video id"
              name="embed"
              placeholder="https://youtube.com/live/..."
              hint="The watch, live or embed URL all work."
            />
            <Input label="Starts at" name="starts_at" type="datetime-local" />
            <SubmitButton pending={savePending}>Save broadcast</SubmitButton>
          </div>
        </form>
      </div>
    </div>
  );
}

function SimulcastLinks({
  broadcastId,
  links,
}: {
  broadcastId: string;
  links: { platform: string; url: string; label?: string }[];
}) {
  const [addState, addAction] = useActionState(addSimulcastLink, EMPTY);
  const [removeState, removeAction] = useActionState(removeSimulcastLink, EMPTY);

  return (
    <div className="mt-4 border-t border-black/10 pt-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#003090]/45">
        Also streaming on
      </p>
      <FormError message={addState.error ?? removeState.error} />
      <FormNotice message={addState.notice ?? removeState.notice} />

      {links.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {links.map((l, i) => (
            <li
              key={`${l.platform}-${i}`}
              className="flex items-center justify-between gap-3 rounded-xl bg-[#faf6ee] px-3.5 py-2.5"
            >
              <span className="min-w-0 truncate text-[12px]">
                <span className="font-semibold">{l.label || l.platform}</span>
                <span className="ml-2 text-[#003090]/45">{l.url}</span>
              </span>
              <form action={removeAction}>
                <input type="hidden" name="broadcast_id" value={broadcastId} />
                <input type="hidden" name="index" value={i} />
                <button
                  type="submit"
                  aria-label={`Remove ${l.label || l.platform}`}
                  className="flex-none text-[12px] font-semibold text-[#003090]/45 hover:text-[#c1300f]"
                >
                  Remove
                </button>
              </form>
            </li>
          ))}
        </ul>
      ) : null}

      <form action={addAction} className="mt-3 flex flex-wrap items-center gap-2">
        <input type="hidden" name="broadcast_id" value={broadcastId} />
        <select
          name="platform"
          className="rounded-full border border-black/15 bg-white px-3 py-2 text-[12px] outline-none focus:border-[#003090]"
        >
          {PLATFORMS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
        <input
          type="url"
          name="url"
          placeholder="https://..."
          className="w-48 rounded-full border border-black/15 bg-white px-3 py-2 text-[12px] outline-none focus:border-[#003090]"
        />
        <button
          type="submit"
          className="rounded-full border border-black/15 px-4 py-2 text-[12px] font-semibold transition hover:bg-white"
        >
          Add
        </button>
      </form>
    </div>
  );
}

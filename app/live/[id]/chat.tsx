"use client";

import { useEffect, useRef, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import type { ChatMessage } from "@/lib/supabase/types";

/**
 * Live chat, Phase 4 sprint 4.2.
 *
 * Moderation model, agreed before building rather than assumed: any signed-in
 * portal account may post (no pre-approval queue — a queue defeats the point
 * of a *live* chat, since a message would lag the broadcast it reacts to);
 * any committee/super_admin account may delete a message afterwards. This is
 * enforced in Postgres (chat_messages RLS), not here — the delete button below
 * is UI convenience, and it would fail silently for anyone the policy refuses.
 *
 * Unlike the scoreboard, this reads the Realtime payload directly rather than
 * refetching: a chat message is inherently a *log* to append to, not a value
 * to keep synchronised, so there is nothing to disagree with the server about.
 */
export function LiveChat({
  matchId,
  initial,
  currentUserId,
  isModerator,
  names: initialNames,
}: {
  matchId: string;
  initial: ChatMessage[];
  currentUserId: string | null;
  isModerator: boolean;
  names: Record<string, string>;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initial);
  const [names, setNames] = useState<Record<string, string>>(initialNames);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // The server resolves names once, for the initial batch of messages. A
  // message from a new author arriving live has no entry yet — without this,
  // the first message from anyone who has not posted before this page loaded
  // would be misattributed to "Supporter" for the rest of the session, which
  // is the common case in an active chat, not an edge case.
  //
  // This calls chat_author_name() rather than reading profiles directly:
  // profiles is locked to "your own row, or admin" (see
  // supabase/migrations/20260823000200_rls.sql), so a plain client-side
  // select here would work for the viewer's own name and silently return
  // nothing for anyone else's, which is worse than the bug it would be
  // fixing. The RPC is security definer and scoped to only names of people
  // who have posted in a match the caller is already allowed to see.
  useEffect(() => {
    const missing = [...new Set(messages.map((m) => m.user_id))].filter((id) => !(id in names));
    if (missing.length === 0) return;
    const supabase = createClient();
    void supabase
      .rpc("chat_author_names", { target_match: matchId, user_ids: missing })
      .then(({ data }) => {
        if (!data?.length) return;
        setNames((prev) => {
          const next = { ...prev };
          for (const p of data) next[p.user_id] = p.full_name ?? "Supporter";
          return next;
        });
      });
  }, [messages, names, matchId]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`chat-${matchId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: `match_id=eq.${matchId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as ChatMessage]);
        },
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "chat_messages", filter: `match_id=eq.${matchId}` },
        (payload) => {
          const gone = payload.old as { id?: string };
          setMessages((prev) => prev.filter((m) => m.id !== gone.id));
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [matchId]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const body = draft.trim();
    if (!body || !currentUserId) return;
    if (body.length > 300) {
      setError("Messages are limited to 300 characters.");
      return;
    }

    setSending(true);
    setError(null);
    const supabase = createClient();
    const { error: err } = await supabase
      .from("chat_messages")
      .insert({ match_id: matchId, user_id: currentUserId, body });
    setSending(false);

    if (err) {
      setError("That did not send. Please try again.");
      return;
    }
    setDraft("");
  }

  async function remove(id: string) {
    const supabase = createClient();
    await supabase.from("chat_messages").delete().eq("id", id);
  }

  return (
    <div className="rounded-[24px] bg-white p-6">
      <h2 className="font-display text-lg font-bold">Live chat</h2>

      <ul ref={listRef} className="mt-4 max-h-80 space-y-3 overflow-y-auto pr-1">
        {messages.length === 0 ? (
          <li className="rounded-2xl border border-dashed border-black/15 px-4 py-6 text-center text-[12px] text-primary/45">
            Be the first to say something.
          </li>
        ) : (
          messages.map((m) => (
            <li key={m.id} className="group flex items-start justify-between gap-2">
              <p className="min-w-0 text-[13px] leading-relaxed">
                <span className="font-semibold text-primary">
                  {names[m.user_id] ?? "Supporter"}
                </span>{" "}
                <span className="text-ink">{m.body}</span>
              </p>
              {isModerator || m.user_id === currentUserId ? (
                <button
                  type="button"
                  onClick={() => void remove(m.id)}
                  aria-label="Remove message"
                  className="flex-none text-[11px] text-primary/30 opacity-0 transition hover:text-red-ink group-hover:opacity-100"
                >
                  Remove
                </button>
              ) : null}
            </li>
          ))
        )}
      </ul>

      {currentUserId ? (
        <form onSubmit={send} className="mt-4 border-t border-black/10 pt-4">
          {error ? <p className="mb-2 text-[12px] font-semibold text-red-ink">{error}</p> : null}
          <div className="flex gap-2">
            <label className="sr-only" htmlFor="chat-draft">
              Your message
            </label>
            <input
              id="chat-draft"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              maxLength={300}
              placeholder="Say something..."
              className="min-w-0 flex-1 rounded-full border border-black/15 bg-white px-4 py-2.5 text-[13px] outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={sending || !draft.trim()}
              className="flex-none rounded-full bg-primary px-5 py-2.5 text-[12px] font-bold text-white transition hover:bg-navy-deep disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </form>
      ) : (
        <p className="mt-4 border-t border-black/10 pt-4 text-[12px] text-primary/50">
          <a href="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
            Sign in
          </a>{" "}
          to join the conversation.
        </p>
      )}
    </div>
  );
}

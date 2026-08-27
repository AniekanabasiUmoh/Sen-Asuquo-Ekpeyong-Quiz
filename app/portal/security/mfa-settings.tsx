"use client";

/* The initial factor read hydrates client auth state after mount. */
/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Factor = { id: string; friendly_name?: string | null; factor_type: string; status: string };

export function MfaSettings({ next }: { next?: string }) {
  const [factors, setFactors] = useState<Factor[]>([]);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const supabase = createClient();

  async function loadFactors() {
    const { data, error: loadError } = await supabase.auth.mfa.listFactors();
    if (loadError) setError(loadError.message);
    setFactors((data?.totp ?? []) as Factor[]);
  }

  useEffect(() => { void loadFactors(); }, []);

  async function enroll() {
    setBusy(true); setError(null); setMessage(null);
    const { data, error: enrollError } = await supabase.auth.mfa.enroll({ factorType: "totp", friendlyName: "SAEAC authenticator" });
    if (enrollError || !data) { setError(enrollError?.message ?? "Could not start MFA enrollment."); setBusy(false); return; }
    setFactorId(data.id); setQrCode(data.totp.qr_code); setSecret(data.totp.secret); setBusy(false);
  }

  async function verify() {
    if (!factorId || !/^\d{6}$/.test(code)) { setError("Enter the six-digit code from your authenticator app."); return; }
    setBusy(true); setError(null); setMessage(null);
    const { error: verifyError } = await supabase.auth.mfa.challengeAndVerify({ factorId, code });
    if (verifyError) setError("That code was not accepted. Check the time on your device and try again.");
    else { setMessage("MFA enabled for this account."); setQrCode(null); setSecret(null); setFactorId(null); setCode(""); await loadFactors(); }
    setBusy(false);
  }

  async function remove(id: string) {
    if (!window.confirm("Remove this authenticator? You may lose access to privileged tools until another factor is enrolled.")) return;
    setBusy(true); setError(null);
    const { error: removeError } = await supabase.auth.mfa.unenroll({ factorId: id });
    if (removeError) setError(removeError.message); else { setMessage("Authenticator removed."); await loadFactors(); }
    setBusy(false);
  }

  const verified = factors.filter((factor) => factor.status === "verified");
  return <div className="max-w-2xl"><div className="rounded-[24px] bg-white p-7"><p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary/45">Account security</p><h2 className="mt-3 font-display text-xl font-bold">Multi-factor authentication</h2><p className="mt-3 text-[14px] leading-relaxed text-primary/60">Use an authenticator app such as Google Authenticator, 1Password or Microsoft Authenticator. Keep a recovery method with the committee; SAEAC does not store backup codes.</p>{error ? <p role="alert" className="mt-5 rounded-2xl border border-red/30 bg-red/5 px-4 py-3 text-[13px] font-semibold text-red-ink">{error}</p> : null}{message ? <p role="status" className="mt-5 rounded-2xl border border-grass/30 bg-grass/8 px-4 py-3 text-[13px] font-semibold text-forest">{message}</p> : null}<div className="mt-6">{verified.length ? <div><h3 className="font-semibold">Enrolled authenticator{verified.length === 1 ? "" : "s"}</h3><ul className="mt-3 space-y-2">{verified.map((factor) => <li key={factor.id} className="flex items-center justify-between gap-3 rounded-2xl bg-cream px-4 py-3 text-[13px]"><span>{factor.friendly_name || "Authenticator app"}</span><button type="button" disabled={busy} onClick={() => void remove(factor.id)} className="text-[12px] font-semibold text-red-ink underline-offset-4 hover:underline">Remove</button></li>)}</ul></div> : <p className="text-[14px] text-primary/60">No verified authenticator is enrolled.</p>}</div>{qrCode ? <div className="mt-7 rounded-2xl bg-cream p-5"><h3 className="font-semibold">Scan this QR code</h3><p className="mt-2 text-[13px] leading-relaxed text-primary/60">Add the account in your authenticator app, then enter the six-digit code it generates.</p><img src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(qrCode)}`} alt="QR code for SAEAC MFA enrollment" className="mx-auto mt-5 h-48 w-48 rounded-xl bg-white p-2" /><p className="mt-4 break-all font-mono text-[12px] text-primary/60">Manual setup key: {secret}</p><div className="mt-4 flex flex-wrap gap-3"><input aria-label="Authenticator code" inputMode="numeric" pattern="[0-9]*" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} className="w-40 rounded-full border border-black/15 bg-white px-4 py-3 text-[14px] tracking-[0.2em] outline-none focus:border-primary" placeholder="000000" /><button type="button" disabled={busy} onClick={() => void verify()} className="rounded-full bg-primary px-5 py-3 text-[12px] font-bold text-white transition hover:bg-navy-deep disabled:opacity-55">{busy ? "Verifying…" : "Verify authenticator"}</button></div></div> : null}{!qrCode ? <button type="button" disabled={busy} onClick={() => void enroll()} className="mt-6 rounded-full bg-gold px-6 py-3.5 text-[13px] font-bold text-primary transition hover:bg-primary hover:text-white disabled:opacity-55">{busy ? "Starting…" : verified.length ? "Add another authenticator" : "Set up authenticator"}</button> : null}{next ? <p className="mt-5 text-[12px] text-primary/50">After verification you can return to the requested workspace.</p> : null}</div></div>;
}

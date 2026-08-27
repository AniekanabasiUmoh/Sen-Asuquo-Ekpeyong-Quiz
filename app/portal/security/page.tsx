import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { MfaSettings } from "./mfa-settings";

export const metadata: Metadata = { title: "Account security", robots: { index: false } };
export default async function SecurityPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  await requireUser("/portal/security");
  const { next } = await searchParams;
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : "/portal";
  return <div><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/50">Portal</p><h1 className="mt-3 font-display text-[clamp(1.9rem,4vw,2.6rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">Secure your account</h1><p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-primary/60">Privileged committee accounts should enrol multi-factor authentication before the committee enables mandatory MFA.</p><div className="mt-10"><MfaSettings next={safeNext} /></div><Link href={safeNext} className="mt-6 inline-block text-[13px] font-semibold text-primary underline-offset-4 hover:underline">Return to workspace</Link></div>;
}

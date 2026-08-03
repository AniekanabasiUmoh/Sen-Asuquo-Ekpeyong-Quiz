import Link from "next/link";
import type { Metadata } from "next";
import { Logo, Ribbon } from "@/components/brand";
import { brand, variantHref, variants } from "@/content/homepage";

export const metadata: Metadata = {
  title: "Phase 0 · Choose a Direction",
};

const palette = [
  { hex: "#000513", name: "Ink" },
  { hex: "#14339f", name: "Navy" },
  { hex: "#0006eb", name: "Brand Blue" },
  { hex: "#01daeb", name: "Cyan" },
  { hex: "#f44423", name: "Flame" },
  { hex: "#fe6c03", name: "Orange" },
  { hex: "#ffe169", name: "Gold" },
  { hex: "#2dc653", name: "Grass" },
  { hex: "#9d4edd", name: "Violet" },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-[#0d2270] text-white">
      <Ribbon />

      <div className="mx-auto max-w-7xl px-6 py-14">
        <header className="flex flex-wrap items-center justify-between gap-6">
          <Logo variant="white" width={170} />
          <div className="text-right text-xs uppercase tracking-widest text-white/45">
            Phase 0 · Design Direction
            <br />
            <span className="text-white/30">Internal review</span>
          </div>
        </header>

        <div className="mt-16 max-w-3xl">
          <h1 className="display text-[clamp(2.5rem,7vw,5rem)]">Pick a Direction</h1>
          <p className="mt-6 text-lg leading-relaxed text-white/70">
            Five homepage concepts for the {brand.short} website. Every variant uses the{" "}
            <strong className="font-semibold text-white">same brand</strong> — the SÆAC logo, the
            official colour palette, and Lama Sans — and the{" "}
            <strong className="font-semibold text-white">same content</strong> from the Website
            Content Guide. What differs is layout, rhythm, and tone.
          </p>
          <p className="mt-5 text-sm text-white/50">
            <strong className="font-semibold text-[#ffe169]">
              Bold Editorial (A) was chosen
            </strong>{" "}
            and is now the live homepage. The other four are kept here for reference. Nothing
            is connected to a backend yet.
          </p>
        </div>

        {/* Variant cards */}
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {variants.map((v) => (
            <Link
              key={v.id}
              href={variantHref(v.id)}
              className="group flex flex-col rounded-2xl border border-white/12 bg-white/[0.04] p-7 transition hover:border-white/35 hover:bg-white/[0.07]"
            >
              <div className="flex items-center justify-between">
                <span
                  className="display text-5xl transition group-hover:scale-110"
                  style={{ color: v.accent }}
                >
                  {v.id.toUpperCase()}
                </span>
                <span className="rounded-full border border-white/15 px-3 py-1 text-[10px] uppercase tracking-widest text-white/45">
                  {v.reference}
                </span>
              </div>
              <h2 className="mt-6 text-xl font-bold">{v.name}</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-white/60">{v.blurb}</p>
              <span className="mt-6 text-xs font-bold uppercase tracking-widest text-white/45 transition group-hover:text-white">
                View homepage →
              </span>
            </Link>
          ))}
        </div>

        {/* Fixed brand reference */}
        <section className="mt-20 rounded-2xl border border-white/12 bg-white/[0.03] p-8 sm:p-10">
          <h2 className="display text-3xl">Fixed across all five</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/60">
            These are already decided by the SAEAC brand guide and are not part of this review.
          </p>

          <div className="mt-9 grid gap-10 lg:grid-cols-[1fr_1fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/40">Palette</p>
              <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
                {palette.map((c) => (
                  <div key={c.hex}>
                    <div
                      className="h-14 w-full rounded-lg border border-white/10"
                      style={{ background: c.hex }}
                    />
                    <p className="mt-1.5 text-[10px] font-semibold">{c.name}</p>
                    <p className="font-mono text-[9px] uppercase text-white/35">{c.hex}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/40">
                Typography
              </p>
              <div className="mt-4 space-y-4">
                <div className="rounded-lg border border-white/10 p-4">
                  <p className="font-display text-3xl font-extrabold tracking-[-0.02em]">
                    Lama Sans
                  </p>
                  <p className="mt-1.5 text-[11px] text-white/40">
                    Headlines and body across every variant
                  </p>
                </div>
                <div className="rounded-lg border border-white/10 p-4">
                  <p className="display text-3xl">Lama Sans Condensed</p>
                  <p className="mt-1.5 text-[11px] text-white/40">
                    Reserved for condensed display treatments
                  </p>
                </div>
                <div className="rounded-lg border border-white/10 p-4">
                  <p className="font-serif text-2xl">Libre Caslon</p>
                  <p className="mt-1.5 text-[11px] text-white/40">
                    Variant C only — editorial serif, SIL OFL licensed
                  </p>
                </div>
              </div>
              <p className="mt-5 text-xs leading-relaxed text-white/45">
                Tagline: <em className="text-white/70">{brand.tagline}</em>
                <br />
                Wordmark uses the Æ ligature — SÆAC.
              </p>
            </div>
          </div>
        </section>

        {/* Notes */}
        <section className="mt-10 rounded-2xl border border-[#ffe169]/25 bg-[#ffe169]/[0.06] p-8">
          <h2 className="text-lg font-bold text-[#ffe169]">Notes for reviewers</h2>
          <ul className="mt-5 space-y-2.5 text-sm leading-relaxed text-white/70">
            <li>
              • Photography is placeholder stock, licensed for commercial use. Real SAEAC event
              photography should replace it before launch.
            </li>
            <li>
              • The countdown targets a <strong>provisional</strong> registration deadline of 30
              October 2026 — to be confirmed by the Organising Committee.
            </li>
            <li>
              • News items, sponsor names, and the Variant E scoreboard are illustrative dummy data.
            </li>
            <li>
              • All figures (117 schools, seven LGAs, prize amounts, stage progression) come
              directly from the Content Guide and RD deck.
            </li>
            <li>• Use the bar at the bottom of each page to jump between variants.</li>
          </ul>
        </section>

        <footer className="mt-16 border-t border-white/10 pt-8 text-xs text-white/35">
          © 2026 {brand.name}. Phase 0 design review — not for public distribution.
        </footer>
      </div>
    </div>
  );
}

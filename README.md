# SAEAC Website — Phase 0

Five homepage concepts for the Senator Asuquo Ekpenyong Academic Championship, built so the
project team can pick one design direction before the rest of the site is built.

## Run it

```bash
cd saeac-v2/site
npm install
npm run dev
```

Then open <http://localhost:3000>. The index page lists all five variants; a bar at the bottom of
every page jumps between them.

| Route | Variant | Reference template | Character |
|---|---|---|---|
| `/` | Comparison index | — | Side-by-side review page |
| `/a` | Bold Editorial | Caladan | Oversized condensed caps, full-bleed navy, loudest |
| `/b` | Minimal Institutional | Origin Studio | Whitespace-driven, restrained, official |
| `/c` | Editorial Contrast | People Work | Photography-led storytelling scroll |
| `/d` | Warm Community | Safeer | Rounded cards, soft tints, parent-friendly |
| `/e` | Data-Forward | Setrex SaaS | Stat tiles, live scoreboard, platform feel |

## What is fixed vs. what is being chosen

**Fixed — not part of this review.** SAEAC has a completed brand identity, so all five variants
share it exactly:

- SÆAC logo (note the **Æ ligature**), white and blue lockups
- The official 12-colour palette — primary blue `#0006EB`, logo navy `#14339F`, gold `#FFE169`
- Lama Sans (Baianat) — body weights plus the condensed cuts used for headline caps
- The four-colour ribbon motif (red / orange / blue / gold)
- All copy, figures, and competition mechanics

**Being chosen.** Layout, section rhythm, component style, density, and tone.

## Structure

```
app/
  page.tsx            comparison index
  a|b|c|d|e/page.tsx  the five homepage variants
  globals.css         @font-face declarations + brand tokens (Tailwind v4 @theme)
components/
  brand.tsx           Logo, Ribbon, CornerRibbon, Pill
  countdown.tsx       live countdown (hydration-safe)
  switcher.tsx        review-only variant switcher bar
content/
  homepage.ts         ALL copy and data — single source of truth for every variant
public/
  brand/              logo PNGs at web sizes
  fonts/              Lama Sans woff2 (9 weights, ~44 KB each)
  img/                placeholder photography
```

Every variant imports from `content/homepage.ts`, so the five pages are guaranteed to show
identical content. To correct a fact, edit that one file.

## Verification

```bash
node shots.mjs    # screenshots to shots/  (ROUTES=a,b MOBILE=1 to narrow)
node audit.mjs    # horizontal overflow, broken images, heading order, tap-target sizes
```

Both currently pass clean at 390px and 1440px, and `npm run build` prerenders all six routes
as static pages.

## Placeholder content to replace

- **Photography** — stock imagery of West African secondary school students (Pexels, licensed for
  commercial use, no attribution required). Replace with real SAEAC event photography.
- **Countdown deadline** — provisionally 30 October 2026. Needs the Organising Committee's
  confirmed registration deadline.
- **News items, sponsor names, Variant E scoreboard** — illustrative dummy data.

Everything else — 117 schools, the seven LGAs and their school counts, all seven stages, the prize
schedule, and the Round 3 Striker/Assist/Substitution/VAR mechanics — comes directly from the
Website Content Guide and the RD deck.

## Not in Phase 0

No backend, no authentication, no CMS, no database. Supabase arrives in Phase 2. See
[../SAEAC-PHASES-AND-SPRINTS.md](../SAEAC-PHASES-AND-SPRINTS.md).

# Complaints & Fixes — Homepage Review

Running log of issues raised during client/team review, with the identified
problem and the proposed fix for each.

**Status:** all 13 items applied and deployed. Items 1–13 below are marked
`fixed`; the blocked list at the foot still needs client input.

**Site under review:** https://senatorquiz.vercel.app

---

## Legend

| Field | Meaning |
|---|---|
| **Source** | Who raised it (client, PM, Offiong, internal) |
| **Problem** | What is actually wrong, stated plainly |
| **Solution** | What will be changed to fix it |
| **Status** | `open` · `fixed` · `needs decision` · `blocked` |

---

## Items

### 1 — Hero headline is the wrong line

- **Source:** Client
- **Area:** Hero
- **Status:** `fixed`

**Problem.** The hero reads "Who Wins This?". The client's line is
**"Who will be the Standard?"** — this also appeared in his earlier notes
("Photo / Who will be the Standard?") and was not picked up at the time.
"Who Wins This?" is currently baked into the brand content as the campaign
line, so it appears in more than one place.

**Solution.** Change the hero headline to "Who will be the Standard?".
Apply the same two-tone treatment — "Who will be the" in solid white,
"Standard?" in the muted tone — so the existing type rhythm is preserved.
Update `brand.campaignLine` and `hero.headline` in `content/homepage.ts`
together so the two cannot drift apart, and check the `/directions` review
page and variants B–E for the old string.

---

### 2 — Navigation menu needs better arrangement

- **Source:** Client
- **Area:** Header
- **Status:** `fixed`

**Problem.** Ten top-level links wrap onto two rows inside the floating nav
panel, which reads as a list rather than a menu. The wrap point is awkward
("Sponsors & Partners" and "Contact Us" drop alone onto row two), and the two
"SOON" badges add further visual noise. The panel is also very wide, so the
logo sits far from the links.

**Solution.** Group the ten items into a smaller set of top-level entries with
dropdowns, following the Content Guide §3.1 structure, which was written for
exactly this:

- Home
- About SAEAC
- Competition ▾ (The Championship, Competition Structure, Fixtures & Results, Leaderboard)
- Schools Registration
- News & Media
- Sponsors & Partners
- Contact Us

That reduces ten items to seven and fits one row comfortably. Keep the two
CTA buttons where they are. Retain the "Soon" markers, but move them inside
the dropdown next to the relevant child items rather than on the top bar.

---

### 3 — Remove the eyebrow text above the headline

- **Source:** Client
- **Area:** Hero
- **Status:** `fixed`

**Problem.** The pill reading "CROSS RIVER SOUTH SENATORIAL DISTRICT · MAIDEN
EDITION" sits directly above the headline and is not wanted.

**Solution.** Remove the eyebrow pill from the hero. Keep `hero.eyebrow` in
the content file (unused) or delete it outright — decide when applying, based
on whether any other section still references it. The headline then becomes
the first element in the hero block; add a little top spacing so it does not
sit too close to the nav panel.

---

### 4 — Statistics row: accent colour usage

- **Source:** Client ("we can use the accent colours here yeah? or not? up to you")
- **Area:** Live statistics
- **Status:** `fixed` — my recommendation below

**Problem.** The four headline figures currently run red → orange → green →
blue. Two issues with this. Green (`#2dc653`) is not in the SAEAC Meeting
Report's accent set, so it reads as a fifth colour rather than part of the
system. And using four different colours across four adjacent numbers makes
the row feel like a chart legend — the eye reads the colours as meaning
something (categories, status) when they are purely decorative.

The second row (₦25M / ₦200M / Annual) is all navy, so the two rows do not
look related.

**Solution.** Keep colour, but restrain it to the report's three accents —
red `#f03018`, gold `#f0a800`, blue `#003090` — dropping green. Suggested
assignment:

| Figure | Colour | Reason |
|---|---|---|
| 7 LGAs | navy `#003090` | Baseline fact |
| 250+ Schools | red `#f03018` | Scale |
| 10,000+ Competitors | red `#f03018` | Scale — pairs with the figure above |
| 1 Champion | gold `#f0a800` | The prize; gold is the win colour throughout the site |

That way colour carries meaning — gold marks the outcome, red marks scale —
instead of being applied at random. The financial row stays navy as the
quieter supporting tier.

**DECIDED — client overruled the gold.** "I kinda hate gold. Leave it like
that." So the current four-colour treatment (red / orange / green / blue)
**stays as is**. No change to the statistics row colours.

This has a wider consequence worth checking when applying: gold `#f0a800` is
currently used as a primary accent across the whole site — the Register
button, the Champion prize card, the "Combined" LGA badges, the 250+ tile
figure, the Striker's jersey number, footer hovers. If the client dislikes
gold generally (not just here), that is a much larger change. **Ask before
assuming** — this item only rules on the statistics row.

---

### 5 — Statistics row should animate

- **Source:** Client ("this seems like a perfect place to use animations")
- **Area:** Live statistics
- **Status:** `fixed` — partially already done

**Problem.** The client is right that this is the strongest candidate for
motion. Count-up animation **is** already implemented here (added in the last
round) — the numbers tick from zero when scrolled into view. It is likely he
did not see it because the section was already on screen when the page
settled, or because the effect is over quickly.

**Solution.** Keep the count-up but make it read more clearly:

- Lengthen the duration slightly (1.4s → ~1.8s) so the motion registers.
- Increase the per-figure stagger so they fire in sequence rather than
  together — left to right, ~140ms apart.
- Animate the second row as well; it is currently static.
- Add a thin accent underline that wipes in beneath each figure as it lands.

All of it stays inside the existing `prefers-reduced-motion` guard.

---

### 6 — Add zoom-in motion to images site-wide

- **Source:** Client ("the use of zooming in animations into pictures would
  make the site feel alive. On all images")
- **Area:** Global
- **Status:** `fixed`

**Problem.** Images are currently static until hovered, and hover does nothing
on touch devices — which is the primary medium per Offiong. So on phones the
photography never moves at all.

**Solution.** Add a slow scroll-triggered zoom to images: each photo starts at
~1.08 scale and eases to 1.0 as it enters the viewport, over roughly 1.2s.
This is the "Ken Burns on reveal" effect and it works without hover, so it
lands on mobile.

Apply via a shared wrapper so it is consistent everywhere — LGA tiles, news
cards, bento cards, principals' mosaic, origin mosaic, board photo, stage
thumbnails. Keep the existing hover zoom on desktop as a separate, subtler
interaction.

Two constraints:

- The hero image must **not** zoom on load — it competes with the headline
  and shifts the composition behind the type. Leave the hero still.
- Everything sits inside `prefers-reduced-motion`, and images need
  `overflow-hidden` on the frame so the scale does not bleed past the corner
  radius.

---

### 7 — Dead vertical gap in the "Seven Subject Areas" card

- **Source:** Client
- **Area:** About SAEAC / bento grid
- **Status:** `fixed`

**Problem.** The card uses `justify-between` on a full-height flex column, so
the "7" badge is pinned to the top and the rest of the content to the bottom.
Because the neighbouring photo card is tall, that leaves a large empty band —
roughly 180px — between the "7" and the "Seven Subject Areas" heading. It
reads as a mistake rather than as deliberate whitespace.

**Solution.** Stop forcing the content apart. Change the card to a normal
top-aligned stack (`justify-start`) with controlled spacing: badge → heading
→ body → subject pills, each with a fixed gap of roughly 1.25rem. Any leftover
height falls at the bottom of the card, where it looks intentional.

If it still reads short next to the photo, either drop the photo card's
minimum height slightly or let the subject pills breathe with a bit more
row-gap — but do not reintroduce a single large gap in the middle.

---

### 8 — Remove the Strikers / Assist cards from the bento grid

- **Source:** Client
- **Area:** About SAEAC / bento grid
- **Status:** `fixed`

**Problem.** The bento grid's second row shows "Strikers" and "Assist" cards,
which duplicate the Grand Finale Showdown section further down the page —
where the same four mechanics (Strikers, Assist, Substitution, VAR) are
explained properly alongside the Striker illustration. Explaining them twice
is part of the repetition the client flagged earlier.

**Solution.** Delete the two mechanic cards from the bento grid. That leaves
the "One Grand Champion" image card alone on that row, so rebalance: either
widen the champion card to sit alongside the subject-areas card, or promote a
different, non-duplicated card into the slot. Simplest option is to make the
second row a two-up — champion image plus one supporting card — rather than
a three-up with a hole in it.

The Showdown section keeps all four mechanics unchanged.

---

### 9 — Remove the "Cross River South" eyebrow pill

- **Source:** Client
- **Area:** Seven LGAs section
- **Status:** `fixed`

**Problem.** Same objection as item 3 — the eyebrow pill above the section
heading is unwanted.

**Solution — CONFIRMED by client: remove all eyebrow pills.** Every instance
comes off the page: About SAEAC, Cross River South, Who's Competing, What's at
Stake, Our Origin, Latest from Schools, Board of Directors, Get Involved,
Entry is free, Round 3 · Live Format, Before You Enter. Headings carry each
section on their own.

Remove the `Eyebrow` helper component from `app/page.tsx` once nothing
references it. Where a pill carried information not repeated elsewhere (the
Showdown's "Round 3 · Live Format", the register block's "Entry is free"),
fold that fact into the section's supporting line rather than losing it.

---

### 10 — LGA tile photography is wrong

- **Source:** Client
- **Area:** Seven LGAs
- **Status:** `fixed` — largest item in this round

**Problem.** The tiles are a mix of sources and the result is incoherent and,
in three cases, plainly wrong.

| LGA | Current image | Verdict |
|---|---|---|
| Akpabuyo | Young woman, not clearly a student | Poor choice — replace |
| Biase | Boys in khaki uniform, school courtyard | **Client approves — keep** |
| Odukpani | Principals seated at the meeting | **Wrong — adults, not students** |
| Akamkpa | Studio shot, yellow backdrop, sunglasses | Stylised, not a real school setting |
| Bakassi | Principals at the meeting | **Wrong — adults, not students** |
| Calabar Municipality | Students at "Edufort" school gate | Real secondary school — acceptable |
| Calabar South | Principal seated at the meeting | **Wrong — adults, not students** |

The three principal photographs are the serious error. I introduced them last
round while fixing a different problem (northern-Nigeria stock that did not
suit Cross River) and substituted images of adults into tiles that are meant
to represent students. That was my mistake.

**Solution.** Source seven new images online, one per LGA, all of **secondary
school students** — no principals, no adults, no studio portraits. Criteria:

- West African secondary-age students, in school uniform
- Real school settings — classroom, courtyard, assembly, school gate
- Consistent in tone so the seven tiles read as one set
- Portrait or square-croppable to 4:5 without losing the subject

Keep Biase as-is (client approved). Calabar Municipality can stay unless a
better match is found. Replace the other five.

Every downloaded image is to be checked on a contact sheet **before** it goes
into the build — this exact failure is what skipping that step produces.

The meeting photographs remain in use in the "Latest from Schools" section,
where principals are the correct subject.

---

### 11 — Remove the "Schools of the District" section

- **Source:** Client
- **Area:** Schools roster
- **Status:** `fixed`

**Problem.** The section lists twelve real school names as a plain roster. It
was reworked last round from photo cards to text after the earlier version
misattributed stock photography to named schools. The client now wants the
whole section gone.

**Solution.** Delete the section outright, along with the `featuredSchools`
export in `content/homepage.ts` and its import. Remove the "Schools" entry
from the navigation if it still points here. The full roster belongs in the
registration database from Phase 2 anyway.

---

### 12 — "What the Champions Win" needs a stronger treatment

- **Source:** Client ("can look better, perhaps like the Grand Finale
  Showdown section")
- **Area:** Prizes
- **Status:** `fixed`

**Problem.** The section is three flat cards — one navy, two white — carrying
bulleted lists. Against the Showdown section, which is a full-bleed dark panel
with a background photograph, an illustration and rule-separated columns, it
looks unfinished. The client has named the treatment he wants.

**Considered and rejected — straight copy of the Showdown panel.** Rebuilding
this as a second full-bleed dark panel would put three heavy blocks within one
scroll of each other: Showdown (dark navy), Champions Win (dark navy), Change
Maker (solid red). Stacked, they make the middle of the page feel top-heavy
and the Showdown loses its status as the one dramatic moment.

**Solution — AGREED WITH CLIENT: photography instead of a third dark slab.**
Keep the *structure* the client responded to — three columns, generous scale,
thin rules, strong headings — but invert the surface so it alternates with
its neighbours rather than repeating them.

Three tall image cards, one per group:

| Group | Imagery |
|---|---|
| Champion School | A school building / classroom — the ICT centre and infrastructure prizes |
| Champion Students | Students celebrating — cash awards, laptops, scholarships |
| Teachers | A teacher or mentor with students — the excellence awards |

Each card:

- Portrait aspect (roughly 4:5), rounded 28px, photograph filling the frame
- Bottom-up gradient scrim so text stays legible over the image
- Group name large at the foot, prize items listed above it
- Scroll-triggered zoom per item 6, plus staggered reveal

Resulting page rhythm alternates rather than stacks:
**dark Showdown → light-with-imagery Champions Win → red Change Maker.**

The three groups and their items stay exactly as the client supplied them.
New photography required — three images, sourced and contact-sheet checked
alongside the seven LGA images in item 10.

---

### 13 — Remove the FAQ section

- **Source:** Client
- **Area:** FAQ
- **Status:** `fixed`

**Problem.** Client wants it off the homepage.

**Solution.** Delete the FAQ section and its `Accordion` usage from the
homepage. Keep the `faq` export in `content/homepage.ts` and the `Accordion`
component — the Content Guide specifies a dedicated FAQ page in Phase 1, and
both will be needed there. Remove the now-unused import from `app/page.tsx`.

---

## Blocked / needs client decision

Carried over from earlier rounds; these cannot be resolved by design work alone.

| # | Item | Blocker |
|---|---|---|
| B1 | Grand Patron's quote | Placeholder text on the live site. The Content Guide (§4.2) requires his own words, commissioned from his office. |
| B2 | Prize structure conflict | The client's "What the Champions Win" screenshot and the Content Guide §4.15 schedule do not fully agree. Both are currently shown. Need confirmation of which governs. |
| B3 | Committee names, roles, photos | Not supplied. |
| B4 | Venue addresses per LGA + Grand Finale | Not supplied. |
| B5 | Real registration deadline | Countdown runs to a provisional 30 Oct 2026. |
| B6 | Full 117/250+ school roster | Only a sample of real school names is available. |
| B7 | Vector logo files (.ai/.svg) | Only raster PNGs supplied; needed for print/large format. |

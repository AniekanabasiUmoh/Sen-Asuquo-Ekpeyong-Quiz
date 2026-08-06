# Complaints & Fixes — Homepage Review, Round 2

Running log of issues raised during client/team review, with the identified
problem and the proposed fix for each.

**Status:** all Round 2 items applied and deployed. Blocked list at the
foot still needs client input.

**Site under review:** https://senatorquiz.vercel.app

Round 1 (13 items) was applied and deployed in commit `bc19620`.

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

### 1 — Add the Scholars in Diaspora organiser photograph

- **Source:** Client
- **Area:** Board of Directors
- **Status:** `fixed`

**Problem.** The Board of Directors section currently reuses
`origin-team.jpg` — the same photograph already used in the Our Origin
mosaic. The section describing the organisers has no photograph of its own.

**Solution.** Use the newly supplied group photograph of Scholars in Diaspora
in the United Kingdom, holding the ₦20,000,000 cheque toward the nomination
form. Imported as `public/img/board-scholars-uk.jpg`. This is the organising
body pictured as a group, which is exactly what the section needs, and it
frees `origin-team.jpg` to sit only in Our Origin.

---

### 2 — Statistics rows need images

- **Source:** Client ("this could benefit from images")
- **Area:** Live statistics
- **Status:** `fixed`

**Problem.** Both statistics rows are pure type on the flat cream ground —
four large figures, then three financial figures. Across two rows and seven
figures it is a lot of unbroken text, and the section reads as a spreadsheet
rather than as part of a designed page.

**Solution.** Keep the figures dominant but introduce photography so the block
has some texture. Options, in order of preference:

1. **Preferred.** Turn the second (financial) row into a two-up: the three
   financial figures stay as type on the left, and a single wide photograph
   fills the right — the ₦20m cheque presentation would tie the ₦25M seed
   fund figure to the moment it was announced.
2. Insert a full-width photographic band between the two rows, cropped
   shallow (roughly 21:9) so it separates them without adding much height.

Either way the four headline figures stay as they are — the client already
approved that row's colour treatment and it should not be disturbed.

---

### 3 — "Seven Subject Areas" card still looks weak

- **Source:** Client ("look at that 7 seven subjects that stuff could look
  better")
- **Area:** About SAEAC / bento grid
- **Status:** `fixed`

**Problem.** Round 1 closed the dead vertical gap, but the card is still the
weakest thing on the page. The "7" sits in a small pale rounded square that
reads as a placeholder icon, and the seven subject pills wrap awkwardly into
5 + 2, leaving a ragged second line.

**Solution.** Rebuild the card so the number and the list do the work:

- Drop the pale badge. Set the "7" as a large display numeral in the brand
  red, bled to the top-left of the card, with "Subject Areas" set beside or
  beneath it — the figure becomes the graphic rather than sitting inside a box.
- Replace the pill cloud with a clean numbered list (01–07), one per line,
  rule-separated. Seven short items in a column reads far better than seven
  pills wrapping unevenly, and it echoes the numbered stage list further down
  the page.

---

### 4 — Remove the star badge from the "Seven Stages" card

- **Source:** Client ("remove star from seven stages")
- **Area:** About SAEAC / bento grid
- **Status:** `fixed`

**Problem.** I put a red ★ in that card during Round 1, purely to stop it
duplicating the "7" badge next to it. It carries no meaning and looks like
leftover placeholder art.

**Solution.** Remove the badge entirely. The heading and body carry the card;
it does not need an icon. Same applies to any other decorative badge left in
the bento grid.

---

### 5 — Stage thumbnails could look better

- **Source:** Client ("could those images look better?")
- **Area:** The Road to the Finale
- **Status:** `fixed`

**Problem.** Each of the seven stage rows carries a small thumbnail — roughly
136×76px — with its caption beneath. At that size the photographs are
illegible: the subject cannot be read, and they end up as grey-green smudges
in the right column. They also still use the older generic stock rather than
the newer verified student photography.

**Solution.** Two changes:

- **Bigger, and a consistent shape.** Take the thumbnails to roughly
  200×130px on desktop and give them a fixed 3:2 crop so the seven rows align
  cleanly. Move the field label ("5 students per school") beside the
  thumbnail rather than beneath it, so the row does not grow taller.
- **Better source images.** Replace the remaining generic stock with frames
  from the verified student set, chosen so each one actually depicts its
  stage — registration, screening, qualifiers, and so on.

Alternative if the client prefers a lighter treatment: drop the thumbnails
entirely and let the numbered list stand alone. Cleaner, and consistent with
"minimalist, fewer words" — but loses the photography he has asked for
elsewhere. **Recommend the bigger-thumbnail option.**

---

### 6 — Remove the header buttons; menu needs work

- **Source:** Client ("remove the buttons at the top right, the menu can look
  better")
- **Area:** Header
- **Status:** `fixed`

**Problem.** The floating nav panel carries two buttons top-right — "Sponsor
the Championship" and "Register Your School" — above a row of seven links.
The panel is doing too much: two rows, two buttons, a dropdown, and a logo.

Note this reverses part of the original brief, which specified both buttons
fixed in the header. Removing them is the client's call and is recorded as
such.

**Solution.** Strip the header back to one row: logo left, links right, no
buttons. The nav panel becomes a single slim bar, which is both calmer and
lets the hero headline sit higher.

The two calls to action do not disappear — they already exist in the hero
action bar directly beneath ("Register Now", "Become a Partner"), plus the
dedicated Register and Sponsor sections further down. Nothing is lost.

If the client later wants a persistent CTA, the better pattern is a single
button that appears in a sticky bar only after the hero scrolls out of view,
rather than two competing buttons in the panel from the start.

---

### 7 — Hero CTA buttons look wrong on mobile

- **Source:** Client ("Register Now / Become a Partner — those buttons don't
  look very good on mobile")
- **Area:** Hero action bar
- **Status:** `fixed`

**Problem.** On a 390px viewport the two buttons sit side by side, each taking
half the width. "Become a Partner" is too long for its half, so it wraps onto
two lines while "Register Now" stays on one — leaving buttons of unequal
height sitting next to each other. "Watch Promo" then sits alone on a third
row, centred, which looks accidental.

**Solution.** Stack them full-width on mobile, one per row, in priority
order: Register Now (solid), Become a Partner (outline), Watch Promo (text
with play icon). Equal width, equal height, no wrapping. Revert to the
side-by-side row at the `sm` breakpoint upward where there is room.

Also reduce the countdown's four units slightly on the narrowest widths so
the action bar as a whole is less crowded.

---

### 8 — Animate the SAEAC logo

- **Source:** Client
- **Area:** Global / brand
- **Status:** `fixed` (Option A) — Option B still blocked on B7

**Problem.** The logo is a static PNG. The client wants it animated.

**Solution.** The constraint here is that we only have raster PNGs — 3264px
artwork, no vector. A PNG cannot be animated meaningfully beyond moving the
whole image. So there are two paths:

**Option A — works with what we have, today.** Treat the logo as one object
and animate it as a whole on page load: a brief scale-and-fade entrance, with
the four-colour ribbon device sweeping in behind it. Modest, and it does not
need new assets.

**Option B — the better result, needs an asset.** Get the vector `.ai`/`.svg`
from the designer (already outstanding as blocker B7). With SVG paths we can
animate the parts: the two human figures rising into their celebration
stance, the diamond star drawing itself, the ribbons sweeping through. That
is the animation the brand actually implies, and it would double as the
site's loading state.

**Recommend Option A now, Option B when the vector arrives.** Flagging that
chasing the vector logo unlocks this properly — worth pushing the designer.

---

### 9 — Other "cool effects" for the site

- **Source:** Client ("some other cool effects on the site. Ideas?")
- **Area:** Global
- **Status:** `fixed` — headline reveal + zoom shipped; others available on request

Suggestions, ordered by impact-per-risk. All would respect
`prefers-reduced-motion` and none would slow the page down:

1. **Headline reveal.** The hero headline rises line by line on load, each
   line masked so it appears to slide up from behind an invisible edge. This
   is the single most effective effect available and every one of the five
   reference templates used it.
2. **Sticky stage list.** As the seven stages scroll, the section heading
   pins and the active stage number highlights — turns a static list into a
   sense of progression down the funnel.
3. **Ribbon draw-on.** The four-colour ribbon device draws itself left to
   right as each dark panel enters view.
4. **Counter underline wipe.** A thin accent rule wipes in beneath each
   statistic as its number finishes counting.
5. **Card lift on hover.** Desktop only — cards raise slightly with a soft
   shadow. Cheap, and makes the grid feel responsive.
6. **Marquee sponsor strip.** The sponsor names scroll slowly and
   continuously rather than sitting still.

**Deliberately not suggesting:** parallax backgrounds, cursor followers, or
scroll-hijacking. They read as dated, hurt mobile performance, and fight the
"organised, simple" direction the client asked for.

---

### 10 — Showdown section must match the RD deck's design

- **Source:** Client (screenshot of RD deck pp.16–18) — "this image of the
  Strikers is what we need, the design and the style"
- **Area:** Grand Finale Showdown
- **Status:** `fixed` — interim glyphs; deck artwork still wanted (B8)

**Problem.** Two separate failures here.

**First, the design is wrong.** The RD deck has a fully realised layout for
these mechanics that I had not seen until now: white cards on a light ground,
each row being `[italic display label] + [illustration] + [coloured
description box]`, rule-separated, with the label underscored by short
red/gold/blue accent strokes and the diagonal ribbon device in the corners.
The description boxes are colour-coded per mechanic. My version is a dark
navy panel with a single home-made SVG striker and four plain text columns —
it shares almost nothing with the client's own material.

**Second, and worse: three mechanics are missing entirely.** The deck defines
**eight**, the site shows four. Missing:

| Mechanic | Substance |
|---|---|
| Scoring | Round 3 scores accumulate with Rounds 1 and 2. Bottom 3 schools by accumulated score are eliminated; 3 schools (9 students) advance to Round 4. |
| Draw or Tie | A penalty is held to separate tied schools. Each school sends forward one Striker to pose questions to the other teams. |
| Scoring Panel | Scores are input by a panel of two individuals nominated by the Board of Trustees plus two persons from each competing school. |
| Side Attraction Game | Audience members stand a chance to win prizes. |

Also note the deck names it **"Assist Option"**, not "Assist", and gives the
Assist value as 0.5 points — consistent with what the site says.

**Solution.**

- Add the four missing mechanics to `showdown.mechanics` in
  `content/homepage.ts`, taking the substance from the deck. Rename "Assist"
  to "Assist Option".
- Rebuild the section in the deck's own idiom: light ground, rule-separated
  rows, italic display labels with the accent underscore strokes, and
  colour-coded description panels. This replaces the dark navy treatment.
- Note this changes the page rhythm — the Showdown stops being the one dark
  panel. Champions Win (Round 1, item 12) is now the image-card section, so
  the balance still works, but check the whole scroll after the change.

**On the illustrations — this needs a decision.** The deck's figures are
footballer silhouettes, a referee, a ball, a handshake, a scoreboard, a
crowd. I can produce these three ways:

1. **Inline SVG, drawn by me.** No dependency, scales cleanly, matches brand
   colours exactly. But eight bespoke figure illustrations is a lot of hand
   drawing and the quality will be decent-not-great — my current single
   striker is honestly mediocre.
2. **Source equivalents from a free icon/illustration library** (undraw,
   Streamline, Noun Project with attribution). Consistent quality, fast, and
   licensing is clean. Risk is they will not match the deck's specific look.
3. **Ask the client's designer** ("FURSIX" Emmanuel, who made the logo) to
   export the eight illustrations from the deck as SVG or transparent PNG.

**Recommend option 3 — the artwork already exists.** These illustrations are
sitting in the source file for that deck. Asking for an export is far better
than me approximating them, and it guarantees the site matches the deck. The
client asked "do you need me to have an agent design it or something?" — the
answer is that no new design work is needed, just an export of existing
assets. Option 1 as the interim so the section is not blocked.

---

---

### 11 — White House reference: motion and "feeling alive"

- **Source:** Client (sends this site repeatedly; "the animation is what blows
  his mind")
- **Area:** Global
- **Status:** `fixed`

**What the reference actually does.** Examined the saved copy. There is no
animation library — no GSAP, no Lenis, no scroll-jacking. The effect comes
from three cheap ingredients:

1. **Full-bleed autoplaying video**, six clips, muted / looping / playsinline,
   each filling the viewport with a small corner caption ("SECURE THE
   BORDER"). The motion is *footage*, not CSS.
2. **`position: sticky`** — sections pin while the next slides over them, so
   the page assembles rather than scrolls.
3. **One `IntersectionObserver`** to play only the visible clip.

He is responding to production value, not code. The technique is easy; the
asset requirement is the whole problem. Their six clips total ~80MB.

**What we can do with the single video we have.**

- **Hero stays a still photograph** — it loads instantly, which matters most
  on the first screen over Nigerian mobile data.
- **The Grand Patron clip becomes one deliberate full-bleed moment** in its
  existing section: sticky-pinned, muted, looping, corner caption in the
  reference's manner. One video used well beats six used badly.
- **Sticky pinning on the seven stages** — heading pins, stages slide past.
  Pure CSS, no assets, and the closest thing to the reference's feel.
- Corner section captions, small and tracked-out, as they use.

**Blocker.** The clip is on YouTube. A YouTube iframe cannot serve as a clean
background video — their chrome, their branding, no reliable muted autoplay.
Need the **original MP4** from whoever shot it. See B9.

**Not recommended from that reference:** the announcement ticker, and the
email-capture modal covering a third of the screen. The modal in particular
would hurt registrations on mobile, which is our primary medium.

---

### 12 — Hosting / CDN for video

- **Source:** Client ("can we host on Cloudflare, would that make it faster?")
- **Area:** Infrastructure
- **Status:** `decided — no change for now`

**The question.** Would Cloudflare speed up video delivery?

**Findings.** Vercel already serves static assets from a global edge cache, so
fronting the current site with Cloudflare adds a hop rather than removing
one. And the real constraint on Nigerian mobile is **bytes, not geography** —
an 80MB file from a fast edge is still 80MB.

Where Cloudflare would genuinely win, if we ever go to multiple clips:

- **Cloudflare Stream** (~$5/mo per 1000 min stored) transcodes uploads and
  serves HLS adaptive bitrate, so a phone on 3G gets 360p while desktop gets
  1080p. Also keeps large binaries out of the git repo — Vercel and GitHub
  both dislike committed video.
- **Cloudflare R2** — zero egress fees, cheaper, but no adaptive bitrate and
  we would compress by hand.

**Decision: no Cloudflare for now.** We have exactly one video. Compress it
(H.264, ~1.5 Mbps, 1280×720, no audio track ≈ 2–3 MB for 15s), put it in
`public/`, let Vercel serve it. No new vendor, no monthly cost. Revisit if the
multi-clip idea proceeds.

**Non-negotiables whenever video ships:** `preload="metadata"` not `auto`; a
real poster frame so something appears instantly; `IntersectionObserver` so
only the visible clip plays; and **no background video on mobile** — serve the
still image below a breakpoint and let desktop have the motion.

**Worth confirming with the client:** whether infrastructure is funded or
expected to run on free tiers. Vercel's free-tier bandwidth will not survive
heavy video, and that is a better conversation now than after a bill.

---

## Blocked / needs client decision

| # | Item | Blocker |
|---|---|---|
| B1 | Grand Patron's quote | Placeholder on the live site. Content Guide §4.2 requires his own words, commissioned from his office. |
| B2 | Prize structure conflict | The client's "What the Champions Win" grouping and Content Guide §4.15 do not fully agree. Both currently shown. |
| B3 | Committee names, roles, photos | Not supplied. |
| B4 | Venue addresses per LGA + Grand Finale | Not supplied. |
| B5 | Real registration deadline | Countdown runs to a provisional 30 Oct 2026. |
| B6 | Gold usage site-wide | Client dislikes gold in the statistics row. Gold also carries the Register button, Champion card, Combined badges. Is the dislike general? |
| B7 | Vector logo files (.ai/.svg) | Only raster PNGs supplied. Blocks proper logo animation (item 8) and is needed for print. |
| B8 | RD deck illustrations | Eight figure illustrations needed as SVG/PNG export from the deck's source file — see item 10. |

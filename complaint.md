# Complaints & Fixes — Homepage Review, Round 3

Running log of issues raised during client/team review, with the identified
problem and the proposed fix for each.

**Status:** all seven Round 3 items applied and deployed. Blocked list at the
foot still needs client input.

**Site under review:** https://senatorquiz.vercel.app

Round 1 (13 items) applied in `bc19620`. Round 2 (12 items) applied in `9c7645f`.

**Round 3 runs to seven items.** The original items 5 and 6 turned out to be
one instruction worded two ways and were merged into item 5, so the floating
tab menu moved up to item 6; the statistics rebuild was then added as item 7.

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

### 1 — Scholars in Diaspora photographs belong in "How the Championship Began"

- **Source:** Client, screenshot 1 — *"Can the pictures be here instead. For
  the Scholars in diaspora members?"*
- **Area:** Our Origin / Board of Directors
- **Status:** `fixed`

**Problem.** The Origin section tells the Scholars in Diaspora story in prose —
sixty scholars, the nomination form, the cheque, the seed donation — but the
photographs of the actual people who did it sit further down the page in the
Board of Directors section, disconnected from the narrative that explains who
they are. On mobile especially, the reader finishes the story and has seen no
faces.

The photos in the client's newly supplied Scholars folder are individual
portraits, which is a different asset class from the single group shot
currently used on the board.

**Solution.** Move the people into the story. Specifically:

- Add a **portrait row beneath the Origin copy** — the individual Scholars in
  Diaspora members, small circular or squared portraits with name and (where
  known) profession beneath, since the copy specifically claims "many now
  qualified as doctors, lawyers, and other professionals". Faces make that
  sentence real; without them it is an assertion.
- Keep the existing three-image mosaic (cheque, team, forms) — that documents
  the event. The portraits document the people. They do different jobs.
- **Board of Directors then becomes the question.** If the individual
  portraits now live in Origin, the Board section is duplicating them. Options:
  either (a) Board keeps the UK group photograph only and becomes a short
  governance statement, or (b) Board is folded into Origin entirely and the
  page loses a section. **Recommend (a)** — the two sections answer different
  questions ("where did this come from" vs "who is accountable for it") and
  collapsing them would blur that.

**Resolved on assets.** The client's own "THE FACES BEHIND THE VISION" cards
carry all twenty-two members as captioned portraits with names and
institutions, so no un-named faces go up. Portraits extracted from that
artwork and set as live text beneath each. Spellings are the client's own and
should be checked by the committee.

---

### 2 — "One Grand Champion" image must show a Nigerian student

- **Source:** Client, screenshot 2 — *"I think you should use a Nigerian
  looking person for this part instead. Especially since it's a district
  specific competition."*
- **Area:** About SAEAC / bento grid — trophy card
- **Status:** `fixed`

**Problem.** `trophy-teen.jpg` shows a student lifting a trophy who does not
read as Nigerian. On a page about seven LGAs of Cross River South, competed in
by Cross River South schools, the single image representing the winner shows
someone from outside the district. The client is right, and this is the same
class of error as the principals-in-student-tiles problem from Round 1: stock
imagery placed without checking whether it can plausibly depict the people it
claims to depict.

It also undercuts the whole proposition. A student in Akpabuyo looking at that
card should see themselves in it.

**Solution.** Replace with a photograph of a Nigerian secondary school student
holding a trophy or in a moment of victory. Sourcing order:

1. **Client's own material first.** Check the Media Assets folder and the
   Scholars in Diaspora report for any prize-giving or award photography. Real
   material always beats stock.
2. If none exists, source verified Nigerian student photography the same way
   the seven LGA tiles were sourced in Round 1 — that set is now the standard
   the rest of the page's imagery should be held to.

**Wider action.** Audit every remaining image on the page against the same
test: *could this plausibly be Cross River South?* Any that fail get replaced
in the same pass, rather than waiting for the client to catch them one at a
time. `graduates.jpg`, `classroom-diverse.jpg` and `girls-classroom.jpg` are
the likely suspects.

---

### 3 — Take out the AI dashes

- **Source:** Client — *"Take out AI Dashes"*
- **Area:** Global / all copy
- **Status:** `fixed`

**Problem.** The copy is full of em dashes — like this one — which has become a
recognisable tell of machine-written text. There are **24 in
`content/homepage.ts` alone**, plus more in the JSX. Whatever one thinks of the
stylistic merits, the client has clocked it, which means readers will too, and
it makes the site read as generated rather than written.

**Solution.** Sweep every em dash out of user-facing copy and recast the
sentence properly in each case. This is a rewrite, not a find-and-replace —
substituting a comma for every dash produces limp sentences. Each one gets one
of:

- **Full stop.** Usually the best answer. Two short sentences beat one dashed
  one.
- **Colon**, where the second half genuinely explains the first.
- **Recast**, where the dash was hiding a weak clause that should just go.

Scope: `content/homepage.ts`, all JSX string literals in `app/page.tsx`, and
the other variant pages. **Code comments are exempt** — they are not
user-facing and rewriting them adds risk for no reader benefit.

While in there, check the other common tells: "moreover", "furthermore",
"it's worth noting", and paired "not just X, but Y" constructions.

---

### 4 — "Become a Partner" should read "Become a Change Maker"

- **Source:** Client — *"Replace Partner with become a change maker"*
- **Area:** Hero action bar, nav, sponsor section
- **Status:** `fixed`

**Problem.** The hero's secondary CTA says "Become a Partner" and points at
`#sponsor`. But the page already has a **Become a Change Maker** section
(`changeMaker`, CTA "Volunteer With Us") which is the volunteering route. Two
different labels, two different sections, and "Partner" is corporate-sponsor
language pointed at an audience the client wants to address as change makers.

This connects to a Round 2 note: the client asked for "Become a volunteer:
Change maker" as the framing. That framing did not propagate to the hero.

**Solution.** Standardise on **Become a Change Maker** as the second CTA
everywhere, pointing at `#changemaker`.

**But this needs one decision first.** Sponsorship and volunteering are not
the same ask — a company writing a cheque and a graduate giving weekends are
different audiences with different next steps. Three ways to resolve it:

1. **Merge.** One "Become a Change Maker" section covering both, with two
   routes inside it. Simplest page, matches the client's language, and fits the
   "fewer words, minimalist" direction. **Recommended.**
2. **Keep both sections**, rename the hero CTA to "Become a Change Maker", and
   let Sponsors sit lower as a corporate-facing block with its own CTA.
3. Rename the Sponsor section itself to Change Maker and drop the volunteer
   section.

Recommend option 1 unless the client wants corporate sponsors addressed
separately, which he may, given the ₦200M target. Flagging for his call — see
B11.

---

### 5 — Hero picture should cross-fade through student photographs

- **Source:** Client — *"Rotate the picture on who will be the standard"* and
  *"As you enter the site you should see a video of him speaking"*; scope
  confirmed by PM as cross-fading student stills, not video
- **Area:** Hero
- **Status:** `fixed`

**Merged with what was logged separately as item 6** (*"As you enter the site
you should see a video of him speaking, similar to white house website"*).
Confirmed by the PM: both comments describe the same thing. The client is not
asking for video on entry. He is asking for the **hero picture to cross-fade
through student photographs**. "Rotate" and "video" were two wordings of one
instruction.

**Problem.** The hero photograph is static. One image carries the entire first
impression, it shows students from one place only, and the first screen has no
motion on it at all — which is what prompted both the "rotate" and the
"video on entry" comments.

**Solution.** Cross-fade the hero through **five student photographs**, roughly
five seconds each.

- **New images only.** Not the seven LGA tiles, not the stage thumbnails, not
  anything already placed elsewhere on the page. A hero that recycles pictures
  the reader meets again three sections down looks thin.
- **Nigerian secondary school students**, held to the same verification
  standard as the Round 1 LGA tile sourcing — uniformed students, classroom and
  school-grounds settings, plausibly Cross River South. This is the same test
  item 2 applies to the trophy image.
- **First frame is a priority image**, remaining four lazy. The hero paints as
  fast as it does today; there is no load penalty and no layout shift.
- Fixed crop across all five so nothing shifts on transition. Cross-fade only,
  no slide or zoom, so it cannot fight the headline reveal.
- **Frozen on the first frame under `prefers-reduced-motion`.** Pauses on tab
  blur so it is not burning cycles in a background tab.

**This is a better answer than the video hero, not a lesser one.** Five stills
cost a fraction of a 754KB loop, behave identically on mobile with no
breakpoint carve-out, and show five different sets of students rather than one
wide shot of a speech. The mobile-data concern that shaped the Round 2 decision
does not arise.

**Consequences of dropping the video hero.**

- The Round 2 item 11 decision **stands unchanged**: hero is photography, the
  Grand Patron clip stays as the one deliberate video moment in its own
  section with the click-to-YouTube handoff. Nothing about that section
  changes.
- **B9 drops back to a nice-to-have.** Purpose-shot b-roll is no longer
  blocking hero quality. Still worth having, no longer urgent.

---

### 6 — Floating tab menu: the homepage is too long

- **Source:** Offiong — *"Can we have tabs up… that we can click… because the
  home page is long."* PM Aniekanabasi — *"Floating Tab Menu. Yes we can."*
- **Area:** Navigation
- **Status:** `fixed`

**Problem.** Offiong is describing a real symptom, and he is right about the
cause. The homepage now runs seventeen sections. Once past the hero there is
no persistent way to jump anywhere: the nav panel scrolls away with the hero
and never comes back. On mobile, reaching Register means scrolling past
everything.

Note this is the natural consequence of Round 2 item 6, which stripped the
header to one row with no buttons and no sticky behaviour. That was the right
call for the hero; it left the rest of the page unnavigable.

**Solution.** A **floating tab menu** that appears once the hero scrolls out of
view and stays pinned thereafter.

- **Desktop:** a slim centred pill bar, floating clear of the content with a
  translucent blurred backing. Section tabs (About · Format · The Draw ·
  LGAs · Prizes · News), plus one solid **Register** button on the right —
  restoring the persistent CTA in the pattern already proposed in Round 2 item
  6, which is exactly the "appears after the hero" behaviour described there.
- **Active-section tracking.** An `IntersectionObserver` highlights whichever
  section is in view, so the bar doubles as a progress indicator. This is the
  part that actually answers "the home page is long" — you always know where
  you are.
- **Mobile:** the same bar pinned to the **bottom** of the viewport, thumb
  reachable, reduced to four or five icon-plus-label tabs with Register
  emphasised. Bottom placement on mobile is both easier to reach and avoids
  fighting the browser chrome at the top.
- Smooth scroll to anchors with `scroll-margin-top` so headings do not land
  under the bar. Hidden on print. Respects `prefers-reduced-motion` for the
  entrance.

**Worth pairing with a second change.** A floating menu treats the symptom;
the page is still seventeen sections. The section count should be reviewed
separately, and item 1's Origin/Board consolidation and item 4's
Sponsor/Change Maker merge would each remove one. That is a shorter page *and*
a shorter tab bar.

---

### 7 — Live statistics block still looks weak

- **Source:** Client — *"this section can and should look better"*
- **Area:** Live statistics
- **Status:** `fixed`

**Problem.** Round 2 item 2 added the cheque photograph to this block, but the
figures themselves were never redesigned, and they are the problem. Looking at
it now:

- **The four figures use four unrelated colours** — red, orange, green, blue.
  Green in particular is not a brand colour at all; it appears nowhere else on
  the site. The row reads as a chart legend rather than a designed statement.
- **Nothing establishes hierarchy.** "7 Local Government Areas" and "10,000+
  Student Competitors" are set at identical weight, but 10,000+ is by far the
  most impressive number we have and should dominate.
- **A 2×2 grid on desktop wastes the width** and leaves a large empty gap
  between the two columns. The figures float in space with no structure
  holding them.
- **The financial row is a different design entirely** — navy, smaller,
  rule-separated into three columns. Two rows in one section that share no
  visual language.
- **"1 Champion" is the weakest cell.** A large numeral 1 carries almost no
  visual weight and reads as an error or a placeholder.

**Solution.** Rebuild the whole block as one coherent statement rather than two
mismatched rows.

- **Discipline the colour.** Drop green entirely. Use navy as the base for the
  figures with a *single* accent colour carrying the hero statistic. This also
  starts to answer B6 — if the client dislikes gold, red is the alternative
  accent and this is a good place to test that.
- **Give 10,000+ the lead.** Promote it to a large feature figure occupying its
  own column or spanning the top, with the remaining figures set smaller
  beneath it. One number should dominate; the rest support.
- **Put the numbers on a structure.** Rule-separated cells with consistent
  gutters, so the block reads as a designed table rather than four floating
  items. This matches the numbered-list idiom already used in the Seven Subject
  Areas card and the stage list.
- **Unify the two rows.** The financial figures should share the type
  treatment of the headline figures, differing only in scale, so the section
  reads as one block.
- **Reconsider "1 Champion".** Either set it as words rather than a numeral, or
  fold it into the closing line of the section. A lone "1" is not a statistic.
- Keep the cheque photograph and keep the count-up animation, both of which
  are working.

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
| B7 | Vector logo files (.ai/.svg) | Only raster PNGs supplied. Blocks proper logo animation and is needed for print. |
| B8 | RD deck illustrations | Eight figure illustrations needed as SVG/PNG export from the deck's source file. |
| B9 | Purpose-shot b-roll | Nice-to-have. No longer blocking anything now that the hero is stills rather than video (item 5). |
| ~~B10~~ | ~~Scholars in Diaspora names and roles~~ | **Resolved.** The client's "Faces Behind the Vision" cards carry 22 named portraits with institutions; all are now on the page. Spellings are transcribed from that artwork and should be checked by the committee. |
| B11 | Sponsor vs Change Maker | Item 4 — merge into one section, or keep corporate sponsorship addressed separately? |

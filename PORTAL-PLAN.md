# Portal Redesign Plan — Multi-Role Portal (Admin / School / Student)

**Project:** Senator Asuquo Ekpenyong Quiz Competition — Cross River State
**Date:** 2026-07-05
**Status:** Approved direction, ready to build in phases.

---

## 0. Two facts confirmed by research (fold these in first)

1. **Senatorial district = Cross River SOUTH, not North.**
   Sen. Asuquo Ekpenyong represents **Cross River South** (7 LGAs: Akamkpa, Bakassi,
   Calabar Municipal, Calabar South, Akpabuyo, Odukpani, Biase). He is the youngest
   senator in the 10th Senate and a former CR State Commissioner for Finance.
   → Everywhere his title appears, use **"Senator, Cross River South"**.
   → Good bio line for the "Message from Senator" block.

2. **Real portals use ONE login → role-based dashboards (RBAC), not 3 separate sites.**
   This confirms the direction you landed on in your rant. We do NOT build three URLs.
   We build one portal that renders a different dashboard + sidebar depending on role.

---

## 1. The architecture (what we're building)

```
PUBLIC WEBSITE (no login)            THE PORTAL (login → role-aware)
─────────────────────────            ──────────────────────────────
/            Home / hero             /login      role picker (demo)
/results     public results          /dashboard  role-aware dashboard
/leaderboard public rankings         /...         role-gated pages
/schools     public directory
/prizes      prizes
```

- **Public pages need NO login.** Anyone can check results, rankings, schools, prizes.
  (Matches your point: "they don't need to log in to access all of that.")
- **The portal is one app.** After login you land on `/dashboard`, and *what you see*
  depends on your role. Same shell (sidebar + topbar), different content + nav items.

### The three roles

| Role        | Who        | Dashboard focus                                              |
|-------------|------------|-------------------------------------------------------------|
| **Student** | a candidate| My quiz, my scores, my rank, my achievements *(already built)* |
| **School**  | a school   | Our students, our ranking, register candidates, our analytics |
| **Admin**   | organizers | Everything: all schools, all candidates, set quizzes, publish results, state analytics |

### How role switching works in the demo (your choice: **in-portal switcher**)
- A control in the **topbar** flips the current role live: **Admin ⇄ School ⇄ Student**.
- No real auth/backend. It just sets a role in React context and the UI re-renders.
- Lets you show a stakeholder all three dashboards back-to-back in 5 seconds.
- (A `/login` role-picker page can come later; the switcher is the priority.)

---

## 2. What each role's dashboard contains

### Student (DONE — keep as-is)
Hero + live-quiz CTA · my 4 stats · score-progress chart · recent quizzes · achievements · how-I-compare.

### School (build all 4 — your choice)
1. **Our students** — roster of this school's candidates w/ score + rank.
2. **Our ranking vs others** — where the school sits on the state board + weekly trend.
3. **Register candidates** — mock enrol form/flow.
4. **Our performance analytics** — avg score, participation rate, top subjects (charts).

### Admin (the "wow" dashboard for stakeholders)
- State-wide KPIs (total candidates, schools, LGAs, this week's participation).
- All-schools leaderboard + all-candidates results.
- "Set this week's quiz" + "Publish results" mock actions.
- State analytics charts (score distribution, per-LGA performance, weekly trend).

---

## 3. Sidebar per role (nav is role-gated)

| Nav item        | Student | School | Admin |
|-----------------|:-------:|:------:|:-----:|
| Dashboard       |   ✓     |   ✓    |   ✓   |
| Weekly Quiz     |   ✓     |        |       |
| Exam Portal     |   ✓     |        |       |
| My Results      |   ✓     |        |       |
| Our Students    |         |   ✓    |       |
| Register        |         |   ✓    |       |
| School Analytics|         |   ✓    |       |
| All Schools     |         |        |   ✓   |
| All Candidates  |         |        |   ✓   |
| Manage Quizzes  |         |        |   ✓   |
| Publish Results |         |        |   ✓   |
| State Analytics |         |        |   ✓   |
| Leaderboard     |   ✓     |   ✓    |   ✓   |
| Profile         |   ✓     |   ✓    |   ✓   |

---

## 4. ICONS — real assets, not generic glyphs (standing rule)

You dislike generic lucide/"map" icons. Rule going forward:
- **Decorative / feature / hero / card icons → real image assets** (crests, medals,
  trophies, portraits, illustrations) like the prize cards already use.
- **Lucide only for tiny functional UI glyphs** (sidebar nav, chevrons, bell, menu)
  where a raster image would look wrong.
- When an asset is missing, source a real image online and drop it in `/public/assets/…`
  before shipping the section — don't fall back to a generic glyph.

---

## 5. Build phases (we do these together, one at a time)

- **Phase 1 — Foundation:** `RoleContext` + topbar role switcher; make `Sidebar` role-aware;
  make `Topbar` show role-appropriate name/avatar. (No visual change to student yet.)
- **Phase 2 — Admin dashboard:** the stakeholder "wow" view.
- **Phase 3 — School dashboard:** roster + ranking + register + analytics.
- **Phase 4 — Public polish:** fix "Cross River South" everywhere; wire public pages
  to need no login; swap remaining generic icons for real assets.
- **Phase 5 — (optional) `/login` role-picker page.**

Mock data for all of this lives in `lib/mockData.ts` (extend it; no backend).

---

---

## 7. SITE-WIDE ASSESSMENT (read every page — 2026-07-05)

Went through all 10 pages. Verdict: the bones are genuinely good — this already
reads like a real product, not a template. The problems are **consistency tells**
that a sharp evaluator would catch, plus a half-finished rebrand. Fixing these is
what takes it from "nice demo" to "looks like a shipping product."

### A. Pages that are already strong (leave mostly alone)
- **Leaderboard** — tabs (Schools/Students/LGAs/Subjects), search, real tables + medals. Solid.
- **Results** — subject breakdown, donut, score trend, AND a certificate modal.
  The certificate is a real *wow* moment for a pitch. Keep and polish.
- **Schools** directory — filters, sort, pagination, crests. Good.
- **Weekly Quiz** — countdown hero + weekly leaderboard. Strong.
- **Exam Portal** — exam list, instructions, confirm-to-start modal. Good.

### B. Consistency problems to fix site-wide (THE priority)
1. **Emoji icons everywhere = the #1 "cheap" tell.**
   🎓🏫📍🏆📊 appear in: home ticker, home hero stat cards, home floating cards,
   Schools stat cards, Exam Portal recent-performance (🏆/📋), weekly-quiz footer.
   Emojis render differently per OS and instantly read as unprofessional — worse
   than the generic icons you already dislike. **Replace with real assets** (we have
   medals, trophies, subject icons, crests) or clean lucide glyphs where an image
   won't fit. This one change lifts the whole site.
2. **Rebrand is half-done — "State Quiz" leftovers still visible:**
   - Home footer copyright: "© 2025 State Quiz Competition Portal".
   - Home contact email: `info@statequiz.gov.ng`.
   - Results certificate footer: "State Quiz Competition Portal".
   → Sweep all of these to the Senator Asuquo Ekpenyong branding.
3. **"Cross River South" fix** — home senator subtitle currently "Senator, Cross
   River State"; should be "Senator, Cross River South". (State-level cert saying
   "CROSS RIVER STATE" is fine — that's the competition's scope, not his title.)
4. **Season/date polish** — hero badge "2025 Season", copyright "© 2025". Align to
   the pitch's intended year.

### C. The role/portal insight (changes the plan — good news)
**The Profile page ALREADY has a Candidate / School / Teacher tab-switcher.**
It's the role concept done in miniature, but trapped inside one page — it doesn't
drive the sidebar or the dashboard. Two implications:
- We're not starting from zero on roles; there's a working pattern + mock data
  (`schoolProfile`, `teacherProfile`) to lift up to the portal level.
- **Naming conflict to resolve:** Profile calls the 3rd role **"Teacher"**; our plan
  calls it **"School"**. Pick one vocabulary and use it everywhere (see Q5).

### D. Two tiny cleanups
- Stale `public/assets/prizes/prize_sheet_crop_into_4.png` — delete.
- Home nav + portal sidebar list slightly different sets of links — align once roles land.

---

## 8. REVISED phase order (assessment folded in)

- **Phase 0 — Consistency sweep (NEW, do first, low-risk, huge polish ROI):**
  kill all emoji icons → real assets; finish the rebrand sweep; "Cross River South";
  season/date fix; delete stale prize sheet. No new architecture — pure polish.
- **Phase 1 — Foundation:** `RoleContext` + topbar role switcher; role-aware Sidebar
  & Topbar. Lift the Profile switcher's pattern up to portal level.
- **Phase 2 — Admin dashboard** (the stakeholder "wow").
- **Phase 3 — School dashboard** (roster + ranking + register + analytics; reuse
  `schoolProfile` mock).
- **Phase 4 — Wire public vs. portal** (public pages need no login) + final polish.
- **Phase 5 — (optional) `/login` role-picker page.**

Doing **Phase 0 first** means every screenshot you take from here on already looks
more professional, regardless of when the role work lands.

---

---

## 10. DEEP-DIVE AUDIT — every page, copy, UX, data, design (2026-07-05)

Read all 10 pages + globals.css + the full mockData.ts. This is the exhaustive pass.
Grouped by severity. **P0 = a sharp evaluator will notice & it undercuts credibility.
P1 = clearly unprofessional. P2 = polish. P3 = nice-to-have.**

### 🔴 P0 — Real bugs / credibility killers

1. **Exam-take "Wrong" count math is broken.** [take/page.tsx:186]
   `Wrong = questions.length - correct - (questions.length - answered)` simplifies to
   `answered - correct` — OK *only* if every wrong answer was answered. But it's written
   confusingly and will read wrong under inspection. Worse: **8 questions but the UI/copy
   says "40 questions", "120 questions", "3 hours", "90 min timer"** — the take-flow always
   loads the same 8 `quizQuestions` regardless of which exam launched it. A demo-er who
   clicks "State Qualifying Examination (120 questions, 3 hours)" and lands on an 8-question,
   90-minute test will get caught. **Fix:** make counts consistent (either generate to the
   stated number, or set every exam's stated count to 8 / 15 min for the demo).

2. **The timer is 90 min hardcoded** [take/page.tsx:14] regardless of the exam's stated
   duration ("3 hours", "2 hours"). Same credibility issue as #1.

3. **Data contradiction: candidate percentage.** `candidateResult.percentage = 94.4`
   (472/500) but `topStudents[0]` (same person, Ekpenyong Akpan) `score = 94.5`. And the
   dashboard hard-codes "Average Score 94.4%" while ALSO showing a scoreTrend ending at 94.
   Small, but two numbers for the same star student is exactly what a careful reviewer spots.

4. **"State Quiz Portal" branding still live in 3+ places** (rebrand incomplete):
   - Exam-take topbar: `"State Quiz Portal"` [take/page.tsx:228]
   - Home footer copyright: `"© 2025 State Quiz Competition Portal"`
   - Results certificate footer: `"State Quiz Competition Portal"`
   - Contact email: `info@statequiz.gov.ng`
   Logo asset is still `logo_state_quiz.png` (fine as a file, but the visible text isn't).

5. **Senator title wrong: "Cross River State" → "Cross River South."** [page.tsx:321]
   Confirmed by research. He represents CR **South**. A Cross River stakeholder will know
   instantly.

### 🟠 P1 — Unprofessional tells

6. **Emoji icons everywhere = #1 cheap tell.** 🎓🏫📍🏆📊⚡✦ in: home ticker (6),
   home hero stat cards (3), home floating badges (2), Schools stat cards (4), Exam Portal
   recent-perf (🏆/📋), weekly-quiz footer (🏆), results comparison (🏆), dashboard compare
   (🎯). Emojis render per-OS and scream "template." Replace with real assets (we have
   medals/trophy/subject/crest PNGs) or clean lucide. **Single highest-ROI visual fix.**

7. **Role-switchers that don't belong on their pages, in TWO places:**
   - Profile page: Candidate / School / **Teacher** tabs.
   - Results page: Candidate / School / LGA / Subject *search* tabs (this one's fine — it's
     search scope, not identity). But Profile's is an identity switch buried in a page.
   These belong at the portal level (the whole point of §1–8). Also **naming clash: Profile
   says "Teacher", plan says "School".**

8. **Everything is "2025" but pitch context is 2026.** `season: "2025 Season 1"`, dates
   "July 2025", "© 2025", candidateId `CRS/2025/00142`, upcoming quizzes "July 12, 2025"
   (in the past relative to the July-2026 demo). Bulk date bump needed.

9. **The public site reuses `DashboardShell` (sidebar+topbar) for Results / Leaderboard /
   Schools / Weekly-Quiz / Exam-Portal.** So a logged-out visitor sees an admin sidebar with
   "James Bassey, Administrator" and a notification bell with "3". That conflates public
   pages with the logged-in portal — the exact thing §1 says to separate. Public pages should
   use a *public* chrome (the home header/footer), not the portal shell.

10. **"AI marking" is heavily leaned on** (illustration, progress steps, "AI Marked" badges
    everywhere). For 8 multiple-choice questions with a known answer key, "AI marking" is
    marketing fluff a technical evaluator may side-eye. Keep the nice UX, soften the claim
    ("Auto-graded · Instant results") unless you want to defend "AI".

### 🟡 P2 — Copy & consistency polish

11. **School name mismatch:** home `schoolsLeaderboard` says "Govt. Secondary School,
    Calabar" and "Ayade Model Secondary School" with LGA **"Ayade"** — but there is no
    Ayade LGA in Cross River (it's a person/typo; real ones are in `allLGAs`). mockData's
    `schools[2]` also uses lga "Ayade". Should be a real LGA (e.g. Obudu/Bekwarra area).
12. **Two separate hardcoded leaderboards.** Home page has its *own* `schoolsLeaderboard`
    & `onlineLeaderboard` arrays that don't match `lib/mockData.ts` (different scores,
    "1,250 points" vs "94.5%"). One source of truth would prevent drift.
13. **Copy tone drifts:** "🎯 You're scoring X points above the state average" and
    "Excellence is not by chance, it is by choice!" (sidebar) are fine but informal next to
    the formal senator copy. Pick one voice.
14. **"Read Full Message" button on home senator card does nothing** (no href/handler).
    Either wire a modal or drop it.
15. **`allLGAs` has 18 entries incl. "Ugep" and "Oban"** which are towns, not LGAs, and
    lists both "Obudu" and "Obudu"-adjacent — LGA list should match Cross River's real 18
    LGAs for a state pitch. (Currently a mix of real LGAs + towns.)
16. **Results "Wrong" / percentile copy:** "Top {100 - percentile + 1}%" math yields "Top 2%"
    for percentile 99 — correct, but double-check the +1 across all rows.
17. **Certificate says "Download PDF" but does nothing.** Fine for demo, but if they click
    it in front of stakeholders it's a dead button. Consider a real print-to-PDF or hide it.

### 🟢 P3 — Nice-to-have / craft

18. Loading/empty states: search with no results shows an empty table with no "No results"
    message (Leaderboard/Schools).
19. Mobile: several 12-col grids on home leaderboard don't gracefully collapse; worth a pass.
20. Accessibility: emoji-as-icon has no aria; color-only trend indicators (up/down) lack text.
21. `next/image` on remote-less local assets is fine, but many decorative circles use inline
    opacity — consistent, just noting.
22. The `recentActivity`, `scoreDistribution`, `dashboardStats` mock exports are UNUSED now
    that the dashboard was rewritten — they're ready-made fuel for the **Admin dashboard**
    (Phase 2). Good news, not a problem.

### What's genuinely good (don't touch)
- Exam-take flow UX (navigator, flag, timer color states, AI-marking theatre) — minus the
  count/timer bugs, this is the best-crafted screen. Reviewers love an interactive demo.
- School detail page (hero banner, season history line chart, medal tally) — strong.
- Certificate modal — a real wow moment.
- Design tokens in globals.css are clean and consistent. Good foundation.

### Revised priority for Phase 0 (the polish sweep), in order:
P0 bugs (#1–5) → emoji purge (#6) → date bump (#8) → public/portal chrome split (#9) →
copy fixes (#11–14,17) → single source of truth for leaderboards (#12).

---

---

## 11b. DECISIONS LOCKED (2026-07-06)

- **Demo year → "2025/2026 Season"** (academic session framing). Bump past-dated
  "upcoming" items to real upcoming dates within the session; © 2025/2026.
- **Exam flow → match copy to reality.** Set each exam's stated question count &
  duration to what actually runs (8 questions, short timer). Honest & demo-safe.
- **3rd role → "School"** (school coordinator managing the whole school's candidates).
  Fold the Profile "Teacher" view into the School role. Vocabulary = School everywhere.
- **Start point → my call → Phase 0 polish sweep first**, then Phase 1 role portal.

---

## 11. Open questions still worth your call (answer when ready)

1. **Default role on load** — portal opens as Admin (impressive first impression) or
   Student (who we've built for)?
2. **Naming** — keep `/dashboard`, or rename the logged-in area to `/portal`?
3. **Admin identity** — topbar shows "James Bassey, Administrator". Keep or change?
4. **Real names?** — any actual school/candidate names to feature vs. current mocks?
5. **3rd role = "School" or "Teacher"?** — Profile page says Teacher; plan says School.
   A *School* coordinator (manages the whole school's candidates) is the more
   impressive, higher-value role for a state contract. Recommend **School**, and
   fold "teacher" view into it. Your call.
6. **Do Phase 0 (polish sweep) now?** — I can start it immediately; it's low-risk and
   makes everything look better right away.

/**
 * SAEAC homepage content — single source of truth for all 5 Phase 0 variants.
 * Every fact here traces to `SAEAC WEBSITE CONTENT GUIDE.docx` or `SAEAC RD.pdf`.
 *
 * PLACEHOLDER dates are marked. They must be replaced once the Organising
 * Committee confirms the timetable.
 */

export const brand = {
  name: "Senator Asuquo Ekpenyong Academic Championship",
  short: "SAEAC",
  edition: "2026 — Maiden Edition",
  tagline: "Igniting Minds. Inspiring Excellence. Building Leaders.",
  campaignLine: "Who Wins This?",
  domain: "www.saeac.org",
} as const;

export const hero = {
  eyebrow: "Cross River South Senatorial District · Maiden Edition",
  headline: "Who Wins This?",
  subhead:
    "A district-wide academic championship for every public and private secondary school across the seven Local Government Areas of Cross River South — culminating in a televised Grand Finale.",
  primaryCta: { label: "Register Your School", href: "#register" },
  secondaryCta: { label: "Learn More", href: "#overview" },
} as const;

export const overview = {
  title: "The Championship",
  body: "SAEAC is a district-wide academic competition open to public and private secondary schools across the seven Local Government Areas of the Cross River South Senatorial District. It is designed to identify, celebrate, and reward academic excellence among secondary school students, while raising the profile of Cross River State on a national stage.",
  subjects: [
    "Mathematics",
    "English",
    "Sciences",
    "Art",
    "Commercial",
    "Current Affairs & Civic Education",
    "General Knowledge",
  ],
} as const;

/** PLACEHOLDER — replace with the confirmed registration deadline. */
export const countdown = {
  label: "Registration closes in",
  targetIso: "2026-10-30T23:59:59+01:00",
  note: "Provisional date — to be confirmed by the Organising Committee.",
} as const;

export const stats = [
  { value: "117", label: "Secondary Schools", note: "Across the district" },
  { value: "7", label: "Local Government Areas", note: "Cross River South" },
  { value: "7", label: "Competition Stages", note: "Registration to Grand Finale" },
  { value: "585", label: "Students Expected", note: "Five per school at screening" },
] as const;

export const stages = [
  {
    n: 1,
    name: "School Registration",
    summary:
      "Public and private secondary schools across the seven LGAs register via the official website.",
    field: "All eligible schools",
  },
  {
    n: 2,
    name: "School-Level Screening",
    summary:
      "Each school runs three internal examinations (Science, Art, Commercial) on the same day. The top five performers advance.",
    field: "5 students per school",
  },
  {
    n: 3,
    name: "Local Government Qualifiers",
    summary:
      "Schools within each LGA compete for five qualifying slots across three rounds. Akpabuyo and Bakassi jointly contest one shared slot.",
    field: "30 schools · 90 students",
  },
  {
    n: 4,
    name: "Group Stage",
    summary:
      "The five qualifying schools per LGA group compete for three advancing slots at increased difficulty.",
    field: "18 schools · 54 students",
  },
  {
    n: 5,
    name: "Quarterfinals",
    summary:
      "The three qualifying schools per LGA group compete for two advancing slots at further increased difficulty.",
    field: "12 schools · 36 students",
  },
  {
    n: 6,
    name: "Semifinals",
    summary:
      "The top nine advance directly; the bottom three contest a tie-breaker for the tenth Grand Finale place.",
    field: "10 schools · 30 students",
  },
  {
    n: 7,
    name: "Grand Finale",
    summary:
      "Four progressively challenging rounds narrow the field of ten schools to a single overall winner, broadcast live.",
    field: "1 champion school",
  },
] as const;

export const lgas = [
  { name: "Akpabuyo", schools: 7, combined: true },
  { name: "Biase", schools: 22, combined: false },
  { name: "Odukpani", schools: 23, combined: false },
  { name: "Akamkpa", schools: 24, combined: false },
  { name: "Bakassi", schools: 4, combined: true },
  { name: "Calabar Municipality", schools: 22, combined: false },
  { name: "Calabar South", schools: 15, combined: false },
] as const;

export const lgaNote =
  "Owing to the comparatively low number of secondary schools in Akpabuyo and Bakassi, these two LGAs are merged and jointly allocated one slot at the Local Government Qualifiers stage.";

/** Headline prizes only — the full schedule lives on the Prizes page. */
export const prizes = [
  {
    tier: "Champion",
    school:
      "The SAEAC Grand Trophy, a First Place Certificate, and an ICT/CBT Centre established in the winning school's Local Government Area.",
    student:
      "Each finalist receives a laptop. The highest cumulative scorer from Round 1 receives ₦1,000,000 and a gold medal.",
    accent: "gold",
  },
  {
    tier: "1st Runner-Up",
    school: "A Second Place Certificate.",
    student: "₦500,000, a laptop, and a silver medal.",
    accent: "silver",
  },
  {
    tier: "2nd Runner-Up",
    school: "A Third Place Certificate.",
    student: "₦300,000, a laptop, and a bronze medal.",
    accent: "bronze",
  },
] as const;

export const mentorPrize = {
  title: "Mentor Prize",
  body: "A cash prize of ₦1,000,000 and a Best Mentorship Certificate is presented to the Coach of the winning school, in recognition of the critical role mentors play in preparing finalists.",
} as const;

/** The Grand Finale's football metaphor — Strikers, Assists, Coach, VAR. */
export const showdown = {
  title: "The Grand Finale Showdown",
  intro:
    "In the Grand Finale, each team's three on-stage players are called Strikers, its two substitutes are called Assists, and its teacher or mentor is the Coach.",
  mechanics: [
    {
      name: "Strikers",
      body: "Each team fields 3 Strikers on stage for Round 3, answering 15 questions in total — five per Striker, each within a set time limit.",
    },
    {
      name: "Assist",
      body: "If a Striker cannot answer, they may call on one of their Assists seated with the audience. A correct Assist answer earns half a point.",
    },
    {
      name: "Substitution",
      body: "A team's Coach may substitute an Assist in for a Striker at any point during Round 3.",
    },
    {
      name: "VAR",
      body: "Questions neither a Striker nor an Assist can answer are referred to the Video Assistant Referee, who supplies the correct answer for the audience. No points awarded.",
    },
  ],
} as const;

/** PLACEHOLDER announcements — replace with the live news feed in Phase 2. */
export const news = [
  {
    category: "Announcement",
    date: "2026-07-28",
    title: "School registration opens across all seven LGAs",
    excerpt:
      "Public and private secondary schools in Cross River South can now register for the maiden edition of the championship.",
  },
  {
    category: "Announcement",
    date: "2026-07-21",
    title: "Rules and Regulations document published",
    excerpt:
      "The official competition rulebook is now available to download from the Downloads section.",
  },
  {
    category: "Stage Report",
    date: "2026-07-14",
    title: "Organising Committee confirms seven subject areas",
    excerpt:
      "Questions will be drawn from Mathematics, English, Sciences, Art, Commercial, Current Affairs and Civic Education, and General Knowledge.",
  },
] as const;

export const faq = [
  {
    q: "Which schools are eligible to enter?",
    a: "Every public and private secondary school located in the seven Local Government Areas of the Cross River South Senatorial District is eligible. There is no entry fee.",
  },
  {
    q: "How many students does a school send?",
    a: "Five per school. Three Strikers answer on stage, supported by two Assists on the bench, with a teacher or mentor acting as Coach.",
  },
  {
    q: "What subjects are covered?",
    a: "Mathematics, English, Sciences, Art, Commercial, Current Affairs and Civic Education, and General Knowledge.",
  },
  {
    q: "How are the five representatives chosen?",
    a: "Each school runs three internal examinations — Science, Art and Commercial — on the same day. The five highest performers represent the school at the Local Government Qualifiers.",
  },
  {
    q: "What do Akpabuyo and Bakassi schools do?",
    a: "Akpabuyo and Bakassi compete as one bloc and jointly contest a single qualifying slot, reflecting the shared communities across both LGAs.",
  },
] as const;

export const sponsors = [
  "Diaspora Educational Trust Fund",
  "Scholars in Diaspora",
  "Cross River State Ministry of Education",
  "Sponsor Placeholder",
  "Sponsor Placeholder",
] as const;

export const contact = {
  email: "Senatorasuquoekpenyongacc@gmail.com",
  phone: "08130642344",
  socials: [
    { name: "X", href: "#" },
    { name: "Instagram", href: "#" },
    { name: "Facebook", href: "#" },
    { name: "YouTube", href: "#" },
    { name: "TikTok", href: "#" },
  ],
} as const;

export const nav = [
  { label: "About", href: "#overview" },
  { label: "Competition", href: "#stages" },
  { label: "LGAs", href: "#lgas" },
  { label: "Prizes", href: "#prizes" },
  { label: "News", href: "#news" },
] as const;

export const footerLinks = [
  "About SAEAC",
  "Competition Structure",
  "Downloads",
  "FAQs",
  "Contact",
  "Sponsors & Partners",
] as const;

export const portalLinks = [
  "School Login",
  "Volunteer Login",
  "Judge Login",
  "Admin Login",
] as const;

/** Variant registry — powers the comparison index and the variant switcher. */
export const variants = [
  {
    id: "a",
    name: "Bold Editorial",
    reference: "Caladan",
    blurb:
      "Light and image-led. A full-bleed photographic hero under a floating glass nav, then bento grids and two-tone headlines on soft off-white. Confident but warm.",
    accent: "#ffe169",
  },
  {
    id: "b",
    name: "Minimal Institutional",
    reference: "Origin Studio",
    blurb:
      "Near-black and centred, with oversized light-weight type and a thumbnail strip. Restrained and gallery-like — the most prestigious of the five.",
    accent: "#ffffff",
  },
  {
    id: "c",
    name: "Editorial Contrast",
    reference: "People Work",
    blurb:
      "Warm cream ground and an editorial serif with italic emphasis, alternating against deep forest-green panels. A storytelling scroll that leads with students.",
    accent: "#d8f651",
  },
  {
    id: "d",
    name: "Warm Community",
    reference: "Safeer",
    blurb:
      "A fanned row of tilted photo cards over the hero, parenthesised labels, and card-and-image mosaics. The most approachable — aimed at parents, teachers and schools.",
    accent: "#f4a300",
  },
  {
    id: "e",
    name: "Data-Forward",
    reference: "Setrex SaaS",
    blurb:
      "Black product canvas with a single lime accent, a live scoreboard preview and a funnel that narrows stage by stage. Feels like a real competition platform.",
    accent: "#c6f24e",
  },
] as const;

export type VariantId = (typeof variants)[number]["id"];

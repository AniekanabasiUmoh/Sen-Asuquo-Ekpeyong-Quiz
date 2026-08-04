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
  campaignLine: "Who will be the Standard?",
  domain: "www.saeac.org",
} as const;

export const hero = {
  eyebrow: "Cross River South Senatorial District · Maiden Edition",
  headline: "Who will be the Standard?",
  /** Split for the two-tone hero treatment. */
  headlineLead: "Who will be",
  headlineTrail: "the Standard?",
  /** Short hero line — the full description sits in the About block below. */
  tagline:
    "Secondary schools from all seven Local Government Areas of Cross River South, competing for one title.",
  /** Client-supplied description — use verbatim. */
  subhead:
    "A district-wide educational initiative bringing together secondary schools across the seven Local Government Areas of Cross River South Senatorial District in an annual tournament designed to celebrate excellence, develop future leaders and transform academic competition into a prestigious public event.",
  primaryCta: { label: "Register Now", href: "#register" },
  secondaryCta: { label: "Become a Partner", href: "#sponsor" },
  tertiaryCta: { label: "Watch Promo", href: "#patron" },
} as const;

/** Client-supplied About block. */
export const about = {
  eyebrow: "About SAEAC",
  title: "Building the Future Through",
  titleTrail: "Academic Excellence",
  body: "SAEAC is more than an academic competition. It is a platform for discovering talent, rewarding excellence and investing in the future of education. Structured like a championship tournament, the competition provides every participating school with an opportunity to compete for recognition, scholarships, educational infrastructure and lasting legacy projects.",
  cta: { label: "Read More", href: "#origin" },
} as const;

/**
 * The Principals' engagement at Axari Hotel, Calabar — 16 July 2026.
 * Real, documented SAEAC activity: 24 principals across six of the seven LGAs.
 * Source: SAEAC Meeting Report (Academic Central Planning Committee).
 */
export const principalsMeeting = {
  eyebrow: "Latest from Schools",
  title: "Principals Across the District",
  titleTrail: "Back the Championship",
  date: "16 July 2026",
  venue: "Axari Hotel, Calabar",
  body: "The SAEAC Academic Central Planning Committee convened a Strategic Stakeholders' Meeting with principals of secondary schools from across Cross River South, to present the Championship Framework and Operational Guidelines and secure their cooperation ahead of roll-out.",
  facts: [
    { value: "24", label: "Principals attended" },
    { value: "6 of 7", label: "LGAs represented" },
    { value: "5", label: "Recommendations raised" },
  ],
  images: [
    { src: "/img/meeting-group.jpg", alt: "Principals and the SAEAC Planning Committee at Axari Hotel, Calabar" },
    { src: "/img/meeting-question.jpg", alt: "A principal raising a question during the engagement" },
    { src: "/img/meeting-materials.jpg", alt: "SAEAC participant folders and lanyards" },
    { src: "/img/meeting-audience.jpg", alt: "Principals seated during the presentation" },
  ],
} as const;

/**
 * Scholars in Diaspora — the championship's board of directors.
 * Figures from the Scholars in Diaspora report (SD SAES).
 */
export const board = {
  eyebrow: "Board of Directors",
  name: "Scholars in Diaspora",
  strapline: "From Beneficiaries to Changemakers: Building a Legacy of Educational Impact",
  vision:
    "To build a network of scholars committed to promoting educational excellence and social development across Cross River South and beyond.",
  mission:
    "To leverage collective resources and partnerships to provide educational support, mentorship, and opportunities for vulnerable children and deserving students.",
  facts: [
    { value: "₦22.1M", label: "Funds mobilised" },
    { value: "₦25M", label: "Seed donation secured" },
    { value: "60+", label: "Scholars supported" },
  ],
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

/**
 * Headline statistics, as supplied by the client (LIVE STATISTICS list).
 *
 * NOTE FOR THE COMMITTEE: these figures supersede the earlier 117-school /
 * 585-student counts that were drawn from the Competition Structure document
 * and the Principals' Meeting Report. The two sets do not agree — the report's
 * updated per-LGA counts total 117 public schools. The figures below are the
 * ones the client has approved for publication and are understood to include
 * private schools and projected participation.
 *
 * `count` drives the count-up animation; `display` is the rendered string.
 */
export const stats = [
  { count: 7, display: "7", label: "Local Government Areas", note: "Cross River South" },
  { count: 250, suffix: "+", display: "250+", label: "Secondary Schools", note: "Across the district" },
  { count: 10000, suffix: "+", display: "10,000+", label: "Student Competitors", note: "Expected to take part" },
  { count: 1, display: "1", label: "Champion", note: "One school takes the title" },
] as const;

/** Secondary figures shown as a supporting row. */
export const statsFinancial = [
  { display: "₦25M", label: "Seed Fund", note: "Diaspora Educational Trust Fund" },
  { display: "₦200M", label: "Project Value", note: "Total championship investment" },
  { display: "Annual", label: "Championship", note: "Returning every year" },
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
  { name: "Akpabuyo", schools: 7, combined: true, img: "/img/lga-akpabuyo.jpg" },
  { name: "Biase", schools: 22, combined: false, img: "/img/lga-biase.jpg" },
  { name: "Odukpani", schools: 23, combined: false, img: "/img/lga-odukpani.jpg" },
  { name: "Akamkpa", schools: 24, combined: false, img: "/img/lga-akamkpa.jpg" },
  { name: "Bakassi", schools: 4, combined: true, img: "/img/lga-bakassi.jpg" },
  {
    name: "Calabar Municipality",
    schools: 22,
    combined: false,
    img: "/img/lga-calabar-municipality.jpg",
  },
  {
    name: "Calabar South",
    schools: 15,
    combined: false,
    img: "/img/lga-calabar-south.jpg",
  },
] as const;


/**
 * The Background section from the Content Guide (§2.1 / §4.2), condensed for
 * the homepage. The full text belongs on the About SAEAC page; this band is a
 * summary that links through. Photography is from the nomination-form
 * handover at the Senator's office — the moment the Trust Fund, and with it
 * the Championship, was announced.
 */
export const origin = {
  eyebrow: "Our Origin",
  title: "How the Championship",
  titleTrail: "Began",
  body: "Scholars in Diaspora is a network of beneficiaries of the educational initiatives facilitated by Senator Asuquo Ekpenyong. Over the past three years, his interventions have enabled more than sixty scholars to study in the United Kingdom and beyond — many now qualified as doctors, lawyers, and other professionals.",
  body2:
    "In gratitude, those beneficiaries mobilised funds towards the Senator's nomination form and presented it at his office. There he announced a seed donation towards the Diaspora Educational Trust Fund, and encouraged them to institutionalise their efforts into a sustainable platform for vulnerable students. SAEAC is the flagship expression of that commitment.",
  pullQuote: "A society which invests in education creates generations of leaders who, in turn, invest in others.",
  images: [
    { src: "/img/origin-cheque.jpg", alt: "The Scholars in Diaspora presentation at the Senator's office" },
    { src: "/img/origin-team.jpg", alt: "Scholars in Diaspora with Senator Asuquo Ekpenyong" },
    { src: "/img/origin-forms.jpg", alt: "The 2026 nomination and expression of interest forms presented to the Senator" },
  ],
  cta: { label: "Read the full story", href: "#origin" },
} as const;

/**
 * Message from the Senator.
 *
 * PLACEHOLDER QUOTE. The Content Guide (§4.2) is explicit: this message must be
 * commissioned from the Senator's office and carry his own words — it is not to
 * be drafted speculatively. The line below is drawn from the Guide's own
 * Background narrative purely to hold the layout, and MUST be replaced before
 * launch.
 */
export const senator = {
  eyebrow: "Message from the Grand Patron",
  name: "Senator Asuquo Ekpenyong",
  role: "Grand Patron · Cross River South Senatorial District",
  quote:
    "Before accepting the scholars' sacrifice, it was only right that I give back — and that we build something able to support many more students than any one of us could reach alone.",
  quoteIsPlaceholder: true,
  portrait: "/img/senator-avatar.jpg",
  video: {
    youTubeId: "9Hyxx0w4e_w",
    title: "Senator Asuquo Ekpenyong on the Academic Championship",
    poster: "/img/senator-video-poster.jpg",
  },
} as const;

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

/**
 * "What the Champions Win" — the client's summary framing, grouped by who
 * benefits rather than by placing. Shown on the homepage; the exact prize
 * schedule from the Content Guide (§4.15) remains on the Prizes page.
 */
export const championsWin = [
  {
    group: "Champion School",
    img: "/img/win-school.jpg",
    alt: "A full classroom of secondary school students",
    items: [
      "ICT/CBT Centre",
      "Championship Trophy",
      "Smart Classroom Support",
      "Champion Recognition",
    ],
  },
  {
    group: "Champion Students",
    img: "/img/win-students.jpg",
    alt: "Two students working together in class",
    items: ["Cash Awards", "Laptops", "Scholarships", "Mentorship Opportunities"],
  },
  {
    group: "Teachers",
    img: "/img/win-teachers.jpg",
    alt: "A teacher leading a lesson with students",
    items: ["Excellence Awards", "Cash Recognition", "Certificates"],
  },
] as const;

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

/**
 * News feed. Every item here must describe something that has actually
 * happened — no forward-dated or speculative announcements. The three below
 * are drawn from the Principals' Meeting Report (16 July 2026) and the
 * Scholars in Diaspora report. Replace with a live feed in Phase 2.
 */
export const news = [
  {
    category: "Stakeholder Engagement",
    date: "2026-07-16",
    title: "Principals across six LGAs engaged at Axari Hotel, Calabar",
    excerpt:
      "Twenty-four principals received the Championship Framework and Operational Guidelines, and raised five recommendations for the Planning Committee.",
    img: "/img/meeting-group.jpg",
  },
  {
    category: "Committee",
    date: "2026-07-16",
    title: "Principals update public secondary school figures",
    excerpt:
      "Attending principals provided revised school counts for their LGAs, superseding the provisional figures circulated in the Competition Structure document.",
    img: "/img/meeting-audience.jpg",
  },
  {
    category: "Trust Fund",
    date: "2026-04-29",
    title: "₦25 million seed donation establishes the Trust Fund",
    excerpt:
      "At the official presentation in his office, the Grand Patron announced a seed donation towards the Diaspora Educational Trust Fund.",
    img: "/img/origin-cheque.jpg",
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

/**
 * Navigation, grouped per Content Guide §3.1 so the ten client-specified
 * destinations fit one row. Children marked `soon` are Phase 1–3 pages that
 * do not exist yet; they resolve to the nearest homepage anchor for now.
 */
export const nav = [
  { label: "Home", href: "#top" },
  { label: "About SAEAC", href: "#about" },
  {
    label: "Competition",
    href: "#overview",
    children: [
      { label: "The Championship", href: "#overview" },
      { label: "Competition Structure", href: "#stages" },
      { label: "Fixtures & Results", href: "#stages", soon: true },
      { label: "Leaderboard", href: "#stages", soon: true },
    ],
  },
  { label: "Schools Registration", href: "#register" },
  { label: "News & Media", href: "#news" },
  { label: "Sponsors & Partners", href: "#sponsor" },
  { label: "Contact Us", href: "#contact" },
] as const;

/** The two primary actions, fixed in the header per the client's brief. */
export const navCtas = {
  primary: { label: "Register Your School", href: "#register" },
  secondary: { label: "Sponsor the Championship", href: "#sponsor" },
} as const;

/** Volunteer programme — the client renamed volunteers to "Change Makers". */
export const changeMaker = {
  eyebrow: "Get Involved",
  title: "Become a",
  titleTrail: "Change Maker",
  body: "Volunteers power the championship on the ground — from LGA qualifiers to the Grand Finale. Join the team behind Cross River South's biggest academic contest.",
  cta: { label: "Volunteer With Us", href: "#changemaker" },
} as const;

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

/**
 * Variant A was chosen as the site's direction, so it lives at the root.
 * The rest stay on their letter routes for comparison.
 */
export const variantHref = (id: VariantId) => (id === "a" ? "/" : `/${id}`);

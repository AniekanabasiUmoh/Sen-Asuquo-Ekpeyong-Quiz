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
  edition: "2026 Maiden Edition",
  tagline: "Igniting Minds. Inspiring Excellence. Building Leaders.",
  campaignLine: "Who will be the Standard?",
  domain: "www.saeac.org",
} as const;

export const hero = {
  eyebrow: "Cross River South Senatorial District · Maiden Edition",
  /* Secondary CTA reads "Become a Change Maker" and points at the volunteer
     section; "Partner" was corporate-sponsor language aimed at the wrong
     audience. Round 3 item 4. */
  headline: "Who will be the Standard?",
  /** Split for the two-tone hero treatment. */
  headlineLead: "Who will be",
  headlineTrail: "the Standard?",
  /** Short hero line. The full description sits in the About block below. */
  tagline:
    "Secondary schools from all seven Local Government Areas of Cross River South, competing for one title.",
  /** Client-supplied description — use verbatim. */
  subhead:
    "A district-wide educational initiative bringing together secondary schools across the seven Local Government Areas of Cross River South Senatorial District in an annual tournament designed to celebrate excellence, develop future leaders and transform academic competition into a prestigious public event.",
  /**
   * The hero cross-fades through these. Round 3 item 5: the client asked to
   * "rotate the picture", and separately for "a video of him speaking" on
   * entry; both described the same thing, a hero that moves rather than a
   * single still.
   *
   * Stills rather than video, because five photographs cost a fraction of a
   * video loop, need no mobile carve-out, and can show students from more
   * than one place. None of these appear elsewhere on the page: a hero that
   * recycles pictures the reader meets again further down looks thin.
   */
  images: [
    { src: "/img/students-hero.jpg", alt: "Secondary school students in uniform", position: "center 30%" },
    { src: "/img/hero-2.jpg", alt: "Students in uniform at a school assembly", position: "center 35%" },
    { src: "/img/hero-3.jpg", alt: "Secondary school students together in class", position: "center 30%" },
    { src: "/img/hero-4.jpg", alt: "Students studying outdoors in the school grounds", position: "center 40%" },
    { src: "/img/hero-5.jpg", alt: "Students outside their school building", position: "center 35%" },
  ],
  primaryCta: { label: "Register Now", href: "#register" },
  secondaryCta: { label: "Become a Change Maker", href: "#changemaker" },
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
  note: "Provisional date, to be confirmed by the Organising Committee.",
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
export const statsHeading = {
  title: "The Championship",
  titleTrail: "in Numbers",
} as const;

/**
 * The lead figure. 10,000+ is the most persuasive number available, so it is
 * set large and on its own rather than being one of four equal cells.
 */
export const statLead = {
  count: 10000,
  suffix: "+",
  display: "10,000+",
  label: "Student Competitors",
  note: "Expected to take part across the district",
} as const;

export const stats = [
  { count: 7, display: "7", label: "Local Government Areas", note: "Cross River South" },
  { count: 250, suffix: "+", display: "250+", label: "Secondary Schools", note: "Public and private" },
] as const;

/**
 * All four figures as a flat set, for the archived Phase 0 variants at /b–/e
 * which each render a four-cell grid. The homepage no longer uses this: it
 * promotes 10,000+ to a lead figure and carries the champion as a closing
 * sentence, so `statLead` + `stats` is its shape.
 */
export const statsAll = [
  stats[0],
  stats[1],
  statLead,
  { count: 1, display: "1", label: "Champion", note: "One school takes the title" },
] as const;

/**
 * Secondary figures. Same type treatment as the row above, differing only in
 * scale, so the section reads as one block rather than two.
 */
export const statsFinancial = [
  { display: "₦25M", label: "Seed Fund", note: "Diaspora Educational Trust Fund" },
  { display: "₦200M", label: "Project Value", note: "Total championship investment" },
  { display: "Annual", label: "Championship", note: "Returning every year" },
] as const;

/**
 * Closing line. This carries what used to be the "1 Champion" cell, which a
 * lone numeral 1 could not: as a statistic it read as a placeholder, but as a
 * sentence it is the point of the whole section.
 */
export const statsClose = {
  lead: "One champion school",
  trail: "takes the title.",
} as const;

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
  body: "Scholars in Diaspora is a network of beneficiaries of the educational initiatives facilitated by Senator Asuquo Ekpenyong. Over the past three years, his interventions have enabled more than sixty scholars to study in the United Kingdom and beyond. Many are now qualified as doctors, lawyers, and other professionals.",
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
 * The Scholars in Diaspora themselves, from the client's "THE FACES BEHIND
 * THE VISION" cards.
 *
 * Round 3 item 1: the Origin copy claims sixty scholars now qualified as
 * doctors, lawyers and other professionals, but the page showed none of them,
 * so the claim sat there unevidenced. These are the twenty-two named on the
 * cards. Names and institutions are transcribed from the client's own
 * artwork, so the spellings are theirs; anything mis-transcribed should be
 * corrected against the source cards rather than guessed at.
 */
export const scholars = [
  { name: "Dr. Grace Obo", detail: "MSc Public Health, University of Bristol", img: "/img/scholars/grace-obo.jpg" },
  { name: "Offiong Andem Bassey", detail: "Media and Public Relations, University of Leicester", img: "/img/scholars/offiong-andem-bassey.jpg" },
  { name: "Alice Oyo-Ita", detail: "MSc Financial Technology, Coventry University", img: "/img/scholars/alice-oyo-ita.jpg" },
  { name: "Dr. Unaowo Akpan Udodung", detail: "Coventry University", img: "/img/scholars/unaowo-akpan-udodung.jpg" },
  { name: "Engr. Abasi Ekpenyong Ndarake", detail: "Construction Project and Cost Management, University of Coventry", img: "/img/scholars/abasi-ekpenyong-ndarake.jpg" },
  { name: "Wisdom Umina Sumuko, Esq.", detail: "LLM International Business and Commercial Law, Anglia Ruskin University", img: "/img/scholars/wisdom-umina-sumuko.jpg" },
  { name: "Prince Otu Ndor-Odok", detail: "MSc Global Healthcare Management", img: "/img/scholars/prince-otu-ndor-odok.jpg" },
  { name: "Dr. Sinebari Nwilegbara", detail: "King's College Hospital, London", img: "/img/scholars/sinebari-nwilegbara.jpg" },
  { name: "Emmanuel Effa Ojong", detail: "MSc Chemical Engineering, Teesside University", img: "/img/scholars/emmanuel-effa-ojong.jpg" },
  { name: "Dr. Victor Eyo", detail: "MPH, University of Wolverhampton", img: "/img/scholars/victor-eyo.jpg" },
  { name: "Akwa Archibong Eyo", detail: "Royal Bolton Hospital, UK", img: "/img/scholars/akwa-archibong-eyo.jpg" },
  { name: "Mr. Edem Essien Edem", detail: "University of South Wales", img: "/img/scholars/edem-essien-edem.jpg" },
  { name: "Dr. Cletus Obun", detail: "Scholars in Diaspora", img: "/img/scholars/cletus-obun.jpg" },
  { name: "Emmanuel David Nsemo", detail: "Sheffield Hallam University", img: "/img/scholars/emmanuel-david-nsemo.jpg" },
  { name: "Dr. Daniel Faithful", detail: "London School of Medicine", img: "/img/scholars/daniel-faithful.jpg" },
  { name: "Solomon Offem Iyam", detail: "BSc (Unical), MSc (London), MRes (Liverpool)", img: "/img/scholars/solomon-offem-iyam.jpg" },
  { name: "Dr. Williams Undebe", detail: "Tropical Health and Infectious Disease, Liverpool School of Tropical Medicine", img: "/img/scholars/williams-undebe.jpg" },
  { name: "Lawrence Eko-Owai", detail: "MSc Data Science, University of Greenwich", img: "/img/scholars/lawrence-eko-owai.jpg" },
  { name: "Dr. Ewa Anthony Obi", detail: "MSc Global Public Health, Coventry University", img: "/img/scholars/ewa-anthony-obi.jpg" },
  { name: "Egbonyi Ntami Egbe", detail: "Oil and Gas Management, Coventry University", img: "/img/scholars/egbonyi-ntami-egbe.jpg" },
  { name: "Fredrick Ozu", detail: "Scholars in Diaspora", img: "/img/scholars/fredrick-ozu.jpg" },
  { name: "Blessing Banyinorim Agbo", detail: "MSc, Baze University", img: "/img/scholars/blessing-banyinorim-agbo.jpg" },
] as const;

export const scholarsIntro = {
  eyebrow: "The Faces Behind the Vision",
  body: "The scholars who mobilised the funds, now practising across the United Kingdom and beyond.",
} as const;

/**
 * Trust Fund outreach in Cross River South. Real district photography from
 * the client's own materials, which is why it is preferred over stock
 * anywhere a Cross River classroom is being depicted (Round 3 item 2).
 */
export const outreach = [
  {
    src: "/img/outreach-books.jpg",
    alt: "Pupils holding donated books in a Cross River SUBEC classroom",
  },
  {
    src: "/img/outreach-classroom.jpg",
    alt: "A full classroom of pupils during a Trust Fund school visit",
  },
  {
    src: "/img/outreach-assembly.jpg",
    alt: "Students raising donated materials at a school assembly under a tree",
  },
] as const;

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
    "Before accepting the scholars' sacrifice, it was only right that I give back, and that we build something able to support many more students than any one of us could reach alone.",
  quoteIsPlaceholder: true,
  portrait: "/img/senator-avatar.jpg",
  video: {
    youTubeId: "9Hyxx0w4e_w",
    title: "Senator Asuquo Ekpenyong on the Academic Championship",
    poster: "/img/senator-video-poster.jpg",
    /**
     * Silent 20s b-roll cut (~750KB, 480p) used as motion behind the play
     * button. Taken from 72–92s of the source film, the only stretch without
     * burnt-in subtitles. Clicking hands off to YouTube for the full 6m24s
     * with audio, so we carry almost no video bandwidth ourselves.
     */
    loop: "/video/patron-loop.mp4",
    loopPoster: "/img/patron-loop-poster.jpg",
  },
} as const;


/**
 * Eligibility, per Content Guide §4.4, verbatim in substance.
 *
 * Note the guide's own school totals do not agree: §4.4 says 88 registered
 * schools "at the time of writing", §4.5's per-LGA table totals 117 public
 * schools, and the client's approved figure is 250+ including private
 * schools. This page therefore states no total at all and points at the LGA
 * pages for counts, which is the only honest option until the registration
 * database settles it.
 *
 * `pending` items are the conditions §4.4 says must be confirmed with the
 * Organising Committee before publication. They are listed as outstanding
 * rather than invented.
 */
export const eligibility = {
  intro:
    "SAEAC is open to secondary schools across the seven Local Government Areas of the Cross River South Senatorial District. There is no entry fee.",
  criteria: [
    {
      title: "Eligible schools",
      body: "All public and private secondary schools located within the seven Local Government Areas of the Cross River South Senatorial District: Akpabuyo, Biase, Odukpani, Akamkpa, Bakassi, Calabar Municipality and Calabar South.",
    },
    {
      title: "Eligible students",
      body: "Students enrolled in the Science, Art or Commercial streams at a registered participating school, selected through the internal School-Level Screening examination.",
    },
    {
      title: "Registration requirement",
      body: "Schools must register via the official SAEAC website within the published registration window.",
    },
    {
      title: "Team composition",
      body: "Each school is represented by its five highest performers at School-Level Screening: three Strikers who answer on stage, two Assists on the bench, and a teacher or mentor acting as Coach.",
    },
  ],
  pending: [
    "Minimum enrolment size, if any",
    "Age restrictions, if any",
    "Documentation requirements, such as proof of enrolment",
  ],
  pendingNote:
    "These conditions are with the Organising Committee for confirmation and will be published here once agreed.",
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
      body: "Each team fields 3 Strikers on stage for Round 3, answering 15 questions in total: five per Striker, each within a set time limit.",
      accent: "outline",
    },
    {
      name: "Assist Option",
      body: "If a Striker cannot answer, they may call on one of their Assists seated with the audience. A correct Assist answer earns half a point (0.5).",
      accent: "blue",
    },
    {
      name: "Substitution",
      body: "A team's Coach may substitute an Assist in for a Striker at any point during Round 3.",
      accent: "plain",
    },
    {
      name: "VAR",
      body: "Video Assistant Referee. Questions neither a Striker nor an Assist can answer are referred to the VAR, who supplies the correct answer for the benefit of students and audience. No points awarded.",
      accent: "gold",
    },
    {
      name: "Scoring",
      body: "Round 3 scores accumulate with a school's Rounds 1 and 2 scores. The bottom 3 schools by accumulated score are eliminated; 3 schools (9 students) advance to Round 4.",
      accent: "red-outline",
    },
    {
      name: "Draw or Tie",
      body: "In the event of a draw or tie, a penalty is held to separate the affected schools. Each school competing in the penalty sends forward one Striker, who poses questions to the other competing teams.",
      accent: "red",
    },
    {
      name: "Scoring Panel",
      body: "Student scores are input by a panel of scorers comprising two individuals nominated by the Board of Trustees and two persons from each competing school.",
      accent: "plain",
    },
    {
      name: "Side Attraction Game",
      body: "A game played alongside the main competition, where members of the audience stand a chance to win prizes.",
      accent: "plain",
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
    a: "Each school runs three internal examinations on the same day: Science, Art and Commercial. The five highest performers represent the school at the Local Government Qualifiers.",
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
] as const;

export const contact = {
  email: "Senatorasuquoekpenyongacc@gmail.com",
  phone: "08130642344",
  /** Official channels, supplied by the PM (Anne Matthew Odey). */
  socials: [
    { name: "Instagram", href: "https://www.instagram.com/saeac_" },
    { name: "X", href: "https://x.com/_saeac" },
    { name: "Facebook", href: "https://www.facebook.com/share/1HkkKcApmR/" },
    {
      name: "YouTube",
      href: "https://www.youtube.com/@SenatorAsuquoEkpenyongAcademic",
    },
    { name: "TikTok", href: "https://vt.tiktok.com/ZSCK4TePt/" },
    { name: "Threads", href: "https://www.threads.com/@saeac_" },
  ],
} as const;

/**
 * Navigation, grouped per Content Guide §3.1 so the ten client-specified
 * destinations fit one row. Children marked `soon` are Phase 1–3 pages that
 * do not exist yet; they resolve to the nearest homepage anchor for now.
 */
/**
 * Primary header navigation, per Content Guide §3.1.
 *
 * These are real routes now, not homepage anchors. The site was a single long
 * page until the Phase 1 split; the guide always specified seven items with
 * four dropdowns, and that structure only works once the pages behind it
 * exist.
 *
 * `soon` marks destinations that need competition data we do not have yet
 * (results, scoreboard, gallery, hall of fame). They are deliberately absent
 * from the nav rather than present and empty: a Results Portal showing
 * nothing, before a single question has been asked, reads as broken. They
 * join the nav as the competition produces them.
 */
export const nav = [
  { label: "Home", href: "/" },
  { label: "About SAEAC", href: "/about" },
  {
    label: "Competition",
    href: "/competition",
    children: [
      { label: "Competition Structure", href: "/competition" },
      { label: "The Grand Finale Showdown", href: "/competition#showdown" },
      { label: "Eligibility", href: "/eligibility" },
      { label: "Participating LGAs", href: "/lgas" },
      { label: "Schedule", href: "/schedule" },
      { label: "Results", href: "/results" },
      { label: "Gallery", href: "/gallery" },
      { label: "Downloads & Rules", href: "/downloads" },
      { label: "Live", href: "/live" },
      { label: "Hall of Fame", href: "/hall-of-fame" },
    ],
  },
  { label: "Prizes", href: "/prizes" },
  { label: "News", href: "/news" },
  {
    label: "Get Involved",
    href: "/get-involved",
    children: [
      { label: "School Registration", href: "/register" },
      { label: "Become a Change Maker", href: "/get-involved" },
      { label: "Sponsors & Partners", href: "/get-involved#sponsors" },
    ],
  },
  { label: "Contact", href: "/contact" },
] as const;


/** The two primary actions, fixed in the header per the client's brief. */
export const navCtas = {
  primary: { label: "Register Your School", href: "/register" },
  secondary: { label: "Sponsor the Championship", href: "/get-involved#sponsors" },
} as const;

/**
 * Get Involved. The client renamed volunteers to "Change Makers", and this
 * block now carries both routes into the championship: giving time, and
 * funding it. Round 3 item 4 merged the old "Become a Partner" CTA in here,
 * because pointing the hero at a bare sponsor logo strip asked the reader for
 * money before it had asked them for anything else. The Sponsors strip lower
 * down stays as a credits row rather than a call to action.
 */
export const changeMaker = {
  eyebrow: "Get Involved",
  title: "Become a",
  titleTrail: "Change Maker",
  body: "Change Makers power the championship, on the ground and behind it. Volunteer at the LGA qualifiers and the Grand Finale, or back the Trust Fund that puts students through school.",
  cta: { label: "Volunteer With Us", href: "#changemaker" },
  /** Second route for organisations rather than individuals. */
  ctaSecondary: { label: "Sponsor the Championship", href: "#sponsor" },
} as const;

/** Footer navigation, per Content Guide §3.2. */
export const footerLinks = [
  { label: "About SAEAC", href: "/about" },
  { label: "Competition Structure", href: "/competition" },
  { label: "Eligibility", href: "/eligibility" },
  { label: "Participating LGAs", href: "/lgas" },
  { label: "Gallery", href: "/gallery" },
  { label: "Downloads & Rules", href: "/downloads" },
  { label: "Prizes", href: "/prizes" },
  { label: "FAQs", href: "/faq" },
  { label: "Contact", href: "/contact" },
  { label: "Sponsors & Partners", href: "/get-involved#sponsors" },
  { label: "Privacy & Data Protection", href: "/privacy" },
  { label: "Copyright & Terms", href: "/copyright" },
] as const;

/**
 * Portal quick links (§3.2). The guide recommends one unified login gateway
 * with role-based redirection rather than four separate login pages (§2.2),
 * so these all point at the same route and it works out where to send you.
 * Built in Phase 2: /login is live, and landingPathFor() decides where each
 * role lands after signing in.
 */
export const portalLinks = [
  { label: "School Login", href: "/login" },
  { label: "Change Maker Login", href: "/login" },
  { label: "Judge Login", href: "/login" },
  { label: "Admin Login", href: "/login" },
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
      "Near-black and centred, with oversized light-weight type and a thumbnail strip. Restrained and gallery-like, the most prestigious of the five.",
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
      "A fanned row of tilted photo cards over the hero, parenthesised labels, and card-and-image mosaics. The most approachable of the five, aimed at parents, teachers and schools.",
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

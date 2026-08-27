/**
 * Per-LGA content for the seven individual pages (Content Guide §4.5).
 *
 * The guide asks each LGA page for registered schools, venue, schedule,
 * results and gallery. Four of those five need competition data that does not
 * exist until schools are approved and fixtures are set, so these pages lead
 * with what IS true today — the place, its schools, and where it sits in the
 * competition — and let the live sections fill in as the championship runs.
 * A panel that says "fixtures will be published here" is honest; four empty
 * boxes are not.
 *
 * The prose is public information about each Local Government Area: geography,
 * headquarters, and the character of the area. School counts are the
 * provisional public-school figures already used across the site and seeded in
 * the `lgas` table — they are stated as provisional wherever they appear,
 * because they are.
 *
 * Deliberately NOT included: named schools, venue addresses, and contact
 * people. Those are Committee sign-off items (guide §6) and inventing them
 * would put wrong information in front of a principal deciding whether to
 * enter.
 */

export type LgaContent = {
  slug: string;
  name: string;
  /** Provisional count of public secondary schools. */
  schools: number;
  /** Two LGAs share one qualifying slot; see `combinedWith`. */
  combined: boolean;
  combinedWith?: string;
  headquarters: string;
  /** One-line positioning, used as the hero intro. */
  intro: string;
  /** Two or three paragraphs of public background on the area. */
  body: string[];
  /** Short factual rows shown as a definition list. */
  facts: { label: string; value: string }[];
  img: string;
  imgAlt: string;
};

export const lgaContent: LgaContent[] = [
  {
    slug: "akpabuyo",
    name: "Akpabuyo",
    schools: 7,
    combined: true,
    combinedWith: "Bakassi",
    headquarters: "Ikot Nakanda",
    intro:
      "A largely rural coastal LGA east of Calabar, sharing one qualifying slot with neighbouring Bakassi.",
    body: [
      "Akpabuyo lies on the eastern edge of the Cross River South Senatorial District, between Calabar and the Cameroonian border. It was carved out of the former Calabar Municipality in 1996 and is predominantly Efik-speaking, with farming and fishing the mainstay of most households.",
      "Its secondary schools are spread across a wide rural area rather than concentrated in one town, which is part of why Akpabuyo and Bakassi are treated as a single qualifying group: between them they field a comparable number of schools to a single urban LGA.",
    ],
    facts: [
      { label: "Headquarters", value: "Ikot Nakanda" },
      { label: "Qualifying group", value: "Shared with Bakassi" },
      { label: "Senatorial district", value: "Cross River South" },
    ],
    img: "/img/lga-akpabuyo.jpg",
    imgAlt: "Secondary school students from Akpabuyo Local Government Area",
  },
  {
    slug: "bakassi",
    name: "Bakassi",
    schools: 4,
    combined: true,
    combinedWith: "Akpabuyo",
    headquarters: "Abana",
    intro:
      "The district's smallest LGA by school count, sharing one qualifying slot with neighbouring Akpabuyo.",
    body: [
      "Bakassi is the southernmost and most sparsely served of the seven LGAs, a low-lying peninsula of creeks and fishing settlements at the mouth of the Cross River. Much of the population is riverine, and travel between communities is frequently by water rather than road.",
      "With the fewest secondary schools in the district, Bakassi is grouped with Akpabuyo for the Local Government Qualifiers so that its schools compete for a slot on comparable terms with the larger LGAs, rather than against a field several times their number.",
    ],
    facts: [
      { label: "Headquarters", value: "Abana" },
      { label: "Qualifying group", value: "Shared with Akpabuyo" },
      { label: "Terrain", value: "Largely riverine" },
    ],
    img: "/img/lga-bakassi.jpg",
    imgAlt: "Secondary school students from Bakassi Local Government Area",
  },
  {
    slug: "biase",
    name: "Biase",
    schools: 22,
    combined: false,
    headquarters: "Akpet Central",
    intro:
      "The northernmost LGA in the district, with schools spread across a long stretch of the road from Calabar to Ikom.",
    body: [
      "Biase sits at the northern end of the Cross River South Senatorial District, along the road that runs from Calabar towards Ikom. It is one of the district's more agricultural areas, with farming settlements distributed along the highway and the river.",
      "Its twenty-two public secondary schools are spread over a considerable distance rather than clustered in a single town, so the Local Government Qualifier draws from communities that can be an hour or more apart.",
    ],
    facts: [
      { label: "Headquarters", value: "Akpet Central" },
      { label: "Qualifying group", value: "One slot" },
      { label: "Senatorial district", value: "Cross River South" },
    ],
    img: "/img/lga-biase.jpg",
    imgAlt: "Secondary school students from Biase Local Government Area",
  },
  {
    slug: "odukpani",
    name: "Odukpani",
    schools: 23,
    combined: false,
    headquarters: "Odukpani",
    intro:
      "The gateway LGA north of Calabar, and one of the largest school fields in the district.",
    body: [
      "Odukpani lies immediately north of Calabar and functions as the district's gateway: the main road into the state capital runs through it, and it carries a mix of peri-urban settlements near Calabar and rural communities further out.",
      "It is among the best-served LGAs in the district for secondary education, with twenty-three public schools, which makes its Local Government Qualifier one of the more competitive routes into the Group Stage.",
    ],
    facts: [
      { label: "Headquarters", value: "Odukpani" },
      { label: "Qualifying group", value: "One slot" },
      { label: "Senatorial district", value: "Cross River South" },
    ],
    img: "/img/lga-odukpani.jpg",
    imgAlt: "Secondary school students from Odukpani Local Government Area",
  },
  {
    slug: "akamkpa",
    name: "Akamkpa",
    schools: 24,
    combined: false,
    headquarters: "Akamkpa",
    intro:
      "The largest LGA in the district by land area, and the largest school field of the seven.",
    body: [
      "Akamkpa covers the greatest land area of any LGA in the Cross River South Senatorial District, taking in a substantial share of the state's rainforest belt, including parts of the Cross River National Park.",
      "With twenty-four public secondary schools it fields the district's largest entry, drawn from communities scattered across a wide and often forested terrain. Distance, rather than the number of schools alone, is the defining feature of organising a qualifier here.",
    ],
    facts: [
      { label: "Headquarters", value: "Akamkpa" },
      { label: "Qualifying group", value: "One slot" },
      { label: "Notable", value: "Largest LGA by land area in the district" },
    ],
    img: "/img/lga-akamkpa.jpg",
    imgAlt: "Secondary school students from Akamkpa Local Government Area",
  },
  {
    slug: "calabar-municipality",
    name: "Calabar Municipality",
    schools: 22,
    combined: false,
    headquarters: "Calabar",
    intro:
      "The northern half of the state capital, and one of the district's two urban LGAs.",
    body: [
      "Calabar Municipality forms the northern half of the state capital and holds much of the city's administrative and institutional life, including the University of Calabar and a concentration of long-established secondary schools.",
      "Together with Calabar South it gives the district its urban core: schools here are close together, well connected by road, and draw students from across the wider metropolitan area.",
    ],
    facts: [
      { label: "Headquarters", value: "Calabar" },
      { label: "Qualifying group", value: "One slot" },
      { label: "Character", value: "Urban, state capital" },
    ],
    img: "/img/lga-calabar-municipality.jpg",
    imgAlt: "Secondary school students from Calabar Municipality",
  },
  {
    slug: "calabar-south",
    name: "Calabar South",
    schools: 15,
    combined: false,
    headquarters: "Anantigha",
    intro:
      "The southern half of the state capital, the district's most densely populated LGA.",
    body: [
      "Calabar South is the southern half of the state capital and the most densely populated LGA in the district, taking in the older waterside quarters of the city and the commercial districts around the Marina.",
      "Its fifteen public secondary schools sit within a comparatively small area, so its Local Government Qualifier is the most geographically compact of the seven. That makes attendance easier than it is in the more rural LGAs.",
    ],
    facts: [
      { label: "Headquarters", value: "Anantigha" },
      { label: "Qualifying group", value: "One slot" },
      { label: "Character", value: "Urban, most densely populated in the district" },
    ],
    img: "/img/lga-calabar-south.jpg",
    imgAlt: "Secondary school students from Calabar South Local Government Area",
  },
];

export function lgaBySlug(slug: string) {
  return lgaContent.find((l) => l.slug === slug);
}

/**
 * Slug for an LGA name, resolved from this file rather than derived by
 * lower-casing and hyphenating. The homepage's `lgas` array carries names
 * only, and a transform would silently produce a dead link the day a name
 * gains punctuation; a lookup either matches or is caught in the build.
 */
export function lgaSlug(name: string) {
  const found = lgaContent.find((l) => l.name === name);
  if (!found) throw new Error(`No LGA content for "${name}" — add it to content/lgas.ts`);
  return found.slug;
}

/** Slugs, in the display order used across the site. */
export const lgaSlugs = lgaContent.map((l) => l.slug);

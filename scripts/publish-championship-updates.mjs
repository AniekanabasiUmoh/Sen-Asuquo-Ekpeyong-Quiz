// One-time editorial import. Dry-run by default; --apply inserts missing slugs only.
// Reads local environment values without printing them or overwriting existing articles.
import { readFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

const envText = await readFile(new URL("../.env.local", import.meta.url), "utf8");
const env = Object.fromEntries(envText.split(/\r?\n/).flatMap((line) => {
  const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
  return match ? [[match[1], match[2].trim().replace(/^['"]|['"]$/g, "")]] : [];
}));
if (!env.NEXT_PUBLIC_SUPABASE_URL?.includes("lmohoeikidbsiioabmsz.supabase.co") || !env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("The expected SAEAC project credentials are not configured.");
const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const poster = (name, caption) => `[[image:/news-media/${name}|${caption}]]`;
const section = (name, schools, image) => `${name}\n${schools.join("\n")}\n\n${poster(image, name)}`;

const municipality = [
  section("Calabar Municipality — Group A", ["Franciscan Hall College, Calabar", "West African Peoples’ Institute, Calabar", "Holy Family High School", "Heroes Secondary School", "Limelight Secondary School", "Top Regent Bilingual Secondary School", "Federal Airport Authority of Nigeria (FAANS)", "Margaret Ekpo Secondary School", "Surefoot International Secondary School", "NYSC Model Secondary School"], "municipality-a.jpg"),
  section("Calabar Municipality — Group B", ["Divine Impact International Academy", "St. Anne’s High School", "University of Calabar Int’l Secondary School", "Government Secondary School, Nyaghasang", "Government Girls Secondary Sch. Big Qua Town", "G.S.S. Ediba", "G.S.S. State Housing Estate", "Mighty Wisdom College, Edim Otop", "God’s Gifted High School", "De-Fortoon International Schools"], "municipality-b.jpg"),
  section("Calabar Municipality — Group C", ["Florence Obi High School", "Government College, Ikot Ansa", "Estate Secondary School, Ikot Ansa", "Berith Academy", "Beryl International School", "Southern British High School, Calabar", "Auntie Margaret Memorial High School", "St. Patrick’s College", "Cross River Basin Devt. Authority Secondary Sch.", "Army Day Secondary School"], "municipality-c.jpg"),
  section("Calabar Municipality — Group D", ["Eastern Secondary Commercial School", "Naval Officer’s Wives Association Secondary Sch.", "Chilion International Schools", "Government Secondary School, Akim Qua Town", "Daniest International High School", "Hope Waddell Training Institution", "Emerald Field Schools", "Blazing Feet High Schools", "Ebony and Ivory International School", "Melody International Academy"], "municipality-d.jpg"),
].join("\n\n");

const akpabuyo = [
  section("Akpabuyo and Bakassi — Group A", ["Dolia International School, Ikot Ndarake", "Government Secondary Sch., Akwa Ikot Effanga", "Deeper Life High School, Akpabuyo", "Community Secondary School (CSS), Ikot Ewa", "Ikot Edem Oco Secondary School", "Government Technical College, Ikot Effiong", "Holy Ghost College, Ikot Edem Odo", "Sweet Kiddies High School", "Peniel Unique Model School"], "akpabuyo-bakassi-a.jpg"),
  section("Akpabuyo and Bakassi — Group B", ["St Peter's Secondary School, Ikot Offiong Ambai", "Joefel Intellect School, Epemete", "Great Brains International School", "Holy Family High School", "Police Secondary School, Akpabuyo", "UBEC Model Vocational School, Atimbo East, Akpabuyo", "Nigerian Navy Secondary School, Calabar", "Government Science and Technical College", "Government Technical College, Ikot Nakanda"], "akpabuyo-bakassi-b.jpg"),
  section("Akpabuyo and Bakassi — Group C", ["Government Technical College, Atam Asam", "Dynamic Grace Group of Schools, Idundu", "Community Science & Technical College, Idundu", "Obutong Comprehensive High School, Ebiet Okon", "Modern Secondary Commercial Sch, Ayanhanse", "Government Secondary School, Akansoko (name partially obscured on supplied graphic)", "Tower of Learning Int’l Sch, Ebiet Archibong Ukpong", "First Assured Premier College"], "akpabuyo-bakassi-c.jpg"),
  section("Akpabuyo and Bakassi — Group D", ["Assurance Secondary School, Ikang", "Diamond Grammar College, Ikang", "Rainbow High Schools, Ikang", "Giver's International High School, Ikang", "Government Science & Technical College, Ekpri Ikang", "Government Secondary School, Ikang Central", "Government Secondary School, Esighi", "Christian Diamond Secondary School", "Government Secondary School, Ifiang Nsung"], "akpabuyo-bakassi-d.jpg"),
].join("\n\n");

const south = [
  section("Calabar South — Group C", ["Divine Victory University Sec. School", "Government Sec. School, Anantigha", "Jesus Army International Academy", "True Shepherd International School", "Victory Secondary Commercial School", "Govt. Technical College, Atu by Webber", "Amethystfield Schools", "Danglad International College", "Govt. Secondary School, Atu Street"], "calabar-south-c.png"),
  section("Calabar South — Group D", ["Govt. Secondary School, Henshaw Town", "Greater Heights Christian School", "Hebrew High School", "Light-Way Secondary School", "Lutheran High School", "Christ Advocates Evangelical School", "Due Field International Schools", "Virtuous College", "Esuabana International School"], "calabar-south-d.png"),
].join("\n\n");

const articles = [
  { slug: "be-the-next-standard", title: "Watch: Be the next standard", category: "Videos", excerpt: "Watch the SAEAC film celebrating education and the next generation of champions.", image_path: "/img/students-lecture.jpg", body: "Watch the SAEAC film about education, ambition and the next generation.\n\n[[video:/news-media/be-the-next-standard.mp4|Be the next standard]]" },
  { slug: "november-month-of-big-dreams", title: "November: the month of big dreams", category: "Announcements", excerpt: "A month of ambition, talent discovery and academic excellence with SAEAC.", image_path: "/img/students-exam.jpg", body: "November is the month of the Senator Asuquo Ekpenyong Academic Championship.\n\nAs scholars embrace the opportunity to compete, SAEAC celebrates ambition, talent discovery, healthy competition and the pursuit of academic excellence across Cross River South.\n\nHere’s to big dreams and the achievements ahead. Champions are made here." },
  { slug: "calabar-south-groups-c-and-d", title: "Calabar South school groupings: Groups C and D", category: "School Groupings", excerpt: "See the supplied Group C and Group D school lists for Calabar South.", image_path: "/img/students-exam.jpg", body: `These are Groups C and D from the supplied Calabar South artwork. Other groups are not included in these graphics. School names are reproduced as shown.\n\n${south}` },
  { slug: "akpabuyo-bakassi-school-groupings", title: "Akpabuyo and Bakassi school groupings", category: "School Groupings", excerpt: "Explore the supplied school groups for the combined Akpabuyo and Bakassi opening round.", image_path: "/news-media/akpabuyo-bakassi-cover.jpg", body: `These group lists are reproduced from the supplied championship graphics. The Akpabuyo and Bakassi qualifying group shares a qualifying slot.\n\n${akpabuyo}` },
  { slug: "calabar-municipality-school-groupings", title: "Calabar Municipality school groupings", category: "School Groupings", excerpt: "Find the schools listed in Groups A to D for the Calabar Municipality opening round.", image_path: "/news-media/municipality-cover.jpg", body: `These school groups are reproduced from the supplied Calabar Municipality championship graphics.\n\n${municipality}` },
  { slug: "commissioner-education-saeac-message", title: "Watch: Commissioner of Education message on SAEAC", category: "Videos", excerpt: "Watch the SAEAC video labelled as an endorsement by the Cross River State Commissioner of Education.", image_path: "/img/students-lecture.jpg", body: "The SAEAC video below is labelled as an official endorsement by the Cross River State Commissioner of Education.\n\n[[video:/news-media/education-endorsement.mp4|Commissioner of Education message on SAEAC]]" },
  { slug: "cleared-for-take-off", title: "Cleared for take-off: SAEAC announces its Calabar Municipality opening", category: "Competition Updates", excerpt: "SAEAC announced Calabar Municipality as the first stop on its journey across Cross River South.", image_path: "/news-media/municipality-cover.jpg", body: "The Senator Asuquo Ekpenyong Academic Championship brings together young minds across Cross River South in a celebration of knowledge, talent and healthy competition.\n\nThe championship announcement named Calabar Municipality as the first stop, with the opening phase scheduled for 7 November 2026. Follow the schedule and results pages for the latest confirmed updates.\n\n[[video:/news-media/saeac-launch.mp4|SAEAC championship launch trailer]]\n\nSAEAC is the standard. Champions are made here." },
];

for (const article of articles) {
  const { data: existing, error: lookupError } = await db.from("news").select("id,slug,status").eq("slug", article.slug).maybeSingle();
  if (lookupError) throw new Error(`Lookup failed for ${article.slug}: ${lookupError.message}`);
  if (existing) { console.log(`Already exists; left unchanged: ${article.slug} (${existing.status})`); continue; }
  if (!process.argv.includes("--apply")) { console.log(`Would publish: ${article.slug}`); continue; }
  const { error } = await db.from("news").insert({ ...article, status: "published", published_at: new Date().toISOString() });
  if (error) throw new Error(`Could not publish ${article.slug}: ${error.message}`);
  console.log(`Published: ${article.slug}`);
}

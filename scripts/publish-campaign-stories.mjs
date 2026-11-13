// Editorial import: dry-run by default. Existing stories and edits are preserved.
import { readFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

const envText = await readFile(new URL("../.env.local", import.meta.url), "utf8");
const env = Object.fromEntries(envText.split(/\r?\n/).flatMap((line) => {
  const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
  return match ? [[match[1], match[2].trim().replace(/^['"]|['"]$/g, "")]] : [];
}));
if (!env.NEXT_PUBLIC_SUPABASE_URL?.includes("lmohoeikidbsiioabmsz.supabase.co") || !env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("Expected SAEAC project credentials not configured.");
const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const apply = process.argv.includes("--apply");
const image = (file, caption) => `[[image:/news-media/${file}|${caption}]]`;
const stories = [
  ["champions-are-made-here", "Champions are made here", "What it means to be part of the Senator Asuquo Ekpenyong Academic Championship.", "campaign-champions.jpg", "SAEAC celebrates learning, confidence and healthy competition among secondary school students across Cross River South.\n\nThe championship is an opportunity for young people to test their knowledge, represent their schools and inspire others to aim high."],
  ["one-district-seven-stages", "One district, seven stages, one champion", "A look at the scale and structure described in the SAEAC campaign.", "campaign-seven-stages.jpg", "The SAEAC campaign describes a championship spanning seven competition stages, with one grand champion at the end. Its graphic also refers to seven competition locations and 200 secondary schools.\n\nThe figure in the campaign graphic is not a live count of registered schools. Visit the competition page for more about the format."],
  ["seven-lgas-one-championship", "Seven LGAs, one championship", "Meet the seven local government areas represented in the SAEAC campaign.", "campaign-seven-lgas.jpg", "The campaign brings together schools across Biase, Akamkpa, Odukpani, Calabar Municipality, Calabar South, Akpabuyo and Bakassi.\n\nThe supplied championship graphic says Akpabuyo and Bakassi compete together. Explore the published school-grouping posts for the lists provided to the organising team."],
  ["a-day-as-the-senator", "A day as the Senator: an experience for the winning team", "The campaign introduces an exclusive Senate Office experience for the winning team.", "campaign-day-senator.jpg", "The SAEAC prize campaign includes ‘A Day as the Senator’, described in the supplied graphic as an exclusive Senate Office experience for the winning team.\n\nIt is one of the ways the championship aims to recognise students beyond the competition itself. Consult the official prizes page for the latest information."],
  ["scholarships-and-robotics", "Beyond the competition: scholarships and robotics", "The SAEAC prize campaign highlights learning opportunities for top-performing students.", "campaign-student-scholarships.jpg", "The supplied SAEAC prize graphic highlights fully funded scholarships and AI and robotics scholarship training for top-performing students.\n\nThese opportunities reflect the championship’s focus on education and students’ futures beyond the contest. Check the official prizes page for current details and eligibility."],
  ["champion-school-trophy-ict", "For the champion school: a trophy and an ICT centre", "The campaign highlights the Grand Trophy and an ICT centre for the champion school.", "campaign-champion-school.jpg", "The supplied prize graphic presents the Grand Trophy and a fully equipped ICT centre as part of the championship’s recognition for the champion school.\n\nThe official prizes page provides further context on the awards. The graphic describes the campaign offer, not a result or an award already made."],
  ["celebrating-the-winning-coach", "Celebrating the winning coach", "SAEAC’s campaign recognises the teacher or coach who helps prepare the champions.", "campaign-winning-coach.jpg", "Behind every team is someone who guides and encourages its students. The SAEAC campaign recognises the winning coach with a stated ₦500,000 cash prize and a Best Mentorship Certificate.\n\nThe amount and award are taken from the supplied promotional graphic; refer to the official prizes page for current details."],
  ["recognising-the-finalists", "Recognising the finalists", "The SAEAC campaign outlines prizes for the champion and runners-up.", "campaign-finalist-prizes.jpg", "The supplied prize graphic lists ₦1,000,000 for the champion, ₦500,000 for the first runner-up and ₦300,000 for the second runner-up. It also shows a laptop and a medal for each.\n\nThese are campaign prize details, not competition results. Please consult the official prizes page for the latest award information."],
  ["the-next-champion-could-be-you", "The next champion could be you", "An invitation to schools and students across Cross River South to take part in SAEAC.", "campaign-next-champion.jpg", "Every championship begins with students willing to learn, prepare and take on a challenge. SAEAC invites schools across Cross River South to be part of that journey.\n\nThe supplied campaign artwork contains an old website address. For current information and registration, use this official website and its registration page."],
  ["become-a-change-maker", "Become a SAEAC Change Maker", "Volunteers help make the championship possible, on the ground and behind the scenes.", "campaign-change-maker.jpg", "Change Makers support the Senator Asuquo Ekpenyong Academic Championship and the people taking part in it. From welcoming visitors to helping activities run smoothly, volunteers are part of the team behind the event.\n\nInterested in helping? Visit the volunteer registration page on this website for the current application form."],
];

for (const [slug, title, excerpt, file, text] of stories) {
  const { data: existing, error } = await db.from("news").select("id,status").eq("slug", slug).maybeSingle();
  if (error) throw error;
  if (existing) { console.log(`Preserved existing: ${slug}`); continue; }
  if (!apply) { console.log(`Would publish: ${slug}`); continue; }
  const { error: insertError } = await db.from("news").insert({ slug, title, excerpt, category: "Championship", image_path: `/news-media/${file}`, body: `${text}\n\n${image(file, title)}`, status: "published", published_at: new Date().toISOString() });
  if (insertError) throw insertError;
  console.log(`Published: ${slug}`);
}

// Change only the known old covers; never overwrite an editor's newer choice.
const coverUpdates = [
  ["be-the-next-standard", "/img/students-lecture.jpg", "/news-media/next-standard-video-cover.jpg"],
  ["commissioner-education-saeac-message", "/img/students-lecture.jpg", "/news-media/commissioner-video-cover.jpg"],
  ["cleared-for-take-off", "/news-media/municipality-cover.jpg", "/news-media/launch-video-cover.jpg"],
  ["calabar-south-groups-c-and-d", "/img/students-exam.jpg", "/news-media/calabar-south-c.png"],
  ["november-month-of-big-dreams", "/img/students-exam.jpg", "/news-media/campaign-november-dreams.jpg"],
];
for (const [slug, oldCover, newCover] of coverUpdates) {
  const { data: article, error } = await db.from("news").select("id,image_path,body,updated_at").eq("slug", slug).maybeSingle();
  if (error) throw error;
  if (!article || article.image_path !== oldCover) { console.log(`Preserved cover: ${slug}`); continue; }
  const changes = { image_path: newCover };
  if (slug === "november-month-of-big-dreams") changes.body = `${article.body ?? ""}\n\nThe original campaign artwork below shows an old website address. Please use this website for current information.\n\n${image("campaign-november-dreams.jpg", "November: the month of big dreams campaign poster")}`.trim();
  if (!apply) { console.log(`Would update cover: ${slug}`); continue; }
  const { data, error: updateError } = await db.from("news").update(changes).eq("id", article.id).eq("updated_at", article.updated_at).select("id");
  if (updateError || !data?.length) throw new Error(`Could not safely update ${slug}: ${updateError?.message ?? "article changed"}`);
  console.log(`Updated cover: ${slug}`);
}

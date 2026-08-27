import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { createPublicClient } from "@/lib/supabase/server";
import { GalleryGrid } from "./gallery-grid";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Gallery",
  description: "Photographs from the Senator Asuquo Ekpenyong Academic Championship.",
};

const fallback = [
  { title: "Principals across the district", caption: "Strategic stakeholders' meeting at Axari Hotel, Calabar.", image_path: "/img/meeting-group.jpg", content_type: "people" },
  { title: "Students ready to compete", caption: "Academic excellence begins with preparation.", image_path: "/img/students-posing.jpg", content_type: "student" },
  { title: "Learning in every classroom", caption: "The championship celebrates schools and the teachers who prepare them.", image_path: "/img/students-lecture.jpg", content_type: "school" },
  { title: "A district-wide ambition", caption: "Seven Local Government Areas, one standard.", image_path: "/img/students-outdoors.jpg", content_type: "event" },
  { title: "Recognition that lasts", caption: "Every finalist earns a place in the SAEAC story.", image_path: "/img/champion-certificate.jpg", content_type: "event" },
  { title: "The next generation", caption: "Building future leaders through academic competition.", image_path: "/img/win-students.jpg", content_type: "student" },
];

type GalleryRow = {
  title: string | null;
  caption: string | null;
  image_path: string;
  lga_id: string | null;
  stage_id: string | null;
  content_type?: string | null;
};

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ lga?: string; stage?: string; content_type?: string }>;
}) {
  const { lga, stage, content_type: contentType } = await searchParams;
  const supabase = createPublicClient();
  let data: GalleryRow[] | null = null;
  let lgas: { id: string; name: string }[] | null = null;
  let stages: { id: string; name: string; ordinal: number }[] | null = null;

  if (supabase) {
    let galleryQuery = supabase
      .from("gallery_items")
      .select("title, caption, image_path, lga_id, stage_id, content_type")
      .eq("status", "published")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(60);
    if (lga) galleryQuery = galleryQuery.eq("lga_id", lga);
    if (stage) galleryQuery = galleryQuery.eq("stage_id", stage);

    const [galleryResult, lgaResult, stageResult] = await Promise.all([
      galleryQuery,
      supabase.from("lgas").select("id, name").order("sort_order"),
      supabase.from("stages").select("id, name, ordinal").order("ordinal"),
    ]);
    data = galleryResult.data as GalleryRow[] | null;
    // The taxonomy column is intentionally introduced by a later migration.
    // Keep LGA/stage filtering useful on a partially migrated Preview by
    // retrying with the core gallery columns when that column is absent.
    if (galleryResult.error) {
      let coreQuery = supabase
        .from("gallery_items")
        .select("title, caption, image_path, lga_id, stage_id")
        .eq("status", "published")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false })
        .limit(60);
      if (lga) coreQuery = coreQuery.eq("lga_id", lga);
      if (stage) coreQuery = coreQuery.eq("stage_id", stage);
      const coreResult = await coreQuery;
      data = (coreResult.data ?? []).map((item) => ({ ...item, content_type: null })) as GalleryRow[];
    }
    lgas = lgaResult.data;
    stages = stageResult.data;
  }

  const items = data?.length ? data : fallback;
  return <>
    <PageHero eyebrow="Gallery" title="The Championship" titleTrail="in moments" intro="A growing record of the schools, students, teachers and communities that make SAEAC possible." image="/img/meeting-group-wide.jpg" imageAlt="School principals and the SAEAC planning committee at a stakeholder meeting" />
    <section className="mx-auto max-w-7xl px-5 py-14 sm:py-20">
      <form className="mb-8 flex flex-wrap items-end gap-3" aria-label="Filter gallery">
        <label className="text-[13px] font-semibold text-primary">
          LGA
          <select name="lga" defaultValue={lga ?? ""} className="mt-2 block rounded-2xl border border-black/15 bg-white px-4 py-3 text-[14px]">
            <option value="">All LGAs</option>
            {(lgas ?? []).map((entry) => <option key={entry.id} value={entry.id}>{entry.name}</option>)}
          </select>
        </label>
        <label className="text-[13px] font-semibold text-primary">
          Stage
          <select name="stage" defaultValue={stage ?? ""} className="mt-2 block rounded-2xl border border-black/15 bg-white px-4 py-3 text-[14px]">
            <option value="">All stages</option>
            {(stages ?? []).map((entry) => <option key={entry.id} value={entry.id}>{entry.ordinal}. {entry.name}</option>)}
          </select>
        </label>
        <label className="text-[13px] font-semibold text-primary">
          Content type
          <select name="content_type" defaultValue={contentType ?? ""} className="mt-2 block rounded-2xl border border-black/15 bg-white px-4 py-3 text-[14px]">
            <option value="">All moments</option>
            <option value="event">Event</option>
            <option value="school">School</option>
            <option value="student">Student</option>
            <option value="people">People</option>
            <option value="venue">Venue</option>
            <option value="press">Press</option>
          </select>
        </label>
        <button type="submit" className="rounded-full bg-gold px-6 py-3.5 text-[13px] font-bold text-primary transition hover:bg-primary hover:text-white">Filter</button>
      </form>
      <GalleryGrid items={items} initialFilter={contentType} lgas={(lgas ?? []).map((entry) => ({ id: entry.id, label: entry.name }))} stages={(stages ?? []).map((entry) => ({ id: entry.id, label: `${entry.ordinal}. ${entry.name}` }))} />
    </section>
  </>;
}

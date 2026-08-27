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

export default async function GalleryPage() {
  const supabase = createPublicClient();
  const [{ data }, { data: lgas }, { data: stages }] = supabase
    ? await Promise.all([
        supabase.from("gallery_items").select("title, caption, image_path, lga_id, stage_id, content_type").eq("status", "published").order("sort_order", { ascending: true }).order("created_at", { ascending: false }).limit(60),
        supabase.from("lgas").select("id, name").order("sort_order"),
        supabase.from("stages").select("id, name, ordinal").order("ordinal"),
      ])
    : [{ data: null }, { data: null }, { data: null }];
  const items = data?.length ? data : fallback;
  return <>
    <PageHero eyebrow="Gallery" title="The Championship" titleTrail="in moments" intro="A growing record of the schools, students, teachers and communities that make SAEAC possible." image="/img/meeting-group-wide.jpg" imageAlt="School principals and the SAEAC planning committee at a stakeholder meeting" />
    <section className="mx-auto max-w-7xl px-5 py-14 sm:py-20"><GalleryGrid items={items} lgas={(lgas ?? []).map((lga) => ({ id: lga.id, label: lga.name }))} stages={(stages ?? []).map((stage) => ({ id: stage.id, label: `${stage.ordinal}. ${stage.name}` }))} /></section>
  </>;
}

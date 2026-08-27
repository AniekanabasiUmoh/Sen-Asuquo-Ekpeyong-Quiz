"use client";

import { useMemo, useState } from "react";
import { Reveal } from "@/components/reveal";
import { ZoomImage } from "@/components/zoom-image";

type GalleryViewItem = {
  title: string | null;
  caption: string | null;
  image_path: string;
  lga_id?: string | null;
  stage_id?: string | null;
  content_type?: string | null;
};

type Taxonomy = { id: string; label: string };

export function GalleryGrid({ items, lgas, stages }: { items: GalleryViewItem[]; lgas: Taxonomy[]; stages: Taxonomy[] }) {
  const [filter, setFilter] = useState("all");
  const options = useMemo(() => [
    { id: "all", label: "All moments" },
    ...Array.from(new Map(items.map((item) => [item.content_type ?? "event", item.content_type ?? "event"])).entries()).map(([id, label]) => ({ id, label: label[0].toUpperCase() + label.slice(1) })),
  ], [items]);
  const visible = filter === "all" ? items : items.filter((item) => (item.content_type ?? "event") === filter);
  const lgaById = new Map(lgas.map((entry) => [entry.id, entry.label]));
  const stageById = new Map(stages.map((entry) => [entry.id, entry.label]));

  return <>
    {options.length > 1 ? <div className="mb-8 flex flex-wrap gap-2" aria-label="Filter gallery by content type">{options.map((option) => <button key={option.id} type="button" aria-pressed={filter === option.id} onClick={() => setFilter(option.id)} className={`rounded-full px-4 py-2 text-[12px] font-bold transition ${filter === option.id ? "bg-primary text-white" : "bg-white text-primary/60 hover:bg-primary/10"}`}>{option.label}</button>)}</div> : null}
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {visible.map((item, index) => <Reveal key={`${item.image_path}-${index}`} as="article" delay={index * 60} className="group overflow-hidden rounded-[24px] bg-white"><ZoomImage src={item.image_path} alt={item.title ?? "SAEAC championship photograph"} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="aspect-[4/3]" /><div className="p-5">{item.title ? <h2 className="font-display text-lg font-bold leading-tight">{item.title}</h2> : null}{item.caption ? <p className="mt-2 text-[13px] leading-relaxed text-primary/55">{item.caption}</p> : null}{item.lga_id || item.stage_id || item.content_type ? <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary/45">{item.content_type ? <span className="rounded-full bg-primary/[0.06] px-2 py-1">{item.content_type}</span> : null}{item.lga_id && lgaById.get(item.lga_id) ? <span className="rounded-full bg-primary/[0.06] px-2 py-1">{lgaById.get(item.lga_id)}</span> : null}{item.stage_id && stageById.get(item.stage_id) ? <span className="rounded-full bg-primary/[0.06] px-2 py-1">{stageById.get(item.stage_id)}</span> : null}</div> : null}</div></Reveal>)}
    </div>
    {visible.length === 0 ? <p className="rounded-2xl border border-dashed border-black/15 px-5 py-8 text-center text-[13px] text-primary/45">No photographs match this filter.</p> : null}
  </>;
}

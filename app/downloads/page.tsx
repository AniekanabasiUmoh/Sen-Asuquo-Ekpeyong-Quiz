import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { createPublicClient } from "@/lib/supabase/server";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Downloads and Rules",
  description: "Official SAEAC rules, regulations and resources for participating schools.",
};

function sizeLabel(bytes: number | null) {
  if (!bytes || bytes < 1) return null;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function DownloadsPage() {
  const supabase = createPublicClient();
  const { data } = supabase
    ? await supabase.from("downloads").select("title, description, version, file_url, file_size_bytes, published_at").eq("status", "published").order("published_at", { ascending: false })
    : { data: null };
  return <>
    <PageHero eyebrow="Downloads" title="Rules, resources" titleTrail="and documents" intro="The current documents schools need to understand and take part in the championship." />
    <section className="mx-auto max-w-4xl px-5 py-14 sm:py-20">
      {data?.length ? <ul className="space-y-3">{data.map((item) => <Reveal key={`${item.title}-${item.version}`} as="article" className="flex flex-wrap items-center justify-between gap-5 rounded-[24px] bg-white p-6"><div><h2 className="font-display text-lg font-bold">{item.title}</h2><p className="mt-1 text-[13px] leading-relaxed text-primary/55">{item.description || "Official SAEAC resource."}</p><p className="mt-2 text-[11px] uppercase tracking-[0.12em] text-primary/40">{item.version ? `Version ${item.version}` : "Current version"}{sizeLabel(item.file_size_bytes) ? ` · ${sizeLabel(item.file_size_bytes)}` : ""}</p></div><a href={item.file_url} target="_blank" rel="noopener noreferrer" className="rounded-full bg-primary px-5 py-3 text-[12px] font-bold text-white transition hover:bg-red">Download</a></Reveal>)}</ul> : <Reveal><div className="rounded-[28px] bg-white p-10 text-center"><h2 className="font-display text-xl font-bold">Rules and resources are being finalised</h2><p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-primary/60">The Organising Committee will publish the approved Rules and Regulations here before registration closes. Contact the committee if your school needs clarification.</p></div></Reveal>}
    </section>
  </>;
}

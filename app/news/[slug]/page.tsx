import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { createPublicClient } from "@/lib/supabase/server";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createPublicClient();
  const { data } = supabase ? await supabase.from("news").select("title, excerpt").eq("slug", slug).eq("status", "published").maybeSingle() : { data: null };
  return { title: data?.title ?? "News article", description: data?.excerpt ?? "News from the Senator Asuquo Ekpenyong Academic Championship." };
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createPublicClient();
  const { data: article } = supabase ? await supabase.from("news").select("title, excerpt, body, category, image_path, published_at").eq("slug", slug).eq("status", "published").maybeSingle() : { data: null };
  if (!article) notFound();
  return <>
    <PageHero eyebrow={article.category || "News & Updates"} title={article.title} titleTrail="" intro={article.excerpt || "From the SAEAC Organising Committee."} image={article.image_path || "/img/meeting-group.jpg"} imageAlt="SAEAC news" />
    <article className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
      <p className="text-[12px] text-primary/45">{article.published_at ? new Date(article.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : ""}</p>
      <div className="mt-6 whitespace-pre-wrap text-[16px] leading-[1.8] text-primary/75">{article.body || article.excerpt || ""}</div>
      <Link href="/news" className="mt-10 inline-flex rounded-full border border-black/15 px-6 py-3 text-[13px] font-semibold transition hover:bg-white">Back to all updates</Link>
    </article>
  </>;
}

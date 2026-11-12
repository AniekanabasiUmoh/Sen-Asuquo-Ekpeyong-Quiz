import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { ArticleBody } from "@/components/article-body";
import { createPublicClient } from "@/lib/supabase/server";

export const revalidate = 300;
export function generateStaticParams() { return []; }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createPublicClient({ revalidate: 300 });
  const { data } = supabase ? await supabase.from("news").select("title, excerpt, image_path, published_at").eq("slug", slug).eq("status", "published").maybeSingle() : { data: null };
  const title = data?.title ?? "News article";
  const description = data?.excerpt ?? "News from the Senator Asuquo Ekpenyong Academic Championship.";
  const url = `/news/${encodeURIComponent(slug)}`;
  return { title, description, alternates: { canonical: url }, openGraph: { title, description, url, type: "article", ...(data?.published_at ? { publishedTime: data.published_at } : {}), ...(data?.image_path ? { images: [{ url: data.image_path, alt: title }] } : {}) }, twitter: { card: "summary_large_image", title, description } };
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createPublicClient({ revalidate: 300 });
  const { data: article } = supabase ? await supabase.from("news").select("title, excerpt, body, image_path, published_at").eq("slug", slug).eq("status", "published").maybeSingle() : { data: null };
  if (!article) notFound();
  return <>
    <PageHero eyebrow="News & Updates" title={article.title} titleTrail="" intro={article.excerpt || "From the SAEAC Organising Committee."} image={article.image_path || "/img/meeting-group.jpg"} imageAlt="SAEAC news" />
    <article className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
      <p className="text-[12px] text-primary/45">{article.published_at ? new Date(article.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : ""}</p>
      <div className="mt-6"><ArticleBody body={article.body || article.excerpt || ""} /></div>
      {article.image_path ? <figure className="mt-10"><a href={article.image_path} target="_blank" rel="noreferrer" aria-label="Open the full article image"><Image src={article.image_path} unoptimized={article.image_path.startsWith("/api/news-media/")} width={1200} height={1200} alt={`Image for ${article.title}`} className="h-auto max-h-[80vh] w-full rounded-2xl object-contain" /></a><figcaption className="mt-2 text-sm text-primary/65">Select the image to view it in full.</figcaption></figure> : null}
      <nav aria-label="Championship links" className="mt-8 flex flex-wrap gap-5 text-sm font-semibold"><Link className="underline underline-offset-4" href="/schedule">Schedule</Link><Link className="underline underline-offset-4" href="/results">Results</Link></nav>
      <Link href="/news" className="mt-10 inline-flex rounded-full border border-black/15 px-6 py-3 text-[13px] font-semibold transition hover:bg-white">Back to all updates</Link>
    </article>
  </>;
}

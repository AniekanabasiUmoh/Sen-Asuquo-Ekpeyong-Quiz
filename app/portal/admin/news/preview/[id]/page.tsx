import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ArticleBody } from "@/components/article-body";

export const metadata: Metadata = { title: "Article preview", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function NewsPreview({ params }: { params: Promise<{ id: string }> }) {
  await requireRole(["super_admin", "committee"], "/portal/admin/news");
  const { id } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) notFound();
  const supabase = await createClient();
  const { data: article, error } = await supabase.from("news").select("title, excerpt, body, category, status, image_path").eq("id", id).maybeSingle();
  if (error) throw new Error("Could not load the article preview.");
  if (!article) notFound();
  return <article className="mx-auto max-w-3xl px-5 py-10"><p className="text-sm font-semibold">Private preview · {article.status}</p><h1 className="mt-4 font-display text-4xl font-extrabold">{article.title}</h1><p className="mt-4 text-lg">{article.excerpt}</p>{article.image_path ? <Image src={article.image_path} unoptimized={article.image_path.startsWith("/api/news-media/")} width={1200} height={800} alt={`Cover for ${article.title}`} className="mt-8 h-auto w-full rounded-2xl object-contain" /> : null}<div className="mt-8"><ArticleBody body={article.body ?? ""} /></div><Link className="mt-8 inline-block underline" href="/portal/admin/news">Back to news management</Link></article>;
}

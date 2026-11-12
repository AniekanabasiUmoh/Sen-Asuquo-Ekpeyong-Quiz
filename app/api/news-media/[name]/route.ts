import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (!/^[0-9a-f-]{36}\.webp$/i.test(name)) return new Response("Not found", { status: 404 });
  const supabase = await createClient();
  const { data, error } = await supabase.storage.from("news-media").download(name);
  if (error || !data) return new Response("Not found", { status: 404, headers: { "Cache-Control": "private, no-store" } });
  return new Response(data, { headers: { "Content-Type": "image/webp", "X-Content-Type-Options": "nosniff", "Cache-Control": "private, no-store" } });
}

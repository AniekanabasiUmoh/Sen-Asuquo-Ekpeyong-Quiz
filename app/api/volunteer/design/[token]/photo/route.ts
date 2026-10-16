import { createAdminClient } from "@/lib/supabase/server";
import { findAcceptedVolunteerDesign } from "@/lib/volunteer-design";

export const dynamic = "force-dynamic";

const privateImageHeaders = {
  "Cache-Control": "private, no-store, max-age=0",
  "Content-Disposition": "inline",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
  "X-Robots-Tag": "noindex, nofollow",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const volunteer = await findAcceptedVolunteerDesign(token);
  if (!volunteer) {
    return new Response("Not found", { status: 404, headers: privateImageHeaders });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase.storage
    .from("volunteer-photos")
    .download(volunteer.photoPath);

  if (error || !data) {
    console.error("[volunteer-design] private photo retrieval failed", error?.name ?? "not_found");
    return new Response("Not found", { status: 404, headers: privateImageHeaders });
  }

  const contentType = data.type;
  if (!["image/jpeg", "image/png", "image/webp"].includes(contentType)) {
    return new Response("Not found", { status: 404, headers: privateImageHeaders });
  }

  return new Response(data, {
    headers: {
      ...privateImageHeaders,
      "Content-Length": String(data.size),
      "Content-Type": contentType,
    },
  });
}

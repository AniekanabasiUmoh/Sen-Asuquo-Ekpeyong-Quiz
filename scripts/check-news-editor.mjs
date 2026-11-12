// Exercises a uniquely identified temporary DRAFT and removes only its own test data.
// Never publishes the test article or prints credentials.
import { chromium } from "playwright";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
const parse = (path) => Object.fromEntries(fs.readFileSync(path, "utf8").split(/\r?\n/).flatMap((line) => {
  const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
  return m ? [[m[1], m[2].trim().replace(/^['"]|['"]$/g, "")]] : [];
}));
const root = parse("../.env"), env = parse(".env.local");
if (!env.NEXT_PUBLIC_SUPABASE_URL?.includes("lmohoeikidbsiioabmsz.supabase.co")) throw new Error("Unexpected Supabase target");
const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const id = randomUUID(), slug = `editor-test-${id}`, title = `Editor test ${id}`;
const base = process.env.TEST_SITE_URL || "http://localhost:3101";
const browser = await chromium.launch({ headless: true, channel: "msedge" });
let inserted = false;
try {
  const { error } = await db.from("news").insert({ id, slug, title, excerpt: "Temporary editor test.", body: "Temporary draft.", status: "draft" });
  if (error) throw new Error("Could not create temporary draft: " + error.message);
  inserted = true;
  const page = await browser.newPage();
  await page.goto(base + "/login");
  await page.locator("input[name=email]").fill(root.SAEAC_ADMIN_EMAIL);
  await page.locator("input[name=password]").fill(root.SAEAC_ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await page.waitForURL("**/portal/**", { timeout: 60000 });
  await page.goto(base + "/portal/admin/news");
  const article = () => page.locator("li").filter({ hasText: title }).first();
  await article().locator("summary").click();
  await article().getByLabel("Summary").fill("Temporary editor test updated.");
  await article().getByLabel("Article body").fill("Temporary updated draft.");
  await article().getByRole("button", { name: "Save changes" }).click();
  await article().getByText(/saved\./).first().waitFor({ timeout: 30000 });
  await page.reload(); await article().locator("summary").click();
  await article().getByLabel("Upload an image").setInputFiles("public/news-media/municipality-cover.jpg");
  await article().getByRole("button", { name: "Upload image" }).click();
  await article().getByText(/Cover image saved/).waitFor({ timeout: 30000 });
  await page.reload(); await article().locator("summary").click();
  await article().getByLabel("Upload an image").setInputFiles("public/news-media/municipality-cover.jpg");
  await article().getByLabel("Place image").selectOption("gallery");
  await article().getByLabel("Image caption").fill("Temporary test image");
  await article().getByRole("button", { name: "Upload image" }).click();
  await article().getByText(/Gallery image saved/).waitFor({ timeout: 30000 });
  await page.reload(); await article().locator("summary").click();
  await article().getByLabel("YouTube video link").fill("https://www.youtube.com/watch?v=abcdefghijk");
  await article().getByLabel("Video title").fill("Temporary test video");
  await article().getByRole("button", { name: "Add video" }).click();
  await article().getByText(/Video added/).waitFor({ timeout: 30000 });
  const { data: saved, error: readError } = await db.from("news").select("image_path,body,status").eq("id", id).single();
  if (readError || saved.status !== "draft" || !saved.body.includes("[[youtube:abcdefghijk|") || !saved.body.includes("[[image:/api/news-media/")) throw new Error("Temporary draft content did not save correctly");
  const anon = await browser.newContext();
  const imageResponse = await anon.request.get(base + saved.image_path);
  if (imageResponse.status() !== 404) throw new Error("Anonymous user could access a draft cover");
  const preview = await page.request.get(base + `/portal/admin/news/preview/${id}`);
  if (!preview.ok()) throw new Error("Committee draft preview failed");
  console.log("Editor, cover and gallery uploads, video insertion and draft privacy: passed");
} finally {
  await browser.close();
  if (inserted) {
    const { data } = await db.from("news").select("image_path,body").eq("id", id).eq("slug", slug).maybeSingle();
    const paths = [data?.image_path, ...Array.from((data?.body ?? "").matchAll(/\/api\/news-media\/([0-9a-f-]{36}\.webp)/g), (m) => m[0])].filter(Boolean).map((p) => p.slice("/api/news-media/".length));
    if (paths.length) {
      const { error } = await db.storage.from("news-media").remove(paths);
      if (error) console.error("Could not remove temporary test images; inspect this test draft's generated paths.");
    }
    const { error } = await db.from("news").delete().eq("id", id).eq("slug", slug);
    if (error) console.error("Could not remove the temporary test draft:", id);
    else console.log("Temporary test draft removed.");
  }
}

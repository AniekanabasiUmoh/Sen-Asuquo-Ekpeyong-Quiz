// Read-only browser smoke checks; never prints credentials or private article content.
import { chromium } from "playwright";
import fs from "node:fs";
const root = Object.fromEntries(fs.readFileSync("../.env", "utf8").split(/\r?\n/).flatMap((line) => {
  const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
  return match ? [[match[1], match[2].trim().replace(/^['"]|['"]$/g, "")]] : [];
}));
const base = process.env.TEST_SITE_URL || "http://localhost:3101";
const browser = await chromium.launch({ headless: true, channel: "msedge" });
try {
  const page = await browser.newPage();
  fs.mkdirSync("output/playwright", { recursive: true });
  for (const [name, width, height] of [["mobile", 390, 844], ["tablet", 768, 1024], ["desktop", 1440, 1000]]) {
    await page.setViewportSize({ width, height });
    for (const route of ["/", "/news"]) {
      const response = await page.goto(base + route, { waitUntil: "domcontentloaded" });
      if (!response?.ok()) throw new Error(`${route} returned ${response?.status()}`);
      await page.locator("main").waitFor();
      if (await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)) throw new Error(`${name} ${route} overflow`);
      await page.emulateMedia({ reducedMotion: "reduce" });
      for (let y = 0, height = await page.evaluate(() => document.documentElement.scrollHeight); y < height; y += 600) { await page.evaluate((value) => window.scrollTo(0, value), y); await page.waitForTimeout(100); }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: `output/playwright/news-${route === "/" ? "home" : "index"}-${name}.png`, fullPage: true });
    }
    console.log(`${name}: homepage and news rendered without horizontal overflow`);
  }
  const denied = await page.request.get(base + "/portal/admin/news/preview/00000000-0000-0000-0000-000000000000", { maxRedirects: 0 });
  if (![303, 307].includes(denied.status()) || !denied.headers().location?.includes("login")) throw new Error("Anonymous preview was not blocked");
  const missing = await page.request.get(base + "/api/news-media/00000000-0000-0000-0000-000000000000.webp");
  if (missing.status() !== 404) throw new Error("Unpublished media was not blocked");
  console.log("Anonymous preview and unavailable media: blocked");
  await page.goto(base + "/login");
  await page.locator("input[name=email]").fill(root.SAEAC_ADMIN_EMAIL);
  await page.locator("input[name=password]").fill(root.SAEAC_ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await page.waitForURL("**/portal/**", { timeout: 60000 });
  await page.goto(base + "/portal/admin/news");
  await page.getByRole("heading", { name: "News management" }).waitFor({ timeout: 60000 });
  await page.locator("summary").filter({ hasText: "Edit article" }).first().click();
  await page.getByLabel("Upload an image").first().waitFor();
  const href = await page.getByRole("link", { name: "Preview saved article" }).first().getAttribute("href");
  await page.goto(base + href);
  await page.getByText(/Private preview/).waitFor();
  console.log("Committee news editor and private preview: accessible");
} finally { await browser.close(); }

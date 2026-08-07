import { chromium } from "playwright";

const OUT = process.env.OUT || "C:/Users/umoha/AppData/Local/Temp/claude/c--Dev-Sen-Asuquo-Ekpeyong-Quiz/0fb8e83e-dc6c-4602-8f43-823fe4df8bb2/scratchpad";
const b = await chromium.launch();

async function shot(name, w, h, fn) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  const errs = [];
  p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  p.on("pageerror", (e) => errs.push(String(e)));
  await p.goto("http://localhost:3050/", { waitUntil: "networkidle" });
  await fn(p);
  await p.screenshot({ path: `${OUT}/${name}.png` });
  const ow = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  console.log(name, "overflowX=", ow, "errors=", errs.length, errs.slice(0, 3));
  await p.close();
}

const toSection = (id) => async (p) => {
  await p.evaluate((i) => document.getElementById(i)?.scrollIntoView(), id);
  await p.waitForTimeout(1400);
};

await shot("r3-numbers-desk", 1440, 900, toSection("numbers"));
await shot("r3-numbers-mob", 390, 844, toSection("numbers"));
await shot("r3-tabbar-desk", 1440, 900, toSection("stages"));
await shot("r3-tabbar-mob", 390, 844, toSection("stages"));
await shot("r3-changemaker", 1440, 900, toSection("changemaker"));
await shot("r3-hero", 1440, 900, async (p) => p.waitForTimeout(1200));

await b.close();

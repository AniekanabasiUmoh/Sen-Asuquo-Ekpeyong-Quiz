import { chromium } from "playwright";

const OUT =
  process.env.OUT ||
  "C:/Users/umoha/AppData/Local/Temp/claude/c--Dev-Sen-Asuquo-Ekpeyong-Quiz/0fb8e83e-dc6c-4602-8f43-823fe4df8bb2/scratchpad";
const b = await chromium.launch();

async function shot(name, w, h, fn) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  const errs = [];
  p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  p.on("pageerror", (e) => errs.push(String(e)));
  await p.goto("http://localhost:3050/", { waitUntil: "networkidle" });
  await fn(p);
  await p.screenshot({ path: `${OUT}/${name}.png` });
  const ow = await p.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  console.log(name, "overflowX=", ow, "errors=", errs.length, errs.slice(0, 3));
  await p.close();
}

const toSection = (id) => async (p) => {
  await p.evaluate((i) => document.getElementById(i)?.scrollIntoView(), id);
  await p.waitForTimeout(1500);
};

await shot("r3-origin-desk", 1440, 1000, toSection("origin"));
await shot("r3-origin-mob", 390, 844, toSection("origin"));
await shot("r3-prizes", 1440, 900, toSection("prizes"));
await shot("r3-about", 1440, 900, toSection("about"));
await shot("r3-hero", 1440, 900, async (p) => p.waitForTimeout(1200));
// Hero after two rotations, to confirm the cross-fade actually advances.
await shot("r3-hero-rot", 1440, 900, async (p) => p.waitForTimeout(11500));

await b.close();

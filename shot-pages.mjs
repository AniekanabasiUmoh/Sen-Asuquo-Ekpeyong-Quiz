import { chromium } from "playwright";

const OUT =
  "C:/Users/umoha/AppData/Local/Temp/claude/c--Dev-Sen-Asuquo-Ekpeyong-Quiz/0fb8e83e-dc6c-4602-8f43-823fe4df8bb2/scratchpad";
const b = await chromium.launch();

const routes = ["", "about", "competition", "eligibility", "register", "contact"];

for (const r of routes) {
  for (const [tag, w, h] of [
    ["desk", 1440, 900],
    ["mob", 390, 844],
  ]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    const errs = [];
    p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
    p.on("pageerror", (e) => errs.push(String(e)));
    await p.goto(`http://localhost:3050/${r}`, { waitUntil: "networkidle" });
    await p.waitForTimeout(900);
    const name = `pg-${r || "home"}-${tag}`;
    await p.screenshot({ path: `${OUT}/${name}.png` });
    const ow = await p.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    console.log(name.padEnd(24), "overflowX=", ow, "errors=", errs.length, errs.slice(0, 2));
    await p.close();
  }
}

await b.close();

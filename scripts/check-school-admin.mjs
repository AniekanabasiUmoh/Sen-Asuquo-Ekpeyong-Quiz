// Read-only smoke check. Uses local credentials without logging them or school data.
import { chromium } from 'playwright';
import fs from 'node:fs';
const env = (path) => Object.fromEntries(fs.readFileSync(path, 'utf8').split(/\r?\n/).filter(x => /^[A-Za-z_]+=/.test(x)).map(x => {
  const i = x.indexOf('='); return [x.slice(0, i), x.slice(i + 1).trim().replace(/^["']|["']$/g, '')];
}));
(async () => {
  const root = env('../.env');
  const local = env('.env.local');
  const base = process.env.TEST_SITE_URL || 'http://localhost:3100';
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  try {
    const page = await browser.newPage();
    await page.goto(base + '/login');
    await page.locator('input[name=email]').fill(root.SAEAC_ADMIN_EMAIL);
    await page.locator('input[name=password]').fill(root.SAEAC_ADMIN_PASSWORD);
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    const first = page.locator('a[href^="/portal/admin/schools/"]').first();
    await first.waitFor({ timeout: 60000 });
    console.log('School detail links:', await page.locator('a[href^="/portal/admin/schools/"]').count());
    const result = await fetch(local.NEXT_PUBLIC_SUPABASE_URL + '/rest/v1/students?select=school_id&photo_path=not.is.null&limit=1', { headers: { apikey: local.SUPABASE_SERVICE_ROLE_KEY, Authorization: 'Bearer ' + local.SUPABASE_SERVICE_ROLE_KEY } });
    if (!result.ok) throw new Error('Could not select a school with a photo for testing');
    const [student] = await result.json();
    const href = '/portal/admin/schools/' + student.school_id;
    await page.goto(base + href);
    await page.getByRole('heading', { name: /Students \(/ }).waitFor();
    const image = page.locator('img[alt^="Passport of"]').first();
    await image.waitFor();
    await image.evaluate(img => img.decode());
    console.log('Passport preview loaded: true');
    const download = await page.getByRole('link', { name: 'Download passport', exact: true }).first().getAttribute('href');
    const photo = await page.request.get(download);
    if (!photo.ok() || !photo.headers()['content-type'].startsWith('image/')) throw new Error('Passport download failed');
    console.log('Passport download:', photo.status());
    const csv = await page.request.get(base + href + '/export');
    if (!csv.ok() || !(await csv.text()).includes('Student')) throw new Error('CSV export failed');
    console.log('CSV export:', csv.status());
    fs.mkdirSync('output/playwright', { recursive: true });
    for (const [name, width, height] of [['mobile', 390, 844], ['desktop', 1440, 1000]]) {
      await page.setViewportSize({ width, height });
      if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw new Error(name + ' horizontal overflow');
      await page.screenshot({ path: 'output/playwright/school-details-' + name + '.png', fullPage: true });
      console.log(name + ' layout: no horizontal overflow');
    }
    const anon = await browser.newContext();
    for (const path of [href, href + '/export']) {
      const response = await anon.request.get(base + path, { maxRedirects: 0 });
      if (![303, 307].includes(response.status()) || !response.headers().location.includes('/login')) throw new Error('Anonymous access was not blocked');
    }
    console.log('Anonymous detail and export access: blocked');
  } finally { await browser.close(); }
})().catch(() => { console.error('School admin smoke check failed. Inspect locally without logging credentials or student data.'); process.exitCode = 1; });

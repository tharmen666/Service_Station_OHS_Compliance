// Records the 3-minute demo of the live app with on-screen subtitles.
// Usage: node scripts/record-demo.mjs [url] [outDir]
// Output: <outDir>/demo.webm and <outDir>/scene-log.json (timing and step results).
import { chromium } from '@playwright/test';
import { mkdirSync, renameSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const URL_TARGET = process.argv[2] || 'https://service-station-ohs-compliance.vercel.app';
const OUT = process.argv[3] || 'demo-out';
mkdirSync(OUT, { recursive: true });
const rawDir = join(OUT, 'raw');
mkdirSync(rawDir, { recursive: true });

const log = [];
const t0 = Date.now();
const elapsed = () => Math.round((Date.now() - t0) / 1000);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function subtitle(page, text) {
  await page.evaluate((t) => {
    let el = document.getElementById('__demo_sub');
    if (!el) {
      el = document.createElement('div');
      el.id = '__demo_sub';
      Object.assign(el.style, {
        position: 'fixed', left: '50%', bottom: '26px', transform: 'translateX(-50%)',
        maxWidth: '82%', background: 'rgba(0,0,0,0.80)', color: '#fff',
        font: '600 22px/1.35 system-ui, sans-serif', padding: '12px 20px', borderRadius: '12px',
        zIndex: '2147483647', pointerEvents: 'none', textAlign: 'center',
      });
      document.body.appendChild(el);
    }
    el.textContent = t;
  }, text).catch(() => {});
}

// Each step is attempted independently so one missing control does not stop the recording.
async function step(name, fn) {
  const s = elapsed();
  try {
    await fn();
    log.push({ at: s, step: name, ok: true });
  } catch (err) {
    log.push({ at: s, step: name, ok: false, error: String(err?.message || err).slice(0, 200) });
  }
}

// Scene boundaries in seconds, matching docs/DEMO_SCRIPT.md.
const SCENES = { s1: 0, s2: 20, s3: 55, s4: 75, s5: 105, s6: 145, s7: 170, end: 180 };
async function holdUntil(sec) {
  const wait = sec * 1000 - (Date.now() - t0);
  if (wait > 0) await sleep(wait);
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  recordVideo: { dir: rawDir, size: { width: 1280, height: 720 } },
});
const page = await context.newPage();

// ---- Scene 1
await subtitle(page, 'Forecourt OHS compliance for service stations. AI drafts. A competent person decides.');
await step('open home', async () => {
  await page.goto(URL_TARGET, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('header', { timeout: 30000 });
});
await sleep(4000);
await holdUntil(SCENES.s2);

// ---- Scene 2
await subtitle(page, 'Spill response, employee rights and statutory training, in one place.');
await step('spill tab', async () => {
  await page.getByRole('button', { name: /Fuel Spill Containment/i }).first().click({ timeout: 8000 });
});
await sleep(4000);
await step('rights tab', async () => {
  await page.getByRole('button', { name: /Employee Rights/i }).first().click({ timeout: 8000 });
});
await sleep(4000);
await step('training tab', async () => {
  await page.getByRole('button', { name: /Training/i }).first().click({ timeout: 8000 });
});
await sleep(4000);
await holdUntil(SCENES.s3);

// ---- Scene 3
await subtitle(page, 'Daily reconciliation and offload checks, with variance tracking.');
await step('wetstock offload tab', async () => {
  await page.getByRole('button', { name: /Wetstock & Offload/i }).first().click({ timeout: 8000 });
});
await sleep(4000);
await step('wetstock ATG tab', async () => {
  await page.getByRole('button', { name: /Wetstock ATG|Wetstock & Reconciliation|8\. Wetstock/i }).first().click({ timeout: 8000 });
});
await sleep(5000);
await holdUntil(SCENES.s4);

// ---- Scene 4
await subtitle(page, 'Temperature 0.0 is requested for repeatability. It does not guarantee accuracy.');
await step('open AI studio drawer', async () => {
  await page.getByRole('button', { name: /AI Studio/i }).first().click({ timeout: 8000 });
});
await sleep(6000);
await step('close AI studio drawer', async () => {
  await page.getByRole('button', { name: /Close Drawer/i }).first().click({ timeout: 8000 });
});
await sleep(2000);
await holdUntil(SCENES.s5);

// ---- Scene 5
await subtitle(page, 'Every document starts as a draft. Personal details are removed before anything leaves the server.');
await step('open doc generator', async () => {
  await page.locator('[title="Autonomous Statutory OHS Doc Generator"]').first().click({ timeout: 8000 });
});
await sleep(2000);
await step('enter site and hazards', async () => {
  await page.locator('input[placeholder^="e.g. Gauteng"]').first().fill('Gauteng Forecourt - Lenasia Station', { timeout: 8000 });
  await page.locator('textarea').first().fill(
    'Dispenser hose rupture and high-pressure petrol splash during peak hours. Contact 0821234567 for the site supervisor.',
    { timeout: 8000 }
  );
});
await sleep(3000);
await step('generate draft', async () => {
  await page.getByRole('button', { name: /Compile Statutory Document Draft/i }).first().click({ timeout: 8000 });
  await page.getByText(/DRAFT/).first().waitFor({ timeout: 90000 });
});
await sleep(3000);
await step('scroll to citations', async () => {
  await page.getByText(/Hierarchy of Controls|HIERARCHY OF CONTROLS/i).first().scrollIntoViewIfNeeded({ timeout: 5000 });
});
await sleep(3000);
await holdUntil(SCENES.s6);

// ---- Scene 6
await subtitle(page, 'Export is locked until a named competent person reviews and confirms the draft.');
await step('export locked shown', async () => {
  const btn = page.getByRole('button', { name: /Export to Audit Log/i }).first();
  await btn.scrollIntoViewIfNeeded({ timeout: 5000 });
  await page.waitForTimeout(1500);
});
await step('reviewer name entered', async () => {
  await page.locator('input[placeholder^="Reviewer full name"]').first().fill('DEMO REVIEWER (not a real sign-off)', { timeout: 8000 });
});
await sleep(1500);
await step('reviewer confirmed', async () => {
  await page.locator('input[type="checkbox"]').first().check({ timeout: 8000 });
});
await sleep(4000);
await holdUntil(SCENES.s7);

// ---- Scene 7
await subtitle(page, 'Governance first: draft only, named reviewer, audit record. Questions welcome.');
await step('close modal', async () => {
  await page.getByRole('button', { name: /^Close$/ }).last().click({ timeout: 8000 });
});
await sleep(3000);
await holdUntil(SCENES.end);

const videoPath = await page.video().path();
await context.close();
await browser.close();

const target = join(OUT, 'demo.webm');
if (existsSync(videoPath)) {
  renameSync(videoPath, target);
} else {
  // Fallback: take the newest webm in the raw folder.
  const files = readdirSync(rawDir).filter((f) => f.endsWith('.webm'));
  if (files.length) renameSync(join(rawDir, files[0]), target);
}
writeFileSync(join(OUT, 'scene-log.json'), JSON.stringify({ url: URL_TARGET, totalSeconds: elapsed(), steps: log }, null, 2));
console.log(JSON.stringify({ video: target, totalSeconds: elapsed(), failed: log.filter((l) => !l.ok) }, null, 2));

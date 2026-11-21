import { test, expect, type Page } from '@playwright/test';

const VIDEO_PATH = '/demo/service-station-ohs-enterprise-demo.mp4';

test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'executive demo checks run once on chromium');
});

function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error' && !msg.text().includes('fonts.gstatic.com')) errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(err.message));
  return errors;
}

async function openDemo(page: Page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const btn = page.getByTestId('open-executive-demo-btn');
  await expect(btn).toBeVisible({ timeout: 20000 });
  await btn.click();
  await expect(page.getByTestId('executive-demo-modal')).toBeVisible();
}

test('Executive demo button is on the standard route with the required label and colours', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const btn = page.getByRole('button', { name: 'Watch 2-Min Executive Demo' });
  await expect(btn).toBeVisible({ timeout: 20000 });
  await expect(btn).toHaveCSS('background-color', 'rgb(6, 78, 59)'); // #064E3B
  await expect(btn).toHaveCSS('border-top-color', 'rgb(217, 119, 6)'); // #D97706
  await expect(btn).toHaveCSS('color', 'rgb(255, 255, 255)');
});

test('Modal plays the demo from the expected source with the required video attributes', async ({ page }) => {
  await openDemo(page);
  const modal = page.getByTestId('executive-demo-modal');
  await expect(modal).toHaveCSS('background-color', 'rgb(15, 23, 42)'); // #0F172A

  const video = page.getByTestId('executive-demo-video');
  await expect(video).toHaveAttribute('controls', '');
  await expect(video).toHaveAttribute('playsinline', '');
  await expect(video).toHaveAttribute('preload', 'metadata');
  await expect(video).toHaveAttribute('autoplay', '');
  await expect(video.locator('source')).toHaveAttribute('src', VIDEO_PATH);
});

test('Modal closes with the close button', async ({ page }) => {
  await openDemo(page);
  await page.getByTestId('executive-demo-close').click();
  await expect(page.getByTestId('executive-demo-modal')).toHaveCount(0);
});

test('Modal closes with the Escape key', async ({ page }) => {
  await openDemo(page);
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('executive-demo-modal')).toHaveCount(0);
});

test('Modal closes when the backdrop is clicked, but not when the dialog itself is clicked', async ({ page }) => {
  await openDemo(page);
  await page.getByTestId('executive-demo-modal').locator('h2').click();
  await expect(page.getByTestId('executive-demo-modal')).toBeVisible();
  await page.getByTestId('executive-demo-backdrop').click({ position: { x: 4, y: 4 } });
  await expect(page.getByTestId('executive-demo-modal')).toHaveCount(0);
});

test('Video asset is served as MP4 with byte-range support', async ({ page }) => {
  const res = await page.request.get(VIDEO_PATH, { headers: { Range: 'bytes=0-1023' } });
  expect(res.status()).toBe(206);
  expect(res.headers()['content-type']).toContain('video/mp4');
  expect(res.headers()['accept-ranges']).toBe('bytes');
  expect(res.headers()['content-range']).toMatch(/^bytes 0-1023\/\d+$/);
  expect((await res.body()).length).toBe(1024);
});

test('Mobile 375px: modal fits the viewport and the page logs no console errors', async ({ page }) => {
  const errors = collectConsoleErrors(page);
  await page.setViewportSize({ width: 375, height: 812 });
  await openDemo(page);

  const box = await page.getByTestId('executive-demo-modal').boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(375);

  // The page must not scroll sideways because of the modal.
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);

  // Let the video request settle before checking the console.
  await page.waitForTimeout(1500);
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('executive-demo-modal')).toHaveCount(0);
  expect(errors).toEqual([]);
});

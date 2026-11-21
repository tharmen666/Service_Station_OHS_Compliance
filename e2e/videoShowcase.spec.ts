import { test, expect } from '@playwright/test';

test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'runs once on chromium');
});

test('Video Showcase tab plays the narrated demo and no longer uses the 10-second silent loop', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (m) => {
    if (m.type() === 'error' && !m.text().includes('fonts.gstatic.com')) errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(e.message));

  const requested: string[] = [];
  page.on('request', (r) => {
    if (r.url().endsWith('.mp4')) requested.push(new URL(r.url()).pathname);
  });

  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: /Video Showcase/i }).first().click();

  const player = page.getByTestId('demo-video-tab-narrated-player');
  await expect(player).toBeVisible({ timeout: 20000 });
  await expect(player).toHaveAttribute('controls', '');
  await expect(player).toHaveAttribute('preload', 'metadata');
  await expect(player.locator('source')).toHaveAttribute('src', '/demo/service-station-ohs-enterprise-demo.mp4');

  // The old looping backdrop video is gone from this tab, and its labels with it.
  await expect(page.getByTestId('demo-video-tab-player')).toHaveCount(0);
  await expect(page.locator('text=SILENT LOOP')).toHaveCount(0);
  await expect(page.locator('text=LOOP ACTIVE')).toHaveCount(0);

  await page.waitForTimeout(1500);
  expect(requested).not.toContain('/Service_Station_OHS_Compliance_Demo.mp4');
  expect(errors).toEqual([]);
});

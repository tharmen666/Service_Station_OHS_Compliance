import { test, expect } from '@playwright/test';

// Browser test of the reviewer sign-off gate: export stays disabled until a named reviewer confirms.
test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'runs once on chromium');
});

test('Reviewer gate: export is disabled until a named reviewer confirms the draft', async ({ page }) => {
  test.setTimeout(150000);
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  await page.locator('[title="Autonomous Statutory OHS Doc Generator"]').first().click();
  await page.locator('input[placeholder^="e.g. Gauteng"]').first().fill('Gauteng Forecourt - Test Station');
  await page.locator('textarea').first().fill('Dispenser hose rupture and fuel splash during peak hours for the test case.');
  await page.getByRole('button', { name: /Compile Statutory Document Draft/i }).first().click();

  // The banner must say draft and not approved, and show the engine and the governance count.
  await expect(page.getByText('AI draft compiled - not approved')).toBeVisible({ timeout: 90000 });
  await expect(page.getByText(/Engine: (live model|template)/)).toBeVisible();
  await expect(page.getByText(/Governance check: \d+ issue\(s\) flagged/)).toBeVisible();

  const exportBtn = page.getByRole('button', { name: /Export to Audit Log/i }).first();
  await expect(exportBtn).toBeDisabled();

  // A name shorter than 3 characters is not enough, even with the box ticked.
  const reviewer = page.locator('input[placeholder^="Reviewer full name"]').first();
  await reviewer.fill('AB');
  await page.locator('input[type="checkbox"]').first().check();
  await expect(exportBtn).toBeDisabled();

  // A full name plus the tick enables export.
  await reviewer.fill('DEMO REVIEWER (test run)');
  await expect(exportBtn).toBeEnabled();

  // Unticking disables it again.
  await page.locator('input[type="checkbox"]').first().uncheck();
  await expect(exportBtn).toBeDisabled();
});

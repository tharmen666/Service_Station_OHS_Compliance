import { test, expect } from '@playwright/test';

// Governance wording checks for the admin guardrails drawer. The drawer is shown only on the admin route.
test('AI Studio drawer states the temperature is requested, not guaranteed, and never claims zero hallucination', async ({ page }) => {
  await page.goto('/?admin=1', { waitUntil: 'domcontentloaded' });

  const open = page.getByRole('button', { name: /Open Admin Guardrails Drawer/i }).first();
  await expect(open).toBeVisible({ timeout: 20000 });
  await open.click();

  await expect(page.locator('text=Temperature Requested: 0.0')).toBeVisible();
  await expect(page.locator('text=AI-drafted output requires human review')).toBeVisible();
  // Overclaim guard: these phrases must never appear in the UI again
  await expect(page.locator('text=Zero Hallucination')).toHaveCount(0);

  const textarea = page.locator('textarea');
  await expect(textarea).toBeVisible();
  const systemPromptText = await textarea.inputValue();
  expect(systemPromptText).toContain('SANS 10089');

  await page.getByRole('button', { name: /Close Drawer/i }).first().click();
  await expect(page.locator('text=Temperature Requested: 0.0')).not.toBeVisible();
});

test('Admin drawer is not shown on the normal staff route', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('body')).toContainText('POPIA AES-256', { timeout: 20000 });
  await expect(page.getByRole('button', { name: /Open Admin Guardrails Drawer/i })).toHaveCount(0);
});

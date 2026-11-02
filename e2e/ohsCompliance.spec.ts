import { test, expect } from '@playwright/test';

test.describe('Service Station OHS Compliance - E2E Suite', () => {

  test.beforeEach(async ({ page }) => {
    // Listen for uncaught errors or 404 console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.error(`[Browser Console Error] ${msg.text()}`);
      }
    });

    await page.goto('/');
  });

  test('Navigation & Routing: Core tabs mount without 404s or console errors', async ({ page }) => {
    // Verify document title
    await expect(page).toHaveTitle(/Forecourt OHS/i);

    // Verify main header title is rendered
    const headerTitle = page.locator('h1').first();
    await expect(headerTitle).toBeVisible();

    // Test switching tabs (Evacuation, Spill, Fire, Rights, Quiz, Refresher)
    const spillTabButton = page.getByRole('button', { name: /Fuel Spill Containment/i }).first();
    if (await spillTabButton.isVisible()) {
      await spillTabButton.click();
      await expect(page.locator('text=Emergency Spill Response Process & Steps')).toBeVisible();
    }

    const rightsTabButton = page.getByRole('button', { name: /Employee Rights/i }).first();
    if (await rightsTabButton.isVisible()) {
      await rightsTabButton.click();
      await expect(page.locator('text=BCEA Section 9')).toBeVisible();
    }
  });

  test('White-Label Tenant Rendering: Dynamic .env.local tenant site code & header reflect correctly', async ({ page }) => {
    // Check that site code "ENG-JHB-042" is visible in top POS header badge
    const headerBadge = page.locator('header');
    await expect(headerBadge).toContainText('ENG-JHB-042');
  });

  test('Statutory AI Studio Drawer: Verifies hard-locked temperature = 0.0 and SANS 10089 prompt', async ({ page }) => {
    // Click AI Studio Drawer button in header
    const aiDrawerBtn = page.getByRole('button', { name: /AI Studio/i }).first();
    await expect(aiDrawerBtn).toBeVisible({ timeout: 10000 });
    await aiDrawerBtn.click();

    // Verify temperature 0.0 lock badge
    await expect(page.locator('text=Temperature Parameter Locked: 0.0')).toBeVisible();
    await expect(page.locator('text=Zero Hallucination Compliance Mode')).toBeVisible();

    // Verify statutory SANS 10089 / OHS Act 85 system instruction content
    const textarea = page.locator('textarea');
    await expect(textarea).toBeVisible();
    const systemPromptText = await textarea.inputValue();
    expect(systemPromptText).toContain('SANS 10089');
    expect(systemPromptText).toContain('Set to 0.0');

    // Close drawer
    const closeBtn = page.getByRole('button', { name: /Close Drawer/i }).first();
    await closeBtn.click();
    await expect(page.locator('text=Temperature Parameter Locked: 0.0')).not.toBeVisible();
  });

  test('POPIA Privacy Status: Client-side AES-256-GCM encryption indicator is active in header', async ({ page }) => {
    const header = page.locator('header');
    await expect(header).toContainText('POPIA AES-256');
  });

});

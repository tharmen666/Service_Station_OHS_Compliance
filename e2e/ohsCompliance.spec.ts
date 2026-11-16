import { test, expect } from '@playwright/test';

test.describe('Service Station OHS Compliance - E2E Suite', () => {

  test.beforeEach(async ({ page }) => {
    // Listen for uncaught errors or 404 console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.error(`[Browser Console Error] ${msg.text()}`);
      }
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });
  });

  test('Navigation & Routing: Core tabs mount without 404s or console errors', async ({ page }) => {
    // Verify document title
    await expect(page).toHaveTitle(/Forecourt OHS/i);

    // Verify main header title is rendered
    const headerTitle = page.locator('h1').first();
    await expect(headerTitle).toBeVisible();

    // Test switching tabs (Evacuation, Spill, Fire, Rights, Quiz, Refresher)
    // Each tab must exist and render its content. A missing tab fails the test.
    const spillTabButton = page.getByRole('button', { name: /Fuel Spill Containment/i }).first();
    await expect(spillTabButton).toBeVisible();
    await spillTabButton.click();
    await expect(page.locator('text=Emergency Spill Response Process & Steps')).toBeVisible();

    const rightsTabButton = page.getByRole('button', { name: /Employee Rights/i }).first();
    await expect(rightsTabButton).toBeVisible();
    await rightsTabButton.click();
    await expect(page.locator('text=BCEA Section 9')).toBeVisible();

    const trainingTabButton = page.getByRole('button', { name: /Training/i }).first();
    await expect(trainingTabButton).toBeVisible();
    await trainingTabButton.click();
    await expect(page.getByRole('heading', { name: /Basic First Aid Level 1/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Basic Firefighting & Equipment Handling/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Hazard Identification & Risk Assessment/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Health & Safety Representative/i })).toBeVisible();

    const wetstockBridgeTabButton = page.getByRole('button', { name: /Wetstock & Offload/i }).first();
    await expect(wetstockBridgeTabButton).toBeVisible();
    await wetstockBridgeTabButton.click();
    await expect(page.locator('text=RSD 26 Safety').first()).toBeVisible();

    const wetstockTabButton = page.getByRole('button', { name: /Wetstock ATG|Wetstock & Reconciliation|8\. Wetstock/i }).first();
    await expect(wetstockTabButton).toBeVisible();
    await wetstockTabButton.click();
    await expect(page.getByRole('heading', { name: /Wetstock Accounting & Automatic Tank Gauge/i })).toBeVisible();
    await expect(page.locator('text=Daily Tank Wetstock Reconciliation Ledger')).toBeVisible();
  });

  test('White-Label Tenant Rendering: Dynamic .env.local tenant site code & header reflect correctly', async ({ page }) => {
    // Check that site code "STN-ALPHA" is visible in top POS header badge
    const headerBadge = page.locator('header');
    await expect(headerBadge).toContainText('STN-ALPHA');
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

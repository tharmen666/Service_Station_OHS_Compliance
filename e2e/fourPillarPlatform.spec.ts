import { test, expect } from '@playwright/test';

test.describe('4-Pillar Enterprise Service Station Compliance Platform', () => {
  test('1. 4-Pillar Navigation, 6-Language Switcher (incl. isiXhosa) & Responsive Layout', async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error' && !msg.text().includes('fonts.gstatic.com')) {
        consoleErrors.push(msg.text());
      }
    });

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Verify all 4 Pillar navigation buttons
    await expect(page.getByTestId('pillar-nav-forecourtOps')).toBeVisible();
    await expect(page.getByTestId('pillar-nav-shiftWetstock')).toBeVisible();
    await expect(page.getByTestId('pillar-nav-shopTraining')).toBeVisible();
    await expect(page.getByTestId('pillar-nav-executiveAudit')).toBeVisible();

    // Switch to isiXhosa (XH)
    await page.getByTestId('lang-btn-XH').click();
    await expect(page.locator('header')).toContainText('Ithebulethi yoThobelo lwe-OHS eGaraji');
    await page.getByTestId('lang-btn-EN').click();

    // Navigate through each pillar and verify workspace renders with zero overflow
    await page.getByTestId('pillar-nav-forecourtOps').click();
    await expect(page.getByTestId('pillar-workspace-forecourt')).toBeVisible();

    await page.getByTestId('pillar-nav-shiftWetstock').click();
    await expect(page.getByTestId('pillar-workspace-shift-wetstock')).toBeVisible();

    await page.getByTestId('pillar-nav-shopTraining').click();
    await expect(page.getByTestId('pillar-workspace-shop-training')).toBeVisible();

    await page.getByTestId('pillar-nav-executiveAudit').click();
    await expect(page.getByTestId('pillar-workspace-executive-audit')).toBeVisible();

    for (const width of [375, 800, 1024]) {
      await page.setViewportSize({ width, height: 800 });
      const hasOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      expect(hasOverflow).toBe(false);
    }

    expect(consoleErrors).toEqual([]);
  });

  test('2. Universal POS Adapter (WinBranch, ISIS, Astron Dual-Stream NAMOS+Symphony) & Webhook Auth', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Verify REST Webhook enforces API-key authentication
    const unauthRes = await page.request.post('/api/v1/pos/shift-ingest', {
      headers: { 'x-tenant-id': 'STN-ALPHA' },
      data: { siteCode: 'STN-ALPHA' },
    });
    expect(unauthRes.status()).toBe(401);

    await page.getByTestId('pillar-nav-shiftWetstock').click();
    await page.getByTestId('wetstock-subtab-posImport').click();
    await expect(page.getByTestId('pos-ingestion-adapter-panel')).toBeVisible();

    // Test Astron Energy Dual-BOS (NAMOS + FreshStop Symphony) merge
    await page.getByTestId('pos-vendor-btn-NAMOS').click();
    await expect(page.getByTestId('pos-dual-stream-toggle')).toBeChecked();
    await page.getByTestId('pos-parse-reconcile-btn').click();
    await expect(page.getByTestId('pos-reconciliation-output')).toContainText('NAMOS + SYMPHONY');

    // Test live Webhook ingestion endpoint with valid demo key
    await page.getByTestId('pos-test-webhook-btn').click();
    await expect(page.getByTestId('pos-webhook-status')).toContainText('HTTP 200 OK');
    await expect(page.getByTestId('pos-webhook-status')).toContainText('SHA-256:');
  });

  test('3. R638 Fridge Temp Breach Auto-Creates NCR Visible in Pillar 4 & 3D Academy Gate', async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error' && !msg.text().includes('fonts.gstatic.com')) {
        consoleErrors.push(msg.text());
      }
    });

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/?mockScore=35&mockVideoWatch=95', { waitUntil: 'domcontentloaded' });

    // Pillar 3: R638 cold-chain breach -> auto NCR
    await page.getByTestId('pillar-nav-shopTraining').click();
    await page.getByTestId('shop-subtab-r638Haccp').click();
    await page.getByTestId('r638-temp-input').fill('11.5');
    await page.getByTestId('r638-log-temp-btn').click();
    await expect(page.getByTestId('r638-temp-feedback')).toContainText('BREACH LOGGED');

    // Verify 3D Interactive Forecourt Player renders, shows plastic spade & hard broom spark rule on Step 6, and locks/unlocks certificate gate
    await page.getByTestId('shop-subtab-videoAcademy').click();
    await expect(page.getByTestId('forecourt-3d-player')).toBeVisible();
    await page.getByTestId('3d-step-chip-6').click();
    await expect(page.getByTestId('hotspot-plastic-spade-broom')).toBeVisible();
    await expect(page.getByTestId('selected-hotspot-detail')).toContainText('friction sparks');
    await expect(page.getByTestId('3d-localized-caption')).toContainText('NON-SPARKING PLASTIC SPADE');

    await expect(page.getByTestId('video-watch-percent')).toContainText('95%');
    await expect(page.getByTestId('academy-issue-cert-btn')).toBeDisabled();

    // Verify Module 1 Quiz contains non-sparking plastic spade & hard broom question, and unlocks certificate gate
    await page.getByTestId('academy-toggle-quiz-btn').click();
    await expect(page.getByTestId('academy-issue-cert-btn')).toBeEnabled();
    await page.getByRole('tab', { name: 'Emergency Spill Response (10 Qs)' }).click();
    // Navigate to SR_Q04 (4th question in Emergency Spill Response)
    for (let i = 0; i < 3; i++) {
      await page.getByRole('button', { name: /Next Question/i }).click();
    }
    await expect(page.locator('body')).toContainText('non-sparking plastic spade and hard-bristle broom');

    // Verify 360px mobile viewport renders 3D Academy with zero horizontal overflow
    await page.getByTestId('academy-toggle-quiz-btn').click();
    await page.setViewportSize({ width: 360, height: 780 });
    const mobileOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(mobileOverflow).toBe(false);

    // Return to desktop & test Executive Demo 90s Tour launch from Pillar 4 header
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.getByTestId('pillar-nav-executiveAudit').click();
    await page.getByTestId('exec-subtab-ncrTracker').click();
    await expect(page.getByTestId('executive-ncr-ledger')).toContainText('R638 Cold-Chain');

    await page.getByTestId('exec-header-3d-tour-btn').click();
    await expect(page.getByTestId('executive-tour-overlay')).toBeVisible();
    expect(consoleErrors).toEqual([]);
  });
});


import { test, expect } from '@playwright/test';

test.describe('Forecourt Sentinel OHS Compliance - Comprehensive Audit & E2E Suite', () => {
  test('1. Navigation, White-Label Tenant, POPIA & Responsive Viewports (375px, 800px, 1024px)', async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error' && !msg.text().includes('fonts.gstatic.com')) {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Check 375px, 800px, and 1024px widths for zero horizontal overflow
    for (const width of [375, 800, 1024]) {
      await page.setViewportSize({ width, height: 800 });

      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasHorizontalScroll).toBe(false);
    }

    await expect(page).toHaveTitle(/Forecourt OHS/i);
    const header = page.locator('header');
    await expect(header).toContainText('STN-ALPHA');
    await expect(header).toContainText('POPIA AES-256');

    // Fix 6: AI Studio button must NOT appear on normal staff route (/)
    await expect(page.getByRole('button', { name: /AI Studio/i })).toHaveCount(0);

    // Fix 9: Language switching translates navigation & headings
    await page.getByTestId('lang-btn-ZU').click();
    await expect(page.locator('header')).toContainText('Ithebulethi Yezokuphepha Egaraji');
    await page.getByTestId('lang-btn-EN').click();

    expect(consoleErrors).toEqual([]);
  });

  test('2. Fix 1 & Fix 2: Quiz Totals (42 Qs Single Source of Truth) & Certificate Gating (1/42 Blocked vs Pass Issued)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Navigate to Quiz (7. 60s Assessment (42 Qs))
    const quizTabBtn = page.getByRole('button', { name: /60s Assessment \(42 Qs\)/i }).first();
    await quizTabBtn.click();

    // Fix 2: Verify All (42 Qs) and category filter counts match actual questions
    await expect(page.getByRole('tab', { name: 'All (42 Qs)' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Customer Service (10 Qs)' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Emergency Spill Response (10 Qs)' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Fire Safety (12 Qs)' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Evacuation (10 Qs)' })).toBeVisible();
    await expect(page.getByTestId('quiz-score-counter')).toContainText('Score: 0 / 42');
    await expect(page.getByTestId('quiz-question-counter')).toContainText('Question 1 of 42');

    // Answer 1 question correctly (Option B for Question 1) -> Score 1 / 42
    await page.getByTestId('quiz-option-B').click();
    await expect(page.getByTestId('quiz-score-counter')).toContainText('Score: 1 / 42');

    // Open Certificate Modal with 1/42 -> Must NOT produce a certificate
    await page.getByRole('button', { name: /HITL OHS Sign-off Certificate/i }).click();
    const gatedNotice = page.getByTestId('cert-gated-notice');
    await expect(gatedNotice).toBeVisible();
    await expect(gatedNotice).toContainText('Not yet certified: score 1/42, pass mark 80%');
    await expect(page.getByTestId('cert-issued-view')).toHaveCount(0);
    await page.getByRole('button', { name: /Return to Assessment/i }).click();

    // Fix 3: Verify Timer Lock at 0s (using ?quizTimer=1)
    await page.goto('/?quizTimer=1', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: /60s Assessment \(42 Qs\)/i }).first().click();
    await expect(page.getByTestId('quiz-timeout-alert')).toBeVisible({ timeout: 5000 });
    await expect(page.getByTestId('quiz-option-A')).toBeDisabled();

    // Verify passing score (>= 80%, e.g., 35/42 = 83%) issues unique certificate and gates verification badges
    await page.goto('/?mockScore=35', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: /60s Assessment \(42 Qs\)/i }).first().click();
    await page.getByRole('button', { name: /HITL OHS Sign-off Certificate/i }).click();

    await expect(page.getByTestId('cert-issued-view')).toBeVisible();
    await expect(page.getByTestId('cert-score-summary')).toContainText('35 / 42 (83% Passed)');
    const certIdText = await page.getByTestId('cert-unique-id').textContent();
    expect(certIdText).toMatch(/CERT-OHS-\d{8}-[A-Z0-9]+/);

    // Verify "AUDITED & VERIFIED" and "Digitally Verified" are NOT shown before supervisor verification
    await expect(page.getByTestId('badge-audited-verified')).toHaveCount(0);
    await expect(page.getByTestId('badge-digitally-verified')).toHaveCount(0);

    // Complete supervisor verification step -> badges appear
    await page.getByLabel('Supervisor Name').fill('Supervisor Role A');
    await page.getByLabel('Supervisor Registration Reference').fill('16.2-REF-001');
    await page.locator('input[type="checkbox"]').check();
    await page.getByRole('button', { name: /Complete Supervisor Verification/i }).click();

    await expect(page.getByTestId('badge-audited-verified')).toBeVisible();
    await expect(page.getByTestId('badge-digitally-verified')).toBeVisible();
  });

  test('3. Fix 4: Nelly AI Guide Backend Retrieval, Citations, CCP Input & Unrelated Query Refusal', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    await page.getByTestId('open-nelly-btn').click();
    await expect(page.getByTestId('nelly-ai-window')).toBeVisible();
    await expect(page.getByTestId('nelly-ai-window')).toContainText(
      'Guidance only, not legal advice'
    );

    // Test 1: PPE question -> cites GSR Reg 2 & OHS Act
    await page.getByTestId('nelly-query-input').fill('What PPE boots and vests are required?');
    await page.getByTestId('nelly-send-btn').click();
    await expect(page.getByTestId('nelly-messages-list')).toContainText(
      'General Safety Regulations (GNR 1031) Regulation 2'
    );

    // Test 2: Food temperature question WITHOUT probe reading -> cites R638, does NOT report CCP status badge
    await page.getByTestId('nelly-query-input').fill('What is the food temperature for poultry?');
    await page.getByTestId('nelly-send-btn').click();
    await expect(page.getByTestId('nelly-messages-list')).toContainText('Regulation R638 of 2018');
    await expect(page.getByTestId('nelly-messages-list')).toContainText(
      'No thermometer probe reading was entered'
    );
    await expect(page.getByTestId('nelly-ccp-status-badge')).toHaveCount(0);

    // Test 3: Food temperature WITH real entered probe reading (75.5°C) -> reports COMPLIANT badge
    await page.getByTestId('nelly-ccp-input').fill('75.5');
    await page.getByRole('button', { name: /Check R638 Temp/i }).click();
    await expect(page.getByTestId('nelly-ccp-status-badge')).toContainText('75.5°C');
    await expect(page.getByTestId('nelly-ccp-status-badge')).toContainText('COMPLIANT');

    // Test 4: Unrelated question ("what's the weather") & question with no source -> refuses to guess
    await page.getByTestId('nelly-ccp-input').fill('');
    await page.getByTestId('nelly-query-input').fill("what's the weather today?");
    await page.getByTestId('nelly-send-btn').click();
    await expect(page.getByTestId('nelly-messages-list')).toContainText(
      "I don't have an approved source for this. Please check with your OHS officer"
    );
  });

  test('4. Fix 5 & Fix 13: G.E.A.R. Score Independence (Target 100 vs Score 96 -> Not compliant) & Persisted Document Audit Log', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Verify initial Governance score is 96% and status is Compliant (Target 85%)
    await expect(page.getByTestId('gear-score-governance')).toHaveText('96%');
    await expect(page.getByTestId('gear-status-governance')).toContainText('Compliant');

    // Open GEAR Modal and set Governance target to 100%
    await page.getByTestId('open-gear-modal-btn').click();
    const govSlider = page.getByTestId('gov-slider');
    await govSlider.fill('100');

    // Score must remain 96%, while status becomes "Not compliant"
    await expect(page.getByTestId('gear-modal-gov-score')).toHaveText('96%');
    await expect(page.getByTestId('gear-modal-gov-status')).toContainText('Not compliant');

    // Reset Threshold Defaults -> restores Target 85% and "Compliant"
    await page.getByTestId('gear-reset-defaults-btn').click();
    await expect(page.getByTestId('gear-modal-gov-status')).toContainText('Compliant');
    await page.getByRole('button', { name: /Save & Return to Dashboard/i }).click();

    // Fix 13: Document Generator Copy Confirmation & Persisted Audit Log across reload
    await page.getByTestId('open-statutory-doc-btn').click();
    await expect(page.getByTestId('popia-minimisation-note')).toBeVisible();
    await page.getByTestId('generate-statutory-doc-btn').click();

    await expect(page.getByTestId('copy-doc-btn')).toBeVisible();
    await page.getByTestId('doc-audit-user-input').fill('Shift Supervisor A');
    await page.getByTestId('doc-reviewer-confirm-checkbox').check();
    await page.getByTestId('export-audit-log-btn').click();
    await expect(page.getByTestId('persisted-audit-log-row').first()).toContainText(
      'Shift Supervisor A'
    );

    // Reload page and verify the audit log record persists
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.getByTestId('open-statutory-doc-btn').click();
    await expect(page.getByTestId('persisted-audit-log-row').first()).toContainText(
      'Shift Supervisor A'
    );
  });

  test('5. Dual-Mode Wetstock Reconciliation: Manual Dip + Pump Totalizer + Next-Morning Shift Rollover', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Open Wetstock & Reconciliation tab
    await page.getByRole('button', { name: /8\. Wetstock & Reconciliation/i }).first().click();
    await expect(page.getByTestId('dual-mode-wetstock-panel')).toBeVisible();
    await expect(page.getByTestId('wetstock-active-shift-badge')).toContainText('Active Shift #1');

    // Enter Closing Meter Totalizer (158000) and Physical Closing Dip (18195)
    await page.getByTestId('wetstock-closing-meter-input').fill('158000');
    await page.getByTestId('wetstock-closing-dip-input').fill('18195');

    // Click "Lock Shift & Roll Over to Tomorrow's Opening"
    await page.getByTestId('wetstock-lock-rollover-btn').click();

    // Verify Shift #2 is active and Opening Dip & Opening Meter Totalizer rolled over from previous closing
    await expect(page.getByTestId('wetstock-active-shift-badge')).toContainText('Active Shift #2');
    await expect(page.getByTestId('wetstock-opening-dip-input')).toHaveValue('18195');
    await expect(page.getByTestId('wetstock-opening-meter-input')).toHaveValue('158000');
    await expect(page.getByTestId('wetstock-rollover-history-row').first()).toContainText('18195 L');
  });
});

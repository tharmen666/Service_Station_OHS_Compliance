import { test, expect, type Page } from '@playwright/test';

// Browser tests of the reviewer sign-off gate. The API is mocked, so these tests do not depend on a
// live model or database. Server behaviour is covered by e2e/store.spec.ts and the governance tests.
test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'runs once on chromium');
});

const FIXTURE_DRAFT = {
  success: true,
  document: '# DRAFT dossier\nOHS Act 85 of 1993 Section 8. Reviewed by a competent person before use.',
  timestamp: new Date().toISOString(),
  metadata: {
    statutoryFrameworks: ['OHS Act 85 of 1993'],
    hierarchyOfControlsApplied: true,
    humanReviewRequired: true,
    status: 'DRAFT',
    engineVersion: 'Fixture (test)',
    governance: {
      policyVersion: 'test',
      generatedAt: new Date().toISOString(),
      taskType: 'HIRA',
      engine: 'template',
      modelId: null,
      promptSha256: 'a'.repeat(64),
      outputSha256: 'b'.repeat(64),
      redactions: { saId: 0, phone: 0, email: 0 },
      issues: [],
      reviewRequired: true,
      reviewStatus: 'PENDING_REVIEW',
      recordId: '00000000-0000-4000-8000-000000000001',
    },
  },
};

async function openGenerator(page: Page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.locator('[title="Autonomous Statutory OHS Doc Generator"]').first().click();
  await page.locator('input[placeholder^="e.g. Gauteng"]').first().fill('Gauteng Forecourt - Test Station');
  await page.locator('textarea').first().fill('Dispenser hose rupture and fuel splash during peak hours for the test case.');
  await page.getByRole('button', { name: /Compile Statutory Document Draft/i }).first().click();
}

test('Reviewer gate: export is disabled until a named reviewer confirms the draft', async ({ page }) => {
  await page.route('**/api/compliance', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(FIXTURE_DRAFT) })
  );
  await openGenerator(page);

  await expect(page.getByText('AI draft compiled - not approved')).toBeVisible({ timeout: 30000 });
  await expect(page.getByText(/Engine: template/)).toBeVisible();
  await expect(page.getByText(/Governance check: 0 issue\(s\) flagged/)).toBeVisible();

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

test('Fail closed: when the governed path is unavailable, no draft or export is shown', async ({ page }) => {
  await page.route('**/api/compliance', (route) =>
    route.fulfill({
      status: 503,
      contentType: 'application/json',
      body: JSON.stringify({ success: false, error: 'Governance store is unavailable. No draft was produced.' }),
    })
  );
  await openGenerator(page);

  await expect(page.getByRole('alert')).toContainText('No draft was produced');
  await expect(page.getByText('AI draft compiled - not approved')).toHaveCount(0);
  await expect(page.getByRole('button', { name: /Export to Audit Log/i })).toHaveCount(0);
});

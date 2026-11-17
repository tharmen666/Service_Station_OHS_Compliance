import { test, expect } from '@playwright/test';
import { redactPII, validateStatutoryRequest, GovernanceValidationError } from '../src/governance/inputGuard';
import { checkStatutoryOutput } from '../src/governance/outputGuard';
import { executeStatutoryComplianceEngine } from '../src/api/compliance';
import { GOVERNANCE_POLICY_VERSION } from '../src/governance/policy';

// Pure-logic tests: they run once, on the chromium project, and never open a page.
test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'governance logic tests run once');
});

const VALID_HAZARDS = 'Dispenser hose rupture and fuel splash during peak hours, with tanker offloading nearby.';

test.describe('Governance: PII redaction', () => {
  test('redacts SA ID numbers, phone numbers and emails and counts each', () => {
    const result = redactPII('Employee 8801015029082, call +27 82 123 4567 or jane.doe@example.co.za');
    expect(result.text).not.toContain('8801015029082');
    expect(result.text).not.toContain('123 4567');
    expect(result.text).not.toContain('jane.doe@example.co.za');
    expect(result.text).toContain('[REDACTED-ID]');
    expect(result.text).toContain('[REDACTED-PHONE]');
    expect(result.text).toContain('[REDACTED-EMAIL]');
    expect(result.counts).toEqual({ saId: 1, phone: 1, email: 1 });
  });

  test('leaves ordinary statutory text untouched', () => {
    const text = 'OHS Act 85 of 1993 Section 8(2)(b) and SANS 10089-3 apply.';
    expect(redactPII(text).text).toBe(text);
  });
});

test.describe('Governance: input validation', () => {
  test('rejects a task type outside the allowlist', () => {
    expect(() => validateStatutoryRequest({ taskType: 'Free text prompt', hazards: VALID_HAZARDS }))
      .toThrow(GovernanceValidationError);
  });

  test('rejects hazards that are too short to describe a scope', () => {
    try {
      validateStatutoryRequest({ taskType: 'HIRA', hazards: 'fuel' });
      throw new Error('expected rejection');
    } catch (err) {
      expect(err).toBeInstanceOf(GovernanceValidationError);
      expect((err as GovernanceValidationError).issues.join(' ')).toContain('hazards must be at least');
    }
  });

  test('rejects oversized hazards and non-object bodies', () => {
    expect(() => validateStatutoryRequest({ taskType: 'HIRA', hazards: 'x'.repeat(2001) })).toThrow(GovernanceValidationError);
    expect(() => validateStatutoryRequest('not an object')).toThrow(GovernanceValidationError);
  });

  test('accepts a valid request and redacts PII inside it before it can be sent', () => {
    const valid = validateStatutoryRequest({
      taskType: 'HIRA',
      siteContext: 'Site Alpha, contact 0821234567',
      hazards: `${VALID_HAZARDS} Worker 8801015029082 reported it.`,
    });
    expect(valid.hazards).not.toContain('8801015029082');
    expect(valid.siteContext).not.toContain('0821234567');
    expect(valid.redactions.saId).toBe(1);
    expect(valid.redactions.phone).toBe(1);
  });
});

test.describe('Governance: output checks', () => {
  test('removes forbidden claims and flags the draft', () => {
    const result = checkStatutoryOutput(
      'DRAFT. OHS Act 85 of 1993 applies. This system is zero hallucination and 100% compliant. Reviewed by a competent person.'
    );
    expect(result.document).not.toMatch(/zero hallucination/i);
    expect(result.document).not.toMatch(/100% compliant/i);
    expect(result.document).toContain('[claim removed by governance check]');
    expect(result.document).toContain('GOVERNANCE CHECK');
    expect(result.issues.length).toBeGreaterThanOrEqual(2);
  });

  test('flags output missing the DRAFT marker and reviewer requirement', () => {
    const result = checkStatutoryOutput('Some text citing OHS Act 85 of 1993 only.');
    expect(result.issues).toContain('Missing DRAFT status marker');
    expect(result.issues).toContain('Missing reviewer requirement');
  });

  test('flags a fabricated approval status', () => {
    const result = checkStatutoryOutput('**Status**: APPROVED & AUDIT-LOCKED. OHS Act 85 of 1993. DRAFT. competent person.');
    expect(result.document).not.toContain('APPROVED & AUDIT-LOCKED');
    expect(result.issues.some((i) => i.includes('Approval status'))).toBe(true);
  });
});

test.describe('Governance: end-to-end engine guarantees', () => {
  test('invalid input never reaches the engine', async () => {
    await expect(executeStatutoryComplianceEngine({ taskType: 'HIRA', hazards: 'short' } as any))
      .rejects.toBeInstanceOf(GovernanceValidationError);
  });

  test('every response is a DRAFT with a governance record, and no raw PII is returned', async () => {
    const response = await executeStatutoryComplianceEngine({
      taskType: 'HIRA',
      siteContext: 'Site Alpha',
      hazards: `${VALID_HAZARDS} Contact 8801015029082 for follow-up.`,
    });
    expect(response.metadata.status).toBe('DRAFT');
    expect(response.metadata.humanReviewRequired).toBe(true);
    expect(response.metadata.governance?.policyVersion).toBe(GOVERNANCE_POLICY_VERSION);
    expect(response.metadata.governance?.reviewStatus).toBe('PENDING_REVIEW');
    expect(response.metadata.governance?.promptSha256).toMatch(/^[0-9a-f]{64}$/);
    expect(response.document).not.toContain('8801015029082');
    expect(response.document).not.toMatch(/all measures comply/i);
    expect(response.document).not.toContain('STATUTORY-VERIFIED');
  });
});

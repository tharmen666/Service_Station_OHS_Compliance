import { ALLOWED_TASK_TYPES, LIMITS, REDACTION_RULES } from './policy';

/** Thrown for requests that break policy. The HTTP layer maps `status` to the response code. */
export class GovernanceValidationError extends Error {
  readonly status = 400;
  readonly issues: string[];

  constructor(issues: string[]) {
    super(`Request rejected by governance policy: ${issues.join('; ')}`);
    this.name = 'GovernanceValidationError';
    this.issues = issues;
  }
}

export interface RedactionCounts {
  saId: number;
  phone: number;
  email: number;
}

export interface ValidatedStatutoryRequest {
  taskType: string;
  siteContext: string;
  hazards: string;
  redactions: RedactionCounts;
}

const DEFAULT_SITE_CONTEXT = 'Forecourt retail service station';
// Control characters other than tab, newline and carriage return.
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

/** Redacts PII before text leaves the server. Returns the cleaned text and counts of what was removed. */
export function redactPII(text: string): { text: string; counts: RedactionCounts } {
  const counts: RedactionCounts = { saId: 0, phone: 0, email: 0 };
  const cleaned = text
    .replace(REDACTION_RULES.saId, () => {
      counts.saId++;
      return '[REDACTED-ID]';
    })
    .replace(REDACTION_RULES.email, () => {
      counts.email++;
      return '[REDACTED-EMAIL]';
    })
    .replace(REDACTION_RULES.phone, () => {
      counts.phone++;
      return '[REDACTED-PHONE]';
    });
  return { text: cleaned, counts };
}

/**
 * Validates and sanitises an incoming statutory request.
 * Throws GovernanceValidationError on policy breach; never forwards unvalidated input.
 */
export function validateStatutoryRequest(input: unknown): ValidatedStatutoryRequest {
  const issues: string[] = [];

  if (!input || typeof input !== 'object') {
    throw new GovernanceValidationError(['Request body must be a JSON object']);
  }
  const raw = input as Record<string, unknown>;

  const taskType = typeof raw.taskType === 'string' ? raw.taskType.trim() : '';
  if (!(ALLOWED_TASK_TYPES as readonly string[]).includes(taskType)) {
    issues.push(`taskType must be one of: ${ALLOWED_TASK_TYPES.join(', ')}`);
  }

  const rawSite = raw.siteContext === undefined ? DEFAULT_SITE_CONTEXT : raw.siteContext;
  if (typeof rawSite !== 'string') {
    issues.push('siteContext must be a string');
  }

  const rawHazards = typeof raw.hazards === 'string' ? raw.hazards : '';
  if (typeof raw.hazards !== 'string') {
    issues.push('hazards must be a string');
  }

  const cleanHazards = rawHazards.replace(CONTROL_CHARS, '').trim();
  const cleanSite = typeof rawSite === 'string' ? rawSite.replace(CONTROL_CHARS, '').trim() : '';

  if (cleanHazards.length < LIMITS.hazardsMinChars) {
    issues.push(`hazards must be at least ${LIMITS.hazardsMinChars} characters describing the scope`);
  }
  if (cleanHazards.length > LIMITS.hazardsMaxChars) {
    issues.push(`hazards must be at most ${LIMITS.hazardsMaxChars} characters`);
  }
  if (cleanSite.length > LIMITS.siteContextMaxChars) {
    issues.push(`siteContext must be at most ${LIMITS.siteContextMaxChars} characters`);
  }

  if (issues.length > 0) {
    throw new GovernanceValidationError(issues);
  }

  const hazardsRedacted = redactPII(cleanHazards);
  const siteRedacted = redactPII(cleanSite || DEFAULT_SITE_CONTEXT);

  return {
    taskType,
    siteContext: siteRedacted.text,
    hazards: hazardsRedacted.text,
    redactions: {
      saId: hazardsRedacted.counts.saId + siteRedacted.counts.saId,
      phone: hazardsRedacted.counts.phone + siteRedacted.counts.phone,
      email: hazardsRedacted.counts.email + siteRedacted.counts.email,
    },
  };
}

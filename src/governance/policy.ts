/**
 * Governance policy for the AI-assisted statutory engine.
 * Bump GOVERNANCE_POLICY_VERSION whenever a rule below changes, and record the change in docs/GOVERNANCE.md.
 */
export const GOVERNANCE_POLICY_VERSION = '2026.11-1';

export const ALLOWED_TASK_TYPES = ['HIRA', 'SWP', 'Incident Root Cause', 'Toolbox Talk'] as const;
export type AllowedTaskType = (typeof ALLOWED_TASK_TYPES)[number];

export const LIMITS = {
  hazardsMaxChars: 2000,
  hazardsMinChars: 10,
  siteContextMaxChars: 200,
  requestBodyMaxBytes: 8 * 1024,
  rateLimitRequests: 10,
  rateLimitWindowMs: 10 * 60 * 1000,
} as const;

/** Claims the engine must never publish. Matches are removed and logged, not silently kept. */
export const FORBIDDEN_CLAIMS: ReadonlyArray<{ pattern: RegExp; reason: string }> = [
  { pattern: /zero[- ]hallucinat\w*/gi, reason: 'Unverifiable accuracy claim' },
  { pattern: /guarantee[ds]?\s+(to be\s+)?(legally\s+)?compliant/gi, reason: 'Guarantee of compliance' },
  { pattern: /\b100\s*%\s*(compliant|verified|audit\w*|audit-ready)/gi, reason: 'Absolute compliance claim' },
  { pattern: /legally\s+certified/gi, reason: 'Certification claim' },
  { pattern: /APPROVED\s*(&|and)\s*AUDIT-LOCKED/gi, reason: 'Approval status without a named reviewer' },
  { pattern: /STATUTORY-VERIFIED/gi, reason: 'Fabricated verification signature' },
  { pattern: /all measures comply/gi, reason: 'Unverified compliance declaration' },
];

/** The output must carry these markers. Missing markers are logged as issues. */
export const REQUIRED_MARKERS: ReadonlyArray<{ pattern: RegExp; issue: string }> = [
  { pattern: /\bDRAFT\b/, issue: 'Missing DRAFT status marker' },
  { pattern: /competent person|SHE Representative/i, issue: 'Missing reviewer requirement' },
  { pattern: /OHS Act|Regulations?|\bRegs?\b|SANS\s?\d|ISO\s?\d/i, issue: 'No statutory citation found' },
];

/** Regulators and bodies this engine references. Used for documentation and reviewer routing. */
export const REGULATORY_BODIES = [
  { body: 'Department of Employment and Labour (DEL)', covers: 'OHS Act 85 of 1993; incident reporting; inspections' },
  { body: 'Compensation Fund (COIDA)', covers: 'Compensation for occupational injuries and diseases; employer injury reports' },
  { body: 'Information Regulator', covers: 'POPIA Act 4 of 2013; personal information processing and transfers' },
  { body: 'SABS / SANS', covers: 'SANS 10089 petroleum handling; SANS 10263 spill readiness; SANS 20345 footwear' },
  { body: 'EWURA / SA fuel regulator', covers: 'Wetstock and fuel accounting obligations (confirm applicable regime per site)' },
] as const;

/** PII patterns redacted from any text before it is sent to a third-party model. */
export const REDACTION_RULES = {
  saId: /\b\d{13}\b/g,
  phone: /(?:\+27|0027|\b0)\s?\d{2}[\s-]?\d{3}[\s-]?\d{4}\b|\+\d{8,15}\b/g,
  email: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g,
} as const;

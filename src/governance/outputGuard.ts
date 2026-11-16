import { FORBIDDEN_CLAIMS, REQUIRED_MARKERS } from './policy';

export interface OutputCheckResult {
  /** The document after forbidden claims are removed and any governance notice is added. */
  document: string;
  /** Everything the check found. An empty list means no issues. */
  issues: string[];
}

const NOTICE_HEADER = '> **GOVERNANCE CHECK:** This draft was flagged by the automated policy check. Do not use it until a competent person has reviewed the flagged items below.';

/**
 * Checks AI-generated (or template) output against policy.
 * Removes forbidden claims rather than publishing them, and records each removal.
 */
export function checkStatutoryOutput(doc: string): OutputCheckResult {
  const issues: string[] = [];
  let cleaned = doc;

  for (const rule of FORBIDDEN_CLAIMS) {
    cleaned = cleaned.replace(rule.pattern, (match) => {
      // Record the reason only. Echoing the matched text would republish the claim in the notice.
      issues.push(`Removed forbidden claim: ${rule.reason}`);
      return '[claim removed by governance check]';
    });
  }

  for (const marker of REQUIRED_MARKERS) {
    if (!marker.pattern.test(cleaned)) {
      issues.push(marker.issue);
    }
  }

  if (issues.length === 0) {
    return { document: cleaned, issues };
  }

  return {
    document: `${NOTICE_HEADER}\n>\n${issues.map((i) => `> - ${i}`).join('\n')}\n\n${cleaned}`,
    issues,
  };
}

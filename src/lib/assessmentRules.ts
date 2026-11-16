/**
 * Single source of truth for assessment rules.
 * Used by the quiz (timer, scoring) and the certificate (pass/fail).
 */

/** Minimum share of questions answered correctly to be certified (60%). */
export const PASS_MARK = 0.6;

/** Seconds allowed per question. The timer resets for each question. */
export const SECONDS_PER_QUESTION = 60;

/** Seconds the correct answer stays visible after a timeout before moving on. */
export const TIMEOUT_REVEAL_SECONDS = 3;

/** Percentage (0–100) of correct answers, rounded. Returns 0 when there are no questions. */
export function scorePercent(correct: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((correct / total) * 100);
}

/** True only when the candidate meets the pass mark. */
export function hasPassed(correct: number, total: number): boolean {
  return total > 0 && correct / total >= PASS_MARK;
}

/** Certificate ID that is unique per issue (not persisted; see note in AuditCertificateModal). */
export function newCertificateId(now: Date = new Date()): string {
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `CERT-OHS-${yyyy}${mm}${dd}-${rand}`;
}

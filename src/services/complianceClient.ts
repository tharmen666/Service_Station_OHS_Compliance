import type { StatutoryComplianceRequest, StatutoryComplianceResponse } from '../api/compliance';

/**
 * Client-side bridge to the server-side statutory engine.
 * There is deliberately NO local fallback. A draft produced in the browser would bypass validation
 * and the audit store. If the server cannot produce a governed draft, the caller gets an error.
 */
export async function requestStatutoryComplianceDoc(
  request: StatutoryComplianceRequest
): Promise<StatutoryComplianceResponse> {
  let res: Response;
  try {
    res = await fetch('/api/compliance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
  } catch {
    throw new Error('The statutory engine could not be reached. No draft was produced.');
  }

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // Non-JSON error page (for example a platform error). Handled below.
  }

  if (res.ok && data?.success) {
    return data as StatutoryComplianceResponse;
  }

  const issues: string[] = Array.isArray(data?.issues) ? data.issues : [];
  const reason = data?.error || `Request failed with status ${res.status}.`;
  throw new Error(issues.length ? `${reason} ${issues.join('; ')}` : reason);
}

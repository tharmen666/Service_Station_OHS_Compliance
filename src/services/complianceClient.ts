import type { StatutoryComplianceRequest, StatutoryComplianceResponse } from '../api/compliance';

/**
 * Client-Side API Bridge to Server-Side Statutory Engine (/api/compliance).
 * Never ships API keys, system prompts, or model names in the client bundle.
 */
export async function requestStatutoryComplianceDoc(
  request: StatutoryComplianceRequest
): Promise<StatutoryComplianceResponse> {
  const res = await fetch('/api/compliance', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    throw new Error(`Compliance API returned HTTP ${res.status}`);
  }

  return await res.json();
}

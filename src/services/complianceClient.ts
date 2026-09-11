import type { StatutoryComplianceRequest, StatutoryComplianceResponse } from '../api/compliance';

/**
 * Client-Side API Bridge to Server-Side Statutory Engine
 */
export async function requestStatutoryComplianceDoc(
  request: StatutoryComplianceRequest
): Promise<StatutoryComplianceResponse> {
  try {
    const res = await fetch('/api/compliance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.success) {
        return data;
      }
    }
  } catch (err) {
    console.warn('[Compliance API Bridge Warning] Server endpoint fetch failed, loading local engine fallback:', err);
  }

  // Client-side execution fallback if backend endpoint unreachable
  const { executeStatutoryComplianceEngine } = await import('../api/compliance');
  return await executeStatutoryComplianceEngine(request);
}

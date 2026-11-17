import { executeStatutoryComplianceEngine } from '../src/api/compliance';
import { GovernanceValidationError } from '../src/governance/inputGuard';
import { LIMITS } from '../src/governance/policy';
import { AuditStoreUnavailableError, getAuditStore, hashClientKey } from './store';

function clientAddress(req: any): string {
  const fwd = req?.headers?.['x-forwarded-for'];
  const ip = (typeof fwd === 'string' ? fwd.split(',')[0] : undefined) || req?.socket?.remoteAddress || 'unknown';
  return String(ip).trim();
}

function send(res: any, status: number, payload: unknown) {
  if (res && typeof res.status === 'function') {
    return res.status(status).json(payload);
  }
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export default async function handler(req: any, res: any) {
  // Same-origin only: the app calls this route from its own domain, so no CORS headers are issued.
  if (req.method !== 'POST') {
    return send(res, 405, { success: false, error: 'Method Not Allowed' });
  }

  // Browser cross-site requests are refused. Requests with no Origin header (server-side tools) pass this check.
  // This is NOT authentication: any client can forge or omit Origin. Authentication is a separate open item.
  const origin = req?.headers?.origin;
  const host = req?.headers?.host;
  if (origin && host) {
    let originHost = '';
    try {
      originHost = new URL(origin).host;
    } catch {
      originHost = '';
    }
    if (originHost !== host) {
      return send(res, 403, { success: false, error: 'Cross-origin requests are not allowed' });
    }
  }

  try {
    // Store selection: PostgreSQL when DATABASE_URL is set (fails closed on error),
    // otherwise an ephemeral in-memory ledger that is labelled as such in every response.
    const store = getAuditStore();

    if (!(await store.allowRequest(await hashClientKey(clientAddress(req))))) {
      return send(res, 429, {
        success: false,
        error: `Rate limit reached: ${LIMITS.rateLimitRequests} requests per ${LIMITS.rateLimitWindowMs / 60000} minutes.`,
      });
    }

    let body = req.body;
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }

    const size = new TextEncoder().encode(JSON.stringify(body ?? {})).length;
    if (size > LIMITS.requestBodyMaxBytes) {
      return send(res, 413, { success: false, error: 'Request body too large' });
    }

    // No silent defaults: the governance layer validates every field and rejects bad input.
    const result = await executeStatutoryComplianceEngine(body);

    // Audit first. The draft is returned only after its record is written to the selected store.
    const recordId = globalThis.crypto.randomUUID();
    const governance = result.metadata.governance;
    if (governance) {
      governance.recordStore = store.mode;
      await store.writeAudit(recordId, governance);
      governance.recordId = recordId;
    }
    return send(res, 200, result);
  } catch (error: any) {
    if (error instanceof AuditStoreUnavailableError) {
      return send(res, 503, { success: false, error: error.message });
    }
    if (error instanceof GovernanceValidationError) {
      return send(res, 400, { success: false, error: error.message, issues: error.issues });
    }
    if (error instanceof SyntaxError) {
      return send(res, 400, { success: false, error: 'Request body must be valid JSON' });
    }
    console.error('[API /api/compliance Error]', error?.name || 'unknown');
    return send(res, 500, { success: false, error: 'Failed to process statutory compliance request' });
  }
}

import { executeStatutoryComplianceEngine } from '../src/api/compliance';
import { GovernanceValidationError } from '../src/governance/inputGuard';
import { LIMITS } from '../src/governance/policy';

/**
 * Per-client rate limit. In-memory: each serverless instance keeps its own counts, so this is a
 * brake on abuse, not a hard global limit. Use a shared store (e.g. Vercel KV) for a hard limit.
 */
const hits = new Map<string, number[]>();

function clientKey(req: any): string {
  const fwd = req?.headers?.['x-forwarded-for'];
  const ip = (typeof fwd === 'string' ? fwd.split(',')[0] : undefined) || req?.socket?.remoteAddress || 'unknown';
  return String(ip).trim();
}

function isRateLimited(key: string, now: number): boolean {
  const recent = (hits.get(key) || []).filter((t) => now - t < LIMITS.rateLimitWindowMs);
  if (recent.length >= LIMITS.rateLimitRequests) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  return false;
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

  if (isRateLimited(clientKey(req), Date.now())) {
    return send(res, 429, {
      success: false,
      error: `Rate limit reached: ${LIMITS.rateLimitRequests} requests per ${LIMITS.rateLimitWindowMs / 60000} minutes.`,
    });
  }

  try {
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
    return send(res, 200, result);
  } catch (error: any) {
    if (error instanceof GovernanceValidationError) {
      return send(res, 400, { success: false, error: error.message, issues: error.issues });
    }
    if (error instanceof SyntaxError) {
      return send(res, 400, { success: false, error: 'Request body must be valid JSON' });
    }
    console.error('[API /api/compliance Error]', error);
    return send(res, 500, { success: false, error: 'Failed to process statutory compliance request' });
  }
}

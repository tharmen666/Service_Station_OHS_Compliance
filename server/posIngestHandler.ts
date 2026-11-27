import { createHash } from 'node:crypto';
import { validateWebhookPayload } from '../src/lib/pos-ingestion-adapter';
import { reconcileShift } from '../src/lib/wetstock-engine';

function send(res: any, status: number, payload: unknown) {
  if (res && typeof res.status === 'function') {
    return res.status(status).json(payload);
  }
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function getHeader(req: any, name: string): string {
  const headers = req?.headers || {};
  const direct = headers[name] ?? headers[name.toLowerCase()];
  if (Array.isArray(direct)) return String(direct[0] || '').trim();
  return direct ? String(direct).trim() : '';
}

function isAuthorizedApiKey(apiKey: string, tenantId: string): { ok: boolean; authMode: 'configured-key' | 'sandbox-demo' } {
  if (!apiKey) return { ok: false, authMode: 'sandbox-demo' };

  const configuredJson = process.env.POS_INGEST_API_KEYS;
  const singleConfiguredKey = process.env.POS_INGEST_API_KEY;

  if (configuredJson) {
    try {
      const map = JSON.parse(configuredJson) as Record<string, string>;
      if (map[tenantId] && map[tenantId] === apiKey) {
        return { ok: true, authMode: 'configured-key' };
      }
      return { ok: false, authMode: 'configured-key' };
    } catch {
      return { ok: false, authMode: 'configured-key' };
    }
  }

  if (singleConfiguredKey) {
    return { ok: apiKey === singleConfiguredKey, authMode: 'configured-key' };
  }

  // Sandbox/Demo fallback when no production API key env var is configured
  const expectedDemoKey = `DEMO-POS-KEY-${(tenantId || 'STN-ALPHA').toUpperCase()}`;
  if (apiKey === expectedDemoKey || apiKey === 'DEMO-POS-KEY-STN-ALPHA') {
    return { ok: true, authMode: 'sandbox-demo' };
  }
  return { ok: false, authMode: 'sandbox-demo' };
}

export default async function posIngestHandler(req: any, res: any) {
  if (req.method !== 'POST') {
    return send(res, 405, { success: false, error: 'Method Not Allowed. Use POST.' });
  }

  const tenantId = getHeader(req, 'x-tenant-id') || 'STN-ALPHA';
  const bearer = getHeader(req, 'authorization').replace(/^Bearer\s+/i, '').trim();
  const apiKey = getHeader(req, 'x-api-key') || bearer;

  const auth = isAuthorizedApiKey(apiKey, tenantId);
  if (!auth.ok) {
    return send(res, 401, {
      success: false,
      error: 'Unauthorized: valid x-api-key (or Bearer token) for tenant is required.',
    });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      body = body.trim() ? JSON.parse(body) : {};
    }

    const validation = validateWebhookPayload(body);
    if (!validation.valid || !validation.payload) {
      return send(res, 400, {
        success: false,
        error: 'Invalid POS shift ingestion payload.',
        errors: validation.errors,
      });
    }

    const canonicalPayload = {
      ...validation.payload,
      siteCode: tenantId || validation.payload.siteCode,
    };
    const reconciliation = reconcileShift(canonicalPayload);
    const sha256Digest = createHash('sha256')
      .update(JSON.stringify({ canonicalPayload, reconciliation }))
      .digest('hex');

    return send(res, 200, {
      success: true,
      ingestionId: canonicalPayload.ingestionId,
      tenantId: canonicalPayload.siteCode,
      authMode: auth.authMode,
      sha256Digest,
      receivedAt: new Date().toISOString(),
      payload: canonicalPayload,
      reconciliation,
    });
  } catch (err: any) {
    if (err instanceof SyntaxError) {
      return send(res, 400, { success: false, error: 'Request body must be valid JSON.' });
    }
    return send(res, 500, {
      success: false,
      error: 'Failed to process POS shift ingestion payload.',
    });
  }
}


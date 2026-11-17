import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { allowRequest, writeAuditRecord, withDb, hashClientKey, getDb, AuditStoreUnavailableError, type Queryable } from '../server/store';
import handler from '../server/handler';
import { LIMITS } from '../src/governance/policy';

// Pure logic and fail-closed behaviour. Runs once, on chromium, with no database.
test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'store tests run once on chromium');
});

/** In-memory fake of the three queries the store issues. */
function fakeDb(): Queryable & { rows: { key: string; at: number }[]; inserts: unknown[][] } {
  const state = { rows: [] as { key: string; at: number }[], inserts: [] as unknown[][] };
  return Object.assign(
    {
      async query(text: string, values: unknown[] = []) {
        if (text.startsWith('DELETE FROM rate_hits')) return { rows: [], rowCount: 0 };
        if (text.includes('count(*)')) {
          const n = state.rows.filter((r) => r.key === values[0]).length;
          return { rows: [{ n }], rowCount: 1 };
        }
        if (text.startsWith('INSERT INTO rate_hits')) {
          state.rows.push({ key: String(values[0]), at: Date.now() });
          return { rows: [], rowCount: 1 };
        }
        if (text.startsWith('INSERT INTO audit_records')) {
          state.inserts.push(values);
          return { rows: [], rowCount: 1 };
        }
        throw new Error('unexpected query in test');
      },
    },
    state
  );
}

test.describe('Store: rate limit', () => {
  test('allows the configured number of requests per client, then refuses', async () => {
    const db = fakeDb();
    const key = await hashClientKey('203.0.113.7');
    for (let i = 0; i < LIMITS.rateLimitRequests; i++) {
      expect(await allowRequest(db, key)).toBe(true);
    }
    expect(await allowRequest(db, key)).toBe(false);
  });

  test('one client does not consume another client’s allowance', async () => {
    const db = fakeDb();
    const a = await hashClientKey('203.0.113.7');
    const b = await hashClientKey('198.51.100.9');
    for (let i = 0; i < LIMITS.rateLimitRequests; i++) await allowRequest(db, a);
    expect(await allowRequest(db, b)).toBe(true);
  });

  test('rate-limit keys are hashes: the raw address never appears', async () => {
    const key = await hashClientKey('203.0.113.7');
    expect(key).toMatch(/^[0-9a-f]{64}$/);
    expect(key).not.toContain('203.0.113.7');
  });
});

test.describe('Store: audit records', () => {
  test('writes hashes, counts and status only, with the expected parameters', async () => {
    const db = fakeDb();
    await writeAuditRecord(db, '00000000-0000-4000-8000-000000000042', {
      policyVersion: '2026.11-1',
      generatedAt: '2026-11-17T10:00:00.000Z',
      taskType: 'HIRA',
      engine: 'template',
      modelId: null,
      promptSha256: 'a'.repeat(64),
      outputSha256: 'b'.repeat(64),
      redactions: { saId: 1, phone: 0, email: 0 },
      issues: ['Missing DRAFT status marker'],
      reviewRequired: true,
      reviewStatus: 'PENDING_REVIEW',
    });
    expect(db.inserts).toHaveLength(1);
    const values = db.inserts[0];
    expect(values).toHaveLength(11);
    expect(values[0]).toBe('00000000-0000-4000-8000-000000000042');
    expect(values[10]).toBe('PENDING_REVIEW');
    // The stored record must not contain any raw text from the request.
    expect(JSON.stringify(values)).not.toContain('Dispenser');
  });

  test('a failing database becomes AuditStoreUnavailableError without leaking the driver message', async () => {
    const broken: Queryable = {
      async query() {
        throw new Error('password authentication failed for user ohs_app at 10.0.0.5');
      },
    };
    try {
      await withDb(broken, (d) => d.query('SELECT 1'));
      throw new Error('expected failure');
    } catch (err) {
      expect(err).toBeInstanceOf(AuditStoreUnavailableError);
      expect((err as Error).message).not.toContain('password');
      expect((err as Error).message).not.toContain('10.0.0.5');
    }
  });
});

test.describe('Store: fail closed', () => {
  test('without DATABASE_URL, the handler returns 503 and produces no draft', async () => {
    const saved = process.env.DATABASE_URL;
    delete process.env.DATABASE_URL;
    try {
      expect(() => getDb()).toThrow(AuditStoreUnavailableError);

      let status = 0;
      let payload: any = null;
      const res = {
        status(code: number) {
          status = code;
          return this;
        },
        json(body: unknown) {
          payload = body;
          return this;
        },
      };
      await handler(
        { method: 'POST', headers: {}, body: { taskType: 'HIRA', hazards: 'Dispenser hose rupture and fuel splash.' } },
        res
      );
      expect(status).toBe(503);
      expect(payload.success).toBe(false);
      expect(payload.document).toBeUndefined();
    } finally {
      if (saved !== undefined) process.env.DATABASE_URL = saved;
    }
  });
});

test.describe('Store: migration privileges', () => {
  test('the application role cannot update or delete audit records', () => {
    const sql = readFileSync(join(process.cwd(), 'db', 'migrations', '001_governance.sql'), 'utf8');
    const grants = sql.split('\n').filter((l) => l.startsWith('GRANT'));
    const auditGrant = grants.find((l) => l.includes('audit_records'));
    expect(auditGrant).toBeDefined();
    expect(auditGrant).not.toMatch(/UPDATE|DELETE/);
    expect(sql).toContain('BEFORE UPDATE OR DELETE ON audit_records');
  });
});

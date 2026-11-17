import pg from 'pg';
import { LIMITS } from '../src/governance/policy';
import type { RedactionCounts } from '../src/governance/inputGuard';
import type { GovernanceRecord } from '../src/governance/audit';
import { hashAuditSignature } from '../src/popiActCompliance';

/** Minimal query interface, so tests can inject a fake. The real implementation is a pg Pool. */
export interface Queryable {
  query: (text: string, values?: unknown[]) => Promise<{ rows: any[]; rowCount: number | null }>;
}

/** Thrown when the database is missing or unreachable. Callers must fail closed on this. */
export class AuditStoreUnavailableError extends Error {
  readonly status = 503;
  constructor(message: string) {
    super(message);
    this.name = 'AuditStoreUnavailableError';
  }
}

let pool: pg.Pool | null = null;

/** Lazily creates one small pool per function instance. Reads DATABASE_URL from the server environment only. */
export function getDb(): Queryable {
  if (pool) return pool;
  const url = typeof process !== 'undefined' ? process.env.DATABASE_URL : undefined;
  if (!url) {
    throw new AuditStoreUnavailableError('Governance store is not configured (DATABASE_URL is missing).');
  }
  pool = new pg.Pool({ connectionString: url, max: 2, idleTimeoutMillis: 10000, connectionTimeoutMillis: 5000 });
  pool.on('error', (err) => console.error('[governance-store] idle client error', err.message));
  return pool;
}

/** Fails closed: any database error becomes an AuditStoreUnavailableError with no detail leaked to the client. */
export async function withDb<T>(db: Queryable, fn: (db: Queryable) => Promise<T>): Promise<T> {
  try {
    return await fn(db);
  } catch (err: any) {
    if (err instanceof AuditStoreUnavailableError) throw err;
    console.error('[governance-store] query failed', err?.code || err?.name);
    throw new AuditStoreUnavailableError('Governance store is unavailable. No draft was produced.');
  }
}

/**
 * Sliding-window rate limit in the database. Returns true if the request is allowed and records it.
 * Old rows are pruned for this client as part of the check.
 */
export async function allowRequest(db: Queryable, clientKeySha256: string): Promise<boolean> {
  return withDb(db, async (d) => {
    await d.query(
      `DELETE FROM rate_hits WHERE client_key_sha256 = $1 AND hit_at < now() - ($2::int * interval '1 millisecond')`,
      [clientKeySha256, LIMITS.rateLimitWindowMs]
    );
    const count = await d.query(
      `SELECT count(*)::int AS n FROM rate_hits WHERE client_key_sha256 = $1`,
      [clientKeySha256]
    );
    const n = Number(count.rows[0]?.n ?? 0);
    if (n >= LIMITS.rateLimitRequests) return false;
    await d.query(`INSERT INTO rate_hits (client_key_sha256) VALUES ($1)`, [clientKeySha256]);
    return true;
  });
}

/** Writes one audit record. Contains hashes and counts only. Throws if the write fails. */
export async function writeAuditRecord(
  db: Queryable,
  id: string,
  record: GovernanceRecord
): Promise<void> {
  await withDb(db, (d) =>
    d.query(
      `INSERT INTO audit_records
        (id, created_at, policy_version, task_type, engine, model_id, prompt_sha256, output_sha256, redactions, issues, review_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        id,
        record.generatedAt,
        record.policyVersion,
        record.taskType,
        record.engine,
        record.modelId,
        record.promptSha256,
        record.outputSha256,
        JSON.stringify(record.redactions as RedactionCounts),
        JSON.stringify(record.issues),
        record.reviewStatus,
      ]
    )
  );
}

/** Hash of the client address, so the database never holds a raw IP address. */
export async function hashClientKey(raw: string): Promise<string> {
  const digest = await globalThis.crypto.subtle.digest('SHA-256', new TextEncoder().encode(`ohs-rl:${raw}`));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

// ---------------------------------------------------------------------------
// Store selection
//
// PostgreSQL is the durable store and is used whenever DATABASE_URL is set. Failures fail closed (503).
// When DATABASE_URL is NOT set, an in-memory ledger is used so the app can run before the database
// exists. Its records are EPHEMERAL: they are lost when the function instance restarts, they are not
// shared between instances, and they are not an audit trail. Every response labels this in
// metadata.governance.recordStore, and the UI shows it. Replace it before real client data is processed.
// ---------------------------------------------------------------------------

export type RecordStoreMode = 'postgres' | 'memory-ephemeral';

export interface AuditStore {
  readonly mode: RecordStoreMode;
  allowRequest(clientKeySha256: string): Promise<boolean>;
  writeAudit(id: string, record: GovernanceRecord): Promise<void>;
}

class PostgresAuditStore implements AuditStore {
  readonly mode = 'postgres' as const;
  constructor(private readonly db: Queryable) {}
  allowRequest(key: string) {
    return allowRequest(this.db, key);
  }
  writeAudit(id: string, record: GovernanceRecord) {
    return writeAuditRecord(this.db, id, record);
  }
}

export interface LedgerEntry {
  readonly id: string;
  readonly record: Readonly<GovernanceRecord>;
  readonly prevHash: string;
  readonly entryHash: string;
}

function deepFreeze<T>(value: T): T {
  if (value && typeof value === 'object') {
    Object.values(value as Record<string, unknown>).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
}

/**
 * Ephemeral, hash-chained, append-only ledger held in memory.
 * Each entry's hash covers the previous entry's hash, so any edit to history breaks the chain.
 * Entries are frozen, so the running process cannot change them.
 */
export class InMemoryAuditStore implements AuditStore {
  readonly mode = 'memory-ephemeral' as const;
  private readonly hits = new Map<string, number[]>();
  private readonly entries: LedgerEntry[] = [];
  private lastHash = 'GENESIS';

  async allowRequest(clientKeySha256: string): Promise<boolean> {
    const now = Date.now();
    const recent = (this.hits.get(clientKeySha256) || []).filter((t) => now - t < LIMITS.rateLimitWindowMs);
    if (recent.length >= LIMITS.rateLimitRequests) {
      this.hits.set(clientKeySha256, recent);
      return false;
    }
    recent.push(now);
    this.hits.set(clientKeySha256, recent);
    return true;
  }

  async writeAudit(id: string, record: GovernanceRecord): Promise<void> {
    const frozenRecord = deepFreeze(JSON.parse(JSON.stringify(record)) as GovernanceRecord);
    const prevHash = this.lastHash;
    const entryHash = await hashAuditSignature(JSON.stringify({ id, record: frozenRecord, prevHash }));
    this.entries.push(Object.freeze({ id, record: frozenRecord, prevHash, entryHash }));
    this.lastHash = entryHash;
  }

  /** Read-only view for tests and diagnostics. */
  snapshot(): readonly LedgerEntry[] {
    return [...this.entries];
  }
}

let memoryStore: InMemoryAuditStore | null = null;
let pgStore: PostgresAuditStore | null = null;

/** Chooses the store from the environment. Read on every call, so tests can change the variable. */
export function getAuditStore(): AuditStore {
  const url = typeof process !== 'undefined' ? process.env.DATABASE_URL?.trim() : '';
  if (url) {
    if (!pgStore) pgStore = new PostgresAuditStore(getDb());
    return pgStore;
  }
  if (!memoryStore) memoryStore = new InMemoryAuditStore();
  return memoryStore;
}

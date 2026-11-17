import { hashAuditSignature } from '../popiActCompliance';
import { GOVERNANCE_POLICY_VERSION } from './policy';
import type { RedactionCounts } from './inputGuard';

/**
 * One governance record per generated document. Contains hashes and counts only,
 * never the personal information itself, so it is safe to keep in an audit trail.
 */
export interface GovernanceRecord {
  policyVersion: string;
  generatedAt: string;
  taskType: string;
  engine: 'live-model' | 'template';
  modelId: string | null;
  promptSha256: string;
  outputSha256: string;
  redactions: RedactionCounts;
  issues: string[];
  reviewRequired: true;
  reviewStatus: 'PENDING_REVIEW';
  /** Set by the server after the record is written to the audit store. */
  recordId?: string;
  /** Where the record lives: durable PostgreSQL, or an ephemeral in-memory ledger (not an audit trail). */
  recordStore?: 'postgres' | 'memory-ephemeral';
}

export async function buildGovernanceRecord(params: {
  taskType: string;
  engine: 'live-model' | 'template';
  modelId: string | null;
  prompt: string;
  output: string;
  redactions: RedactionCounts;
  issues: string[];
}): Promise<GovernanceRecord> {
  return {
    policyVersion: GOVERNANCE_POLICY_VERSION,
    generatedAt: new Date().toISOString(),
    taskType: params.taskType,
    engine: params.engine,
    modelId: params.modelId,
    promptSha256: await hashAuditSignature(params.prompt),
    outputSha256: await hashAuditSignature(params.output),
    redactions: params.redactions,
    issues: params.issues,
    reviewRequired: true,
    reviewStatus: 'PENDING_REVIEW',
  };
}

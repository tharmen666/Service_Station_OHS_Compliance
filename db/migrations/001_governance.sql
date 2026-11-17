-- Governance store: append-only audit records and a request rate limit.
-- Run once as the OWNER role (see docs/DATABASE.md). The application connects as ohs_app,
-- which has only the privileges granted at the bottom of this file.

CREATE TABLE IF NOT EXISTS audit_records (
  id              uuid        PRIMARY KEY,
  created_at      timestamptz NOT NULL DEFAULT now(),
  policy_version  text        NOT NULL,
  task_type       text        NOT NULL,
  engine          text        NOT NULL CHECK (engine IN ('live-model', 'template')),
  model_id        text,
  prompt_sha256   text        NOT NULL CHECK (prompt_sha256 ~ '^[0-9a-f]{64}$'),
  output_sha256   text        NOT NULL CHECK (output_sha256 ~ '^[0-9a-f]{64}$'),
  redactions      jsonb       NOT NULL,
  issues          jsonb       NOT NULL,
  review_status   text        NOT NULL DEFAULT 'PENDING_REVIEW'
);

CREATE INDEX IF NOT EXISTS audit_records_created_at_idx ON audit_records (created_at);

-- Append-only: UPDATE and DELETE are refused even for roles that somehow hold them.
CREATE OR REPLACE FUNCTION audit_records_block_change() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'audit_records is append-only';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS audit_records_no_update ON audit_records;
CREATE TRIGGER audit_records_no_update
  BEFORE UPDATE OR DELETE ON audit_records
  FOR EACH ROW EXECUTE FUNCTION audit_records_block_change();

-- Rate limit: one row per request. Client keys are SHA-256 hashes, never raw IP addresses.
CREATE TABLE IF NOT EXISTS rate_hits (
  client_key_sha256 text        NOT NULL CHECK (client_key_sha256 ~ '^[0-9a-f]{64}$'),
  hit_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS rate_hits_key_time_idx ON rate_hits (client_key_sha256, hit_at);

-- Application role. Create it once as owner, with a password you set outside this file:
--   CREATE ROLE ohs_app LOGIN PASSWORD '<set-in-your-password-manager>';
-- Then grant only what the app needs:
GRANT USAGE ON SCHEMA public TO ohs_app;
GRANT SELECT, INSERT ON audit_records TO ohs_app;
GRANT SELECT, INSERT, DELETE ON rate_hits TO ohs_app;

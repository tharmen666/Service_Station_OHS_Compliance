# Governance Database Setup

The governance store holds two things: append-only **audit records** (one per generated draft) and a **rate-limit** table. It uses PostgreSQL. Nothing is stored that identifies a person: client addresses are hashed, and personal information is redacted before a draft is generated.

If `DATABASE_URL` is missing or the database is unreachable, the API returns **503** and produces no draft. This is deliberate: a draft without an audit record is not allowed.

## Choice of provider

Use a managed PostgreSQL in the region closest to the functions (they run in Vercel's `cpt1` region, Cape Town). Record the provider and region as a sub-processor in the operator agreement. If the provider stores data outside South Africa, document the POPIA s72 transfer condition relied on.

Confirm before you choose: backups and their retention, point-in-time recovery, and the deletion process when a client leaves.

## Steps (one time)

1. **Create the database** with your provider. You will get an owner connection string.
2. **Create the application role** as owner. Choose the password in your password manager. Do not paste it into chat or into a file in the repo.

   ```sql
   CREATE ROLE ohs_app LOGIN PASSWORD '<set-in-password-manager>';
   ```

3. **Apply the migration** with the owner connection string, from the repo root:

   ```bash
   OWNER_DATABASE_URL="<owner connection string>" npm run db:migrate
   ```

4. **Give the app its connection string.** Build it from the `ohs_app` role and add it in Vercel as an environment variable named `DATABASE_URL`, for Production and Preview. Do not add it to any `VITE_` variable, because those are published to the browser.

5. **Redeploy** so the new variable takes effect.

## What the application role can do

| Table | Privileges | Why |
|---|---|---|
| `audit_records` | SELECT, INSERT | Records are written and read. They cannot be changed. |
| `rate_hits` | SELECT, INSERT, DELETE | The rate limit counts recent requests and removes old rows. |

A trigger on `audit_records` also refuses UPDATE and DELETE, even for a role that has them. The owner role can still alter the schema, so keep owner credentials out of the application and limit who holds them.

## Checks after setup

- A valid request returns 200 with `metadata.governance.recordId`.
- A database outage returns 503 with no draft.
- `SELECT count(*) FROM audit_records;` increases by one for each draft.
- Running `UPDATE audit_records SET ...` as `ohs_app` fails.

## Not yet covered

- Retention and deletion schedule for audit records. This must match the operator agreement and the record-keeping duties in the OHS and COIDA rules. It is not automated yet.
- Reviewer sign-off is recorded in the browser export, not yet on the server. The next step is a server endpoint that records the named reviewer against the `recordId`.

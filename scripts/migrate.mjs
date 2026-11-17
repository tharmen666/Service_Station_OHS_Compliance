// Applies db/migrations/*.sql in order. Run with the OWNER connection string, never the app role.
// Usage: OWNER_DATABASE_URL="postgres://..." node scripts/migrate.mjs
import pg from 'pg';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const url = process.env.OWNER_DATABASE_URL;
if (!url) {
  console.error('OWNER_DATABASE_URL is not set. Use the owner role, not ohs_app.');
  process.exit(1);
}
const client = new pg.Client({ connectionString: url });
await client.connect();
try {
  const dir = join(process.cwd(), 'db', 'migrations');
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.sql')).sort()) {
    await client.query('BEGIN');
    try {
      await client.query(readFileSync(join(dir, file), 'utf8'));
      await client.query('COMMIT');
      console.log('applied', file);
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('failed', file, err.message);
      process.exit(1);
    }
  }
} finally {
  await client.end();
}

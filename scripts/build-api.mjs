// Bundles the serverless handler into one self-contained file for Vercel.
// Vercel runs API functions as native ES modules, which cannot resolve extensionless
// relative imports across src/. Bundling removes that dependency on Node's resolver.
import { build } from 'esbuild';

await build({
  entryPoints: ['server/handler.ts'],
  outfile: 'api/compliance.js',
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node20',
  logLevel: 'info',
});

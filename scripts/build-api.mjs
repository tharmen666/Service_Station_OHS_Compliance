// Bundles the serverless handlers into self-contained files for Vercel.
// Vercel runs API functions as native ES modules, which cannot resolve extensionless
// relative imports across src/. Bundling removes that dependency on Node's resolver.
import { build } from 'esbuild';

const sharedBanner = {
  js: "import { createRequire as __createRequire } from 'node:module'; const require = __createRequire(import.meta.url);",
};

await build({
  entryPoints: ['server/handler.ts'],
  outfile: 'api/compliance.js',
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node20',
  logLevel: 'info',
  // pg is CommonJS and calls require() for Node built-ins (events, net, tls). In an ESM bundle those
  // dynamic requires fail unless a real require is provided. createRequire supplies it.
  banner: sharedBanner,
});

await build({
  entryPoints: ['server/posIngestHandler.ts'],
  outfile: 'api/v1/pos/shift-ingest.js',
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node20',
  logLevel: 'info',
  banner: sharedBanner,
});

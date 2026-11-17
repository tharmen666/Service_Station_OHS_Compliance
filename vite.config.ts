import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// Local dev runs the same handler as production (server/handler.ts), so governance behaves identically.
// It needs DATABASE_URL in the local environment, or it returns 503 and no draft.
function complianceApiPlugin(): Plugin {
  return {
    name: 'compliance-api-plugin',
    configureServer(server) {
      server.middlewares.use('/api/compliance', async (req, res) => {
        let bodyStr = '';
        req.on('data', (chunk) => {
          bodyStr += chunk;
        });
        req.on('end', async () => {
          try {
            const mod = await server.ssrLoadModule('/server/handler.ts');
            const fakeRes = {
              statusCode: 200,
              status(code: number) {
                this.statusCode = code;
                return this;
              },
              json(payload: unknown) {
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = this.statusCode;
                res.end(JSON.stringify(payload));
                return this;
              },
            };
            await mod.default(
              { method: req.method, headers: req.headers, body: bodyStr, socket: req.socket },
              fakeRes
            );
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: 'Development server could not load the statutory engine.' }));
            console.error('[dev compliance api]', err?.name || 'unknown');
          }
        });
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), complianceApiPlugin()],
  server: {
    port: 3000,
    strictPort: true,
    host: true
  }
})

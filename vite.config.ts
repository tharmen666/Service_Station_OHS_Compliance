import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'

function complianceApiPlugin(): Plugin {
  return {
    name: 'compliance-api-plugin',
    configureServer(server) {
      server.middlewares.use('/api/compliance', async (req, res, next) => {
        if (req.method === 'POST') {
          let bodyStr = '';
          req.on('data', (chunk) => {
            bodyStr += chunk;
          });
          req.on('end', async () => {
            try {
              const body = bodyStr ? JSON.parse(bodyStr) : {};
              const { executeStatutoryComplianceEngine } = await server.ssrLoadModule('/src/api/compliance.ts');
              const result = await executeStatutoryComplianceEngine(body);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify(result));
            } catch (err: any) {
              // Mirror api/compliance.ts: governance rejections are 400 with the list of issues.
              const isPolicy = err?.name === 'GovernanceValidationError';
              res.statusCode = isPolicy ? 400 : err instanceof SyntaxError ? 400 : 500;
              res.end(JSON.stringify(
                isPolicy
                  ? { success: false, error: err.message, issues: err.issues }
                  : { success: false, error: err instanceof SyntaxError ? 'Request body must be valid JSON' : 'Failed to process statutory compliance request' }
              ));
            }
          });
        } else {
          next();
        }
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


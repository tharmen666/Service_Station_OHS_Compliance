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
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: err?.message || 'Server error' }));
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


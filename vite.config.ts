import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { executeStatutoryComplianceEngine } from './api/compliance';
import { processNellyQuery } from './api/nelly';

function attachApiRoutes(middlewares: any) {
  middlewares.use('/api/compliance', (req: any, res: any, next: any) => {
    if (req.method === 'POST') {
      let bodyStr = '';
      req.on('data', (chunk: any) => {
        bodyStr += chunk;
      });
      req.on('end', async () => {
        try {
          const body = bodyStr ? JSON.parse(bodyStr) : {};
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

  middlewares.use('/api/nelly', (req: any, res: any, next: any) => {
    if (req.method === 'POST') {
      let bodyStr = '';
      req.on('data', (chunk: any) => {
        bodyStr += chunk;
      });
      req.on('end', async () => {
        try {
          const body = bodyStr ? JSON.parse(bodyStr) : {};
          const result = await processNellyQuery(body);
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(JSON.stringify(result));
        } catch (err: any) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: err?.message || 'Nelly server error' }));
        }
      });
    } else {
      next();
    }
  });
}

function backendApiPlugin(): Plugin {
  return {
    name: 'forecourt-backend-api-plugin',
    configureServer(server) {
      attachApiRoutes(server.middlewares);
    },
    configurePreviewServer(server) {
      attachApiRoutes(server.middlewares);
    },
  };
}

export default defineConfig({
  plugins: [react(), backendApiPlugin()],
  server: {
    port: 3000,
    strictPort: true,
    host: true,
  },
});

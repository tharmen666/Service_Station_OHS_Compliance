import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import complianceHandler from './server/handler';
import { processNellyQuery } from './api/nelly';

function attachApiMiddlewares(middlewares: any) {
  middlewares.use('/api/compliance', (req: any, res: any, next: any) => {
    if (req.method === 'POST' || req.method === 'GET' || req.method === 'OPTIONS') {
      let bodyStr = '';
      req.on('data', (chunk: any) => {
        bodyStr += chunk;
      });
      req.on('end', async () => {
        try {
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
          await complianceHandler(
            { method: req.method, headers: req.headers, body: bodyStr, socket: req.socket },
            fakeRes
          );
        } catch (err: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              success: false,
              error: 'Development server could not load the statutory engine.',
            })
          );
          console.error('[compliance api]', err?.name || 'unknown');
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
          res.setHeader('Content-Type', 'application/json');
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
      attachApiMiddlewares(server.middlewares);
    },
    configurePreviewServer(server) {
      attachApiMiddlewares(server.middlewares);
    },
  };
}

export default defineConfig({
  plugins: [react(), backendApiPlugin()],
  server: {
    port: 3000,
    strictPort: true,
    host: true
  }
})

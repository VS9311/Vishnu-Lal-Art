import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { onRequestPost as enquire } from './functions/api/artwork-enquiry.js'
import { onRequestPost as purchase } from './functions/api/purchase-request.js'

function localEnquiries(env) {
  return {
    name: 'local-enquiries',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const handler = { '/api/artwork-enquiry': enquire, '/api/purchase-request': purchase }[req.url];
        if (!handler) return next();
        if (!env.RESEND_API_KEY || !env.PURCHASE_FROM_EMAIL) {
          res.writeHead(503, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Email sending is not connected in this local preview. You can continue on WhatsApp, or use the hosted website once this update is published.' }));
          return;
        }
        try {
          const origin = 'http://' + req.headers.host;
          const request = new Request(origin + req.url, {
            method: req.method, headers: req.headers,
            ...(req.method === 'POST' ? { body: req, duplex: 'half' } : {}),
          });
          const response = req.method === 'POST'
            ? await handler({ request, env })
            : Response.json({ error: 'Method not allowed.' }, { status: 405 });
          res.writeHead(response.status, Object.fromEntries(response.headers));
          res.end(await response.text());
        } catch {
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Unable to send your enquiry. Please try again.' }));
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), localEnquiries({ ...loadEnv(mode, process.cwd(), ''), ...process.env })],
  server: {
    watch: {
      ignored: ['**/archive-masters/**', '**/screenshots archive website/**', '**/website screenshots malayalam 1/**', '**/Review-Screenshots/**']
    }
  }
}))


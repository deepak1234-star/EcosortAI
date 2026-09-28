import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'vite-plugin-gemini-classify',
        configureServer(server) {
          server.middlewares.use('/api/classify', async (req, res, next) => {
            if (req.method === 'OPTIONS') {
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
              res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-gemini-api-key');
              res.statusCode = 204;
              res.end();
              return;
            }

            if (req.method !== 'POST') {
              return next();
            }

            let body = '';
            req.on('data', (chunk) => {
              body += chunk;
            });

            req.on('end', async () => {
              try {
                const parsed = JSON.parse(body || '{}');
                const imagePayload = parsed.image || parsed.imageBase64 || parsed.base64 || parsed.data;

                if (!imagePayload) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.setHeader('Access-Control-Allow-Origin', '*');
                  res.end(JSON.stringify({ error: 'Missing base64 image payload in request body' }));
                  return;
                }

                // Dynamically load the TypeScript classifier module via Vite's ssrLoadModule
                const { classifyWasteImage } = await server.ssrLoadModule('./src/services/geminiClassifier.ts');
                const customApiKey =
                  req.headers['x-gemini-api-key'] ||
                  parsed.apiKey ||
                  process.env.GEMINI_API_KEY ||
                  process.env.VITE_GEMINI_API_KEY ||
                  env.GEMINI_API_KEY ||
                  env.VITE_GEMINI_API_KEY;

                const model = parsed.model || 'gemini-3-flash';

                const result = await classifyWasteImage({
                  imageBase64: imagePayload,
                  apiKey: typeof customApiKey === 'string' ? customApiKey : undefined,
                  model
                });

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.end(
                  JSON.stringify({
                    category: result.category,
                    confidence: result.confidence,
                    item_name: result.item_name,
                    dos_and_donts: result.dos_and_donts,
                    lifespan: result.lifespan,
                    model_used: result.modelUsed
                  })
                );
              } catch (err: any) {
                console.error('Vite /api/classify middleware error:', err);
                const isApiKeyError = err?.message?.includes('GEMINI_API_KEY') || err?.message?.includes('API key');
                res.statusCode = isApiKeyError ? 401 : 500;
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.end(
                  JSON.stringify({
                    error: err?.message || 'Classification failed',
                    is_key_missing: isApiKeyError
                  })
                );
              }
            });
          });
        }
      }
    ]
  };
});

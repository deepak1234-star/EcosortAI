import type { IncomingMessage, ServerResponse } from 'http';
import { classifyWasteImage } from '../src/services/geminiClassifier';

export default async function handler(req: any, res: any) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-gemini-api-key');
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
    return;
  }

  try {
    const body = req.body || {};
    const imagePayload = body.image || body.imageBase64 || body.base64 || body.data;

    if (!imagePayload) {
      res.status(400).json({
        error: 'Missing base64 image payload in request body'
      });
      return;
    }

    const customApiKey = req.headers['x-gemini-api-key'] || body.apiKey;
    const model = body.model || 'gemini-1.5-flash';

    const result = await classifyWasteImage({
      imageBase64: imagePayload,
      apiKey: typeof customApiKey === 'string' ? customApiKey : undefined,
      model
    });

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json({
      category: result.category,
      confidence: result.confidence,
      item_name: result.item_name,
      dos_and_donts: result.dos_and_donts,
      lifespan: result.lifespan,
      model_used: result.modelUsed
    });
  } catch (error: any) {
    console.error('API /api/classify error:', error);
    const isApiKeyError = error?.message?.includes('GEMINI_API_KEY') || error?.message?.includes('API key');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(isApiKeyError ? 401 : 500).json({
      error: error?.message || 'Classification failed',
      is_key_missing: isApiKeyError
    });
  }
}

import { classifyWasteImage } from '../../../src/services/geminiClassifier';

/**
 * Next.js App Router Route Handler (POST /api/classify)
 * Accepts a base64 image payload, queries gemini-3-flash with structured JSON output,
 * and returns waste category, confidence, item_name, dos_and_donts, and lifespan.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const imagePayload = body.image || body.imageBase64 || body.base64 || body.data;

    if (!imagePayload) {
      return new Response(
        JSON.stringify({
          error: 'Missing base64 image payload in request body. Provide "image", "imageBase64", or "base64".'
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    const customApiKey = request.headers.get('x-gemini-api-key') || body.apiKey;
    const model = body.model || 'gemini-1.5-flash';

    const result = await classifyWasteImage({
      imageBase64: imagePayload,
      apiKey: customApiKey || undefined,
      model
    });

    return new Response(
      JSON.stringify({
        category: result.category,
        confidence: result.confidence,
        item_name: result.item_name,
        dos_and_donts: result.dos_and_donts,
        lifespan: result.lifespan,
        model_used: result.modelUsed
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  } catch (error: any) {
    console.error('Classification API error:', error);
    const isApiKeyError = error?.message?.includes('GEMINI_API_KEY') || error?.message?.includes('API key');
    const statusCode = isApiKeyError ? 401 : 500;

    return new Response(
      JSON.stringify({
        error: error?.message || 'Internal Server Error during classification',
        is_key_missing: isApiKeyError
      }),
      {
        status: statusCode,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-gemini-api-key'
    }
  });
}

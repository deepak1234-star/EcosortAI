import { GoogleGenAI, Type } from '@google/genai';
import type { WasteCategoryType } from '../types';

export interface ClassificationResponse {
  category: WasteCategoryType;
  confidence: number;
  item_name: string;
  dos_and_donts: {
    dos: string[];
    donts: string[];
  };
  lifespan: string;
  modelUsed?: string;
}

export interface ClassifyImageOptions {
  imageBase64: string;
  apiKey?: string;
  model?: string;
}

const VALID_CATEGORIES: WasteCategoryType[] = [
  'Organic',
  'Paper',
  'Plastic',
  'Metal',
  'Glass',
  'E-Waste',
  'Hazardous'
];

/**
 * Extracts raw base64 string and MIME type from a base64 or Data URL string
 */
export function extractBase64Payload(imageString: string): { mimeType: string; base64Data: string } {
  if (!imageString) {
    throw new Error('Image payload is empty');
  }

  const match = imageString.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
  if (match) {
    return {
      mimeType: match[1],
      base64Data: match[2]
    };
  }

  // Raw base64 string provided without prefix
  return {
    mimeType: 'image/jpeg',
    base64Data: imageString.trim()
  };
}

/**
 * Perform waste classification using the Google Gen AI SDK
 */
export async function classifyWasteImage(options: ClassifyImageOptions): Promise<ClassificationResponse> {
  const { imageBase64, apiKey, model } = options;

  // Retrieve API key from options, process.env, or import.meta.env
  const resolvedApiKey =
    apiKey ||
    (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY || process.env?.VITE_GEMINI_API_KEY || process.env?.GOOGLE_API_KEY : undefined) ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env ? (import.meta as any).env.VITE_GEMINI_API_KEY : undefined);

  if (!resolvedApiKey) {
    throw new Error(
      'GEMINI_API_KEY is not configured. Please add GEMINI_API_KEY to your environment variables or provide it in the scanner settings.'
    );
  }

  const { mimeType, base64Data } = extractBase64Payload(imageBase64);

  const ai = new GoogleGenAI({ apiKey: resolvedApiKey });

  // Priority list of models including gemini-3.8-flash, gemini-3-flash, and Gemini Pro
  const modelsToTry = [
    model || 'gemini-3.8-flash',
    'gemini-3.8-flash',
    'gemini-3-flash',
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-1.5-pro'
  ];



  // Remove duplicates while preserving order
  const uniqueModels = Array.from(new Set(modelsToTry));

  let lastError: any = null;

  for (const modelCandidate of uniqueModels) {
    try {
      const response = await ai.models.generateContent({
        model: modelCandidate,
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: base64Data
                }
              },
              {
                text: `You are an expert waste classification and circular economy AI for EcoSort AI.
Analyze the provided image and classify the primary waste item.
Provide accurate, structured output matching this JSON schema:
- "category": One of "Organic", "Paper", "Plastic", "Metal", "Glass", "E-Waste", "Hazardous".
- "confidence": Percentage score between 0 and 100 representing visual detection certainty.
- "item_name": Concise name of the specific item detected (e.g. "Crushed Plastic Water Bottle", "Cardboard Shipping Box", "Lithium-Ion Phone Battery", "Banana Peel").
- "dos_and_donts": Object containing:
    - "dos": Array of 2-4 specific actionable disposal instructions (e.g. "Rinse food residues", "Flatten container to optimize volume", "Place in dry recyclables bin").
    - "donts": Array of 2-4 key mistakes to avoid (e.g. "Do not place in general wet garbage", "Do not recycle if contaminated with motor oil").
- "lifespan": Estimated natural decomposition or breakdown time (e.g. "450 years", "2-6 weeks", "1-2 million years", "Does not biodegrade").`
              }
            ]
          }
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              category: {
                type: Type.STRING,
                enum: VALID_CATEGORIES,
                description: 'The classified waste category'
              },
              confidence: {
                type: Type.NUMBER,
                description: 'Visual detection confidence percentage score (0-100)'
              },
              item_name: {
                type: Type.STRING,
                description: 'Specific name of the detected waste item'
              },
              dos_and_donts: {
                type: Type.OBJECT,
                properties: {
                  dos: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Recommended disposal instructions'
                  },
                  donts: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Actions to avoid during disposal'
                  }
                },
                required: ['dos', 'donts']
              },
              lifespan: {
                type: Type.STRING,
                description: 'Estimated decomposition time'
              }
            },
            required: ['category', 'confidence', 'item_name', 'dos_and_donts', 'lifespan']
          }
        }
      });

      const rawText = response.text || '';
      const cleanJson = rawText.replace(/```(?:json)?/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      // Validate and normalize
      const category: WasteCategoryType = VALID_CATEGORIES.includes(parsed.category)
        ? parsed.category
        : 'Plastic';

      const confidence = typeof parsed.confidence === 'number'
        ? Math.min(100, Math.max(0, Math.round(parsed.confidence)))
        : 95;

      const itemName = parsed.item_name || 'Classified Waste Item';

      const dosList = Array.isArray(parsed.dos_and_donts?.dos)
        ? parsed.dos_and_donts.dos.map(String)
        : ['Follow standard local municipal sorting protocol.'];

      const dontsList = Array.isArray(parsed.dos_and_donts?.donts)
        ? parsed.dos_and_donts.donts.map(String)
        : ['Do not mix with hazardous or unseparated waste.'];

      const lifespan = parsed.lifespan || 'Unknown lifespan';

      return {
        category,
        confidence,
        item_name: itemName,
        dos_and_donts: {
          dos: dosList,
          donts: dontsList
        },
        lifespan,
        modelUsed: modelCandidate
      };
    } catch (err: any) {
      lastError = err;
      const errMsg = err?.message || String(err);
      // If error is model not found or unsupported model, try the next model candidate
      if (
        errMsg.toLowerCase().includes('not found') ||
        errMsg.toLowerCase().includes('is not supported') ||
        errMsg.toLowerCase().includes('404')
      ) {
        console.warn(`Model ${modelCandidate} failed with 404/not supported, trying next model...`);
        continue;
      }
      // For auth or rate limit errors, don't loop endlessly
      throw err;
    }
  }

  throw lastError || new Error('Failed to classify image with Gemini models.');
}

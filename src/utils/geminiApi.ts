import { classifyWasteImage, type ClassificationResponse } from '../services/geminiClassifier';
import type { WasteCategoryType } from '../types';

export interface ClassifyResult {
  category: WasteCategoryType;
  confidence: number;
  item_name: string;
  dos_and_donts: {
    dos: string[];
    donts: string[];
  };
  lifespan: string;
  model_used?: string;
  source: 'api_route' | 'client_direct' | 'simulation_fallback';
}

/**
 * Get stored or environment Gemini API key
 */
export function getGeminiApiKey(): string | undefined {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('ecosort_gemini_api_key');
    if (saved && saved.trim()) return saved.trim();
  }
  return (import.meta as any).env?.VITE_GEMINI_API_KEY || (import.meta as any).env?.GEMINI_API_KEY;
}

/**
 * Set user custom Gemini API key in local storage
 */
export function setGeminiApiKey(key: string): void {
  if (typeof window !== 'undefined') {
    if (key.trim()) {
      localStorage.setItem('ecosort_gemini_api_key', key.trim());
    } else {
      localStorage.removeItem('ecosort_gemini_api_key');
    }
  }
}

/**
 * Primary function to classify an image using either the Next.js/Vite API route (/api/classify)
 * with automatic fallback to client-side direct SDK or demo fallback.
 */
export async function classifyWasteViaGemini(
  base64Image: string,
  preferredModel: string = 'gemini-3-flash'
): Promise<ClassifyResult> {
  const customKey = getGeminiApiKey();

  // 1. First attempt: Call the Next.js API route (/api/classify)
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (customKey) {
      headers['x-gemini-api-key'] = customKey;
    }

    const response = await fetch('/api/classify', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        image: base64Image,
        apiKey: customKey,
        model: preferredModel
      })
    });

    if (response.ok) {
      const data = await response.json();
      return {
        category: data.category,
        confidence: Number(data.confidence) || 95,
        item_name: data.item_name || 'Classified Waste',
        dos_and_donts: {
          dos: Array.isArray(data.dos_and_donts?.dos) ? data.dos_and_donts.dos : [],
          donts: Array.isArray(data.dos_and_donts?.donts) ? data.dos_and_donts.donts : []
        },
        lifespan: data.lifespan || 'Unknown',
        model_used: data.model_used || preferredModel,
        source: 'api_route'
      };
    }

    // If API returned a JSON error
    const errorData = await response.json().catch(() => null);
    if (response.status === 401 && !customKey) {
      throw new Error(errorData?.error || 'Gemini API key is required to classify live camera frames.');
    }
    if (errorData?.error) {
      console.warn('API route /api/classify returned error:', errorData.error);
    }
  } catch (apiError: any) {
    console.warn('Could not complete classification via /api/classify route, trying direct SDK:', apiError);
  }

  // 2. Second attempt: Direct client SDK call if key is available
  if (customKey) {
    try {
      const directResult: ClassificationResponse = await classifyWasteImage({
        imageBase64: base64Image,
        apiKey: customKey,
        model: preferredModel
      });

      return {
        category: directResult.category,
        confidence: directResult.confidence,
        item_name: directResult.item_name,
        dos_and_donts: directResult.dos_and_donts,
        lifespan: directResult.lifespan,
        model_used: directResult.modelUsed || preferredModel,
        source: 'client_direct'
      };
    } catch (directError: any) {
      console.error('Direct Gemini SDK error:', directError);
      throw directError;
    }
  }

  throw new Error(
    'GEMINI_API_KEY is not configured. Please add GEMINI_API_KEY in your environment or enter your Google Gemini API key in the scanner settings.'
  );
}

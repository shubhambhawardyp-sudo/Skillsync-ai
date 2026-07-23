import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

export const isGeminiConfigured = Boolean(apiKey);

if (!isGeminiConfigured) {
  // eslint-disable-next-line no-console
  console.warn(
    '[SkillSync] VITE_GEMINI_API_KEY is missing. Add it to your .env file to enable real AI analysis. Falling back to demo data until then.'
  );
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

/**
 * Sends a prompt to Gemini and expects a JSON object back.
 * Throws if Gemini isn't configured or the response isn't valid JSON,
 * so callers can decide how to fall back.
 */
export async function generateJSON<T>(prompt: string): Promise<T> {
  if (!genAI) {
    throw new Error('Gemini API key not configured');
  }

  const model = genAI.getGenerativeModel({
    model: 'gemini-3.1-flash-lite',
    generationConfig: {
      responseMimeType: 'application/json',
    },
  });

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    return JSON.parse(text) as T;
  } catch (err) {
    throw new Error(`Gemini returned invalid JSON: ${(err as Error).message}`);
  }
}

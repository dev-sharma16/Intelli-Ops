import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY, 
});

/**
 * analyzeLogWithGemini
 * @param logData - incoming log object (projectId, userId, message, level, source, timestamp, etc.)
 * @param model - the model id you want to use (e.g. "gemini-2.5-flash", "gemini-2.5-pro", "gemini-1.5", etc.)
 */

export const analyzeLogWithGemini = async (
  logData: any,
  model = 'gemini-2.5-flash'
) => {
  const prompt = `
    You are a log-analysis assistant. Given the log below, produce:
    1) A concise SUMMARY (one short paragraph).
    2) ACTIONABLE FIX SUGGESTIONS (bullet points).
    3) A SEVERITY SCORE (1-10).
    Return the output with clear labels: "SUMMARY:", "SUGGESTIONS:", "SEVERITY:".

    Log:
    ${JSON.stringify(logData, null, 2)}
  `;

  try {
    const response = await ai.models.generateContent({
      model, 
      contents: [{ text: prompt }],
    });

    const aiText = (response as any).text ?? '';

    return aiText;
  } catch (err: any) {
    console.error('Gemini analyze error:', err?.message ?? err);
    throw err;
  }
};

import { analyzeLogWithGemini } from './gemini.service';
import { Analysis } from '../models/analysis.model';

export const processLog = async (logData: any) => {
  const model =
    logData.level === 'critical' ? 'gemini-2.5-pro' : 'gemini-2.5-flash';

  const aiRaw = await analyzeLogWithGemini(logData, model);

  // parse aiRaw (best-effort—adjust regex to match prompt's output)
  const summaryMatch = aiRaw.match(/SUMMARY:\s*([\s\S]*?)\n\s*\n?/i);
  const suggestionsMatch = aiRaw.match(/SUGGESTIONS:\s*([\s\S]*?)\n\s*\n?/i);
  const severityMatch = aiRaw.match(/SEVERITY:\s*(\d+)/i);

  const analysis = await Analysis.create({
    ...logData,
    aiSummary: summaryMatch ? summaryMatch[1].trim() : aiRaw.slice(0, 200),
    aiSuggestion: suggestionsMatch
      ? suggestionsMatch[1].trim()
      : 'No suggestion found.',
    severityScore: severityMatch ? Number(severityMatch[1]) : 5,
  });

  return analysis;
};

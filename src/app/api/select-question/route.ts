import { createGroq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { BorrowerProfile } from '@/lib/types';
import { getEligibleAdaptiveQuestions, rankCandidatesHeuristically } from '@/lib/questions/eligibility';
import { evaluateAssessment } from '@/lib/rules';

interface SelectQuestionRequest {
  profile: Partial<BorrowerProfile>;
  answeredIds: string[];
}

export async function POST(req: Request) {
  try {
    const { profile, answeredIds } = (await req.json()) as SelectQuestionRequest;

    // 1. Gather all logically eligible candidate questions
    const candidates = getEligibleAdaptiveQuestions(profile, answeredIds || []);

    // If no candidate questions exist, stop immediately
    if (!candidates || candidates.length === 0) {
      return Response.json({
        shouldStop: true,
        questionId: null,
        reason: 'All applicable risk variables have been resolved.',
        mode: 'deterministic',
      });
    }

    // 2. Compute preliminary assessment to give AI context on current uncertainty
    let preliminaryAssessment = null;
    try {
      preliminaryAssessment = evaluateAssessment(profile as BorrowerProfile);
    } catch {
      // Profile may be partially populated
    }

    // 3. Fallback Heuristic
    const fallback = rankCandidatesHeuristically(candidates, profile);

    // If Groq API key is not present, use deterministic ranking
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return Response.json({
        shouldStop: false,
        questionId: fallback.selected?.id || null,
        reason: fallback.reason,
        mode: 'heuristic_fallback',
      });
    }

    // 4. Invoke Groq AI Question Selector
    const groq = createGroq({ apiKey });

    const candidatePromptList = candidates.map(c => ({
      id: c.id,
      title: c.title,
      affects: c.affects,
      whyItMatters: c.aiDescription,
    }));

    const systemPrompt = `You are the AI Question Selector for Borrower Copilot, an Indian consumer loan advisory tool.
Your SOLE responsibility is to choose the single most impactful question from a pre-defined candidate list to ask the borrower next, OR decide that enough information has been collected.

CRITICAL CONSTRAINTS:
1. You MUST NEVER invent questions. You may ONLY choose an "id" from the candidate list below, or decide to stop.
2. If the borrower's risk is already clear, or if remaining questions will not materially move the verdict, rate, or safe EMI, return "shouldStop": true.
3. If the borrower is Salaried with high income, prioritize questions that measure income volatility (e.g. variable pay).
4. If the borrower is Self-Employed or Kirana owner wanting high amounts (₹10L+), prioritize collateral ownership and business vintage.
5. If the borrower is Gig/Informal or has high debt load, prioritize distress questions (30%+ app debt, recent bounces).

Return ONLY valid JSON matching this schema:
{
  "shouldStop": boolean,
  "questionId": string | null,
  "reason": "One concise sentence explaining why this question is being prioritized for this specific borrower profile."
}`;

    const userPrompt = `CURRENT BORROWER PROFILE:
${JSON.stringify(profile, null, 2)}

CURRENT ASSESSMENT METRICS:
- Verdict: ${preliminaryAssessment?.verdict ?? 'Evaluating'}
- Confidence: ${preliminaryAssessment?.confidence ?? 'UNKNOWN'}
- Safe EMI: ₹${preliminaryAssessment?.recommendedMaxEMI?.toLocaleString('en-IN') ?? 'N/A'}
- Fair Rate Band: ${preliminaryAssessment?.fairRateRange ? preliminaryAssessment.fairRateRange.join('%–') + '%' : 'N/A'}

ELIGIBLE CANDIDATE QUESTIONS:
${JSON.stringify(candidatePromptList, null, 2)}

Select the next best question id or stop. Return JSON only:`;

    const response = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.1,
    });

    const text = response.text.trim();
    // Extract JSON block if wrapped in markdown
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      // Verify that the chosen question is actually among eligible candidates
      const isValidCandidate = candidates.some(c => c.id === parsed.questionId);
      if (parsed.shouldStop || !isValidCandidate) {
        if (parsed.shouldStop) {
          return Response.json({
            shouldStop: true,
            questionId: null,
            reason: parsed.reason || 'Sufficient information gathered for an accurate assessment.',
            mode: 'ai_groq',
          });
        }
      } else {
        return Response.json({
          shouldStop: false,
          questionId: parsed.questionId,
          reason: parsed.reason || fallback.reason,
          mode: 'ai_groq',
        });
      }
    }

    // Default to fallback if JSON parsing failed
    return Response.json({
      shouldStop: false,
      questionId: fallback.selected?.id || null,
      reason: fallback.reason,
      mode: 'heuristic_fallback',
    });

  } catch (error) {
    console.error('AI Selector Error:', error);
    // Graceful fallback to deterministic logic
    return Response.json({
      shouldStop: false,
      questionId: null,
      reason: 'Standard risk evaluation rules active.',
      mode: 'fallback_error',
    });
  }
}

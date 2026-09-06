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
  let profile: Partial<BorrowerProfile> = {};
  let answeredIds: string[] = [];

  try {
    const body = (await req.json()) as SelectQuestionRequest;
    profile = body.profile || {};
    answeredIds = body.answeredIds || [];

    // 1. Gather all logically eligible candidate questions
    const candidates = getEligibleAdaptiveQuestions(profile, answeredIds);

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

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return Response.json({
        shouldStop: false,
        questionId: fallback.selected?.id || null,
        reason: fallback.reason,
        mode: 'heuristic_fallback',
      });
    }

    const candidatePromptList = candidates.map(c => ({
      id: c.id,
      title: c.title,
      affects: c.affects,
      whyItMatters: c.aiDescription,
    }));

    const systemPrompt = `You are the AI Adaptive Underwriter for BorrowIQ, an Indian borrower advisory system.
The borrower has completed Tier 1 (the 8 core Must Questions: Purpose, Amount, Employment, Income, EMIs, Expenses, Age, Credit Tier).
Your SOLE responsibility is to select ONE additional question from the eligible candidate list that will TIGHTEN their numbers the most, OR return "shouldStop": true.

ARCHETYPE TIGHTENING RULES:
1. "A salaried IT employee and a kirana owner should not see the same questions. Skip what does not apply."
2. Salaried Corporate / IT employee:
   - Primary: "variablePayPortionPercent". If present in candidate list, you MUST select this question to calculate bonus discount haircuts and protect safe EMI ceiling.
   - Secondary: "emergencySavingsMonths" (measures buffer against job loss).
   - NEVER select "businessVintageYears"!
   - DO NOT select "hasHighCostAppLoans" or "recentDelinquencyOrBounce" if existingMonthlyEMI is 0.
3. Kirana Owner / Self-Employed Business:
   - Primary: "businessVintageYears" (10+ years operating history mitigates lack of credit bureau score).
   - Secondary: "hasUnencumberedCollateral" (to test if ₹10L+ can switch to 9.0%–10.5% LAP instead of 16%+ unsecured business loan).
   - NEVER select "variablePayPortionPercent"!
4. Gig / High Debt:
   - Primary: "hasHighCostAppLoans" (if debt > 0) or "emergencySavingsMonths".
5. IMPORTANT: DO NOT return "shouldStop": true if the borrower's archetype primary question (e.g. "variablePayPortionPercent" for salaried corporate, "businessVintageYears" for kirana) is in the candidate list. Always prioritize that question first!
6. Only return "shouldStop": true if all relevant archetype questions have already been answered or none of the remaining candidates apply to this borrower.

Return ONLY valid JSON matching this schema:
{
  "shouldStop": boolean,
  "questionId": string | null,
  "reason": "One direct sentence explaining why this question is being prioritized to tighten this borrower's specific terms."
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

Select next question id or stop. Return JSON only:`;
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      signal: AbortSignal.timeout(20000),
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        reasoning_effort: 'low',
        max_completion_tokens: 400,
        temperature: 0.1,
      }),
    });

    if (groqRes.ok) {
      const completion = await groqRes.json();
      const content = completion.choices?.[0]?.message?.content?.trim();
      if (content) {
        const parsed = JSON.parse(content);
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
    }

    // Default to fallback if JSON parsing failed or Groq error
    return Response.json({
      shouldStop: false,
      questionId: fallback.selected?.id || null,
      reason: fallback.reason,
      mode: 'heuristic_fallback',
    });

  } catch (error) {
    console.error('AI Selector Error, falling back to deterministic ranker:', error);
    try {
      const candidates = getEligibleAdaptiveQuestions(profile, answeredIds || []);
      const fallback = rankCandidatesHeuristically(candidates, profile);
      return Response.json({
        shouldStop: !fallback.selected,
        questionId: fallback.selected?.id || null,
        reason: fallback.reason,
        mode: 'heuristic_fallback',
      });
    } catch {
      return Response.json({
        shouldStop: true,
        questionId: null,
        reason: 'Sufficient profile information collected.',
        mode: 'deterministic_stop',
      });
    }
  }
}

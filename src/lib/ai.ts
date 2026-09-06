import { BorrowerProfile, Assessment } from './types';

export interface AIAdviceResponse {
  spokenPitch: string;
  hardObjectionsToRaise: string[];
  hiddenTrapWarning: string;
  source: 'ai_gateway' | 'deterministic_rules_template';
}

export async function getEnhancedNegotiationAdvice(
  profile: BorrowerProfile,
  assessment: Assessment
): Promise<AIAdviceResponse> {
  const aiGatewayKey = process.env.AI_GATEWAY_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;

  if (!aiGatewayKey && !groqKey) {
    return getDeterministicAdviceTemplate(profile, assessment);
  }

  const endpoint = aiGatewayKey
    ? 'https://ai-gateway.vercel.sh/v1/chat/completions'
    : 'https://api.groq.com/openai/v1/chat/completions';

  const authHeader = aiGatewayKey
    ? `Bearer ${aiGatewayKey}`
    : `Bearer ${groqKey}`;

  const modelName = aiGatewayKey
    ? 'google/gemini-2.5-flash'
    : 'openai/gpt-oss-120b';

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({
        model: modelName,
        reasoning_effort: 'low',
        max_completion_tokens: 400,
        messages: [
          {
            role: 'system',
            content: `You are an expert Indian borrower advocate advising a customer before they speak to a bank loan manager.
Give direct, punchy, spoken talking points. Mention exact Indian lending realities (CIBIL, FOIR, RBI All-in APR, processing fees, GST, bundled loan insurance).
Do NOT invent financial numbers; use the exact assessment numbers provided.`
          },
          {
            role: 'user',
            content: `Borrower Situation:
- Inferred Route: ${assessment.inferredProductRoute}
- Verdict: ${assessment.verdict} (${assessment.verdictReason})
- Safe Target Borrowing: ₹${(assessment.borrowerSafeRange[0]/100000).toFixed(1)}L - ₹${(assessment.borrowerSafeRange[1]/100000).toFixed(1)}L
- Fair Rate Band: ${assessment.fairRateRange[0]}% - ${assessment.fairRateRange[1]}%
- Hard Safe EMI Ceiling: ₹${assessment.recommendedMaxEMI.toLocaleString('en-IN')}/mo
- Better Alternative: ${assessment.betterAlternative.title} - ${assessment.betterAlternative.recommendation}

Generate:
1. Spoken opener for the loan officer (1-2 crisp sentences)
2. 3 sharp objections/demands to raise during the meeting
3. A single warning on the biggest trap the sales agent will attempt`
          }
        ],
        temperature: 0.2
      })
    });

    if (!response.ok) {
      return getDeterministicAdviceTemplate(profile, assessment);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (content) {
      return {
        spokenPitch: content,
        hardObjectionsToRaise: assessment.negotiationPoints,
        hiddenTrapWarning: 'Never permit the lender to disburse single-premium credit life insurance or documentation charges funded out of your sanctioned principal.',
        source: 'ai_gateway'
      };
    }
  } catch (err) {
    console.error('AI Gateway fetch failed, falling back to deterministic template', err);
  }

  return getDeterministicAdviceTemplate(profile, assessment);
}

function getDeterministicAdviceTemplate(
  profile: BorrowerProfile,
  assessment: Assessment
): AIAdviceResponse {
  if (assessment.verdict === 'DON\'T BORROW YET') {
    return {
      spokenPitch: `I am currently restructuring my existing short-term loan servicing to lower my monthly cash-flow obligations. I am not accepting new commercial loans until my existing high-interest facilities are closed.`,
      hardObjectionsToRaise: [
        'Decline all telecaller pre-approved instant digital loans; taking new debt now triggers rapid default.',
        'Request tenure extension or interest reduction on any current high-cost debt from existing lenders.',
        'Ask about regulated micro-credit or non-profit consolidation programs (12%–15%) to replace predatory 30%+ apps.'
      ],
      hiddenTrapWarning: 'Beware of predatory digital lending apps that charge weekly interest or demand contact list access.',
      source: 'deterministic_rules_template'
    };
  }

  if (assessment.inferredProductRoute.includes('LAP')) {
    return {
      spokenPitch: `I have unencumbered commercial/residential property in ${profile.hasUnencumberedCollateral ? 'prime municipal limits' : 'my name'} with clear marketable title. I want to apply for a Secured MSME Loan Against Property (LAP) at 9.0%–10.25%, not a high-interest retail personal loan.`,
      hardObjectionsToRaise: [
        'Ask for Priority Sector Lending (PSL) / MSME concessional rate bands.',
        'Insist on a 7 to 10 year tenure to keep monthly EMI comfortably within ₹27,000/month.',
        'Demand a written legal and valuation fee schedule upfront before handing over copy deeds.'
      ],
      hiddenTrapWarning: 'Sales agents may pitch unsecured business loans at 16%+ claiming faster 48-hour approval. Refuse: LAP saves ₹5,00,000+ in lifetime interest.',
      source: 'deterministic_rules_template'
    };
  }

  return {
    spokenPitch: `My verified credit profile and stable income qualify me for your lowest prime pricing tier of ${assessment.fairRateRange[0]}%–${assessment.fairRateRange[1]}%. I am comparing competing quotes from salary account banks and will only proceed if you match this band.`,
    hardObjectionsToRaise: [
      `Quote the official all-in APR including processing fees and 18% GST in writing.`,
      `Waive or cap the upfront processing fee from 2% down to 0.75% or a flat ₹5,000.`,
      `Strictly decline single-premium loan protection insurance bundled into the disbursed loan amount.`
    ],
    hiddenTrapWarning: 'Loan officers are incentivized on ticket size and will try to sanction ₹12L–₹14L instead of your safe ₹8L. Never accept a larger loan than your safe ceiling.',
    source: 'deterministic_rules_template'
  };
}

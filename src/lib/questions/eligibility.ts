import { BorrowerProfile } from '@/lib/types';
import { RegisteredQuestion, QUESTION_REGISTRY, BASE_QUESTION_IDS } from './registry';

export interface CandidateEvaluation {
  question: RegisteredQuestion;
  eligible: boolean;
  score: number;
  reason: string;
}

/**
 * Returns candidate adaptive questions that are eligible to be asked next.
 */
export function getEligibleAdaptiveQuestions(
  profile: Partial<BorrowerProfile>,
  answeredIds: string[]
): RegisteredQuestion[] {
  const allKeys = Object.keys(QUESTION_REGISTRY) as (keyof BorrowerProfile)[];

  // Candidates are questions not in BASE_QUESTION_IDS and not yet answered
  const adaptiveCandidates = allKeys.filter(
    id => !BASE_QUESTION_IDS.includes(id) && !answeredIds.includes(id)
  );

  return adaptiveCandidates
    .map(id => QUESTION_REGISTRY[id])
    .filter(q => q && q.appliesWhen(profile));
}

export function rankCandidatesHeuristically(
  candidates: RegisteredQuestion[],
  profile: Partial<BorrowerProfile>
): { selected: RegisteredQuestion | null; reason: string } {
  if (candidates.length === 0) {
    return { selected: null, reason: 'No eligible candidate questions remain.' };
  }

  const scored = candidates.map(q => {
    let score = q.basePriority;
    let rationale = q.aiDescription;

    if (q.id === 'variablePayPortionPercent' && profile.primaryIncomeSignal === 'salaried_corporate') {
      score += 15;
      rationale = 'Evaluates potential volatility in corporate bonus pay to protect safe EMI ceiling.';
    }

    if (q.id === 'hasUnencumberedCollateral' && (profile.primaryIncomeSignal === 'self_employed_business' || (profile.requestedAmount || 0) >= 1500000 || profile.loanPurpose === 'business_expansion')) {
      score += 12;
      rationale = 'Evaluates whether unencumbered property can unlock a 9.0%–10.5% LAP instead of 16%+ personal loan.';
    }

    if (q.id === 'collateralEstimatedValue' && profile.hasUnencumberedCollateral === true) {
      score += 15;
      rationale = 'Measures property valuation to calculate exact 50%–60% LTV sanction capacity.';
    }

    if (q.id === 'businessVintageYears' && profile.primaryIncomeSignal === 'self_employed_business') {
      score += 8;
      rationale = 'Tests operating track record to compensate for lack of credit bureau score.';
    }
    if (q.id === 'hasHighCostAppLoans' && (profile.primaryIncomeSignal === 'gig_freelance' || profile.loanPurpose === 'debt_consolidation' || ((profile.existingMonthlyEMI || 0) / (profile.netMonthlyIncome || 1)) >= 0.20)) {
      score += 14;
      rationale = 'Identifies active 30%+ instant app loans that trigger debt spiral risk.';
    }
    const hasExistingLoans = (profile.existingMonthlyEMI || 0) > 0 || profile.hasHighCostAppLoans === true;
    if (q.id === 'recentDelinquencyOrBounce' && hasExistingLoans) {
      score += 13;
      rationale = 'Checks recent repayment bounce to determine if lender rejection is certain.';
    }

    return { question: q, score, rationale };
  });

  scored.sort((a, b) => b.score - a.score);

  return {
    selected: scored[0].question,
    reason: scored[0].rationale,
  };
}

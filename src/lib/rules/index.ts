import { BorrowerProfile, Assessment, Verdict, ConfidenceLevel } from '../types';
import { calculateSafeAffordability } from './affordability';
import { calculateEligibilityAndSanction } from './eligibility';
import { calculateFairRates } from './rates';
import { calculateEffectiveAPR } from './apr';
import { calculateEMI, generateTenureMatrix } from './emi';
import { calculateStressScenario } from './stress';

/**
 * Master Financial Assessment Engine.
 * 
 * Takes a completed BorrowerProfile and deterministically evaluates:
 * - O1: Verdict (BORROW, BORROW LESS, DON'T BORROW YET)
 * - O2: Maximum Amount (Lender Sanction vs Borrower-Safe)
 * - O3: Fair Interest Rate & Effective APR
 * - O4: Recommended Safe EMI Ceiling & Tenure Trade-offs
 */
export function evaluateAssessment(profile: BorrowerProfile): Assessment {
  // 1. Affordability & Safe EMI
  const affordability = calculateSafeAffordability(profile);

  // 2. Fair Rates & APR
  const rateAnalysis = calculateFairRates(profile);
  const midFairRate = (rateAnalysis.fairRateRange[0] + rateAnalysis.fairRateRange[1]) / 2;
  const aprAnalysis = calculateEffectiveAPR(rateAnalysis.fairRateRange, profile.requestedAmount, 36);

  // 3. Eligibility & Amounts
  const eligibility = calculateEligibilityAndSanction(profile, affordability.safeMaxEMI, midFairRate);

  // 4. Safe EMI & Tenure Matrix
  const safeLoanCeiling = eligibility.borrowerSafeRange[1];
  const baselinePrincipal = Math.min(profile.requestedAmount, Math.max(10000, safeLoanCeiling));
  const recommendedMaxEMI = affordability.safeMaxEMI;
  const tenureMatrix = generateTenureMatrix(baselinePrincipal > 0 ? baselinePrincipal : profile.requestedAmount, midFairRate);

  // 5. Stress Scenario
  const stressScenario = calculateStressScenario(profile, recommendedMaxEMI);

  // 6. Verdict (O1) Determination:
  let verdict: Verdict = 'BORROW';
  let verdictReason = '';

  // Red-flag rejection criteria:
  if (
    affordability.isOverleveraged ||
    profile.recentDelinquencyOrBounce ||
    (profile.hasInformalHighCostDebt && affordability.currentFOIR >= 30) ||
    affordability.safeMaxEMI <= 0
  ) {
    verdict = 'DON\'T BORROW YET';
    if (profile.recentDelinquencyOrBounce && profile.hasInformalHighCostDebt) {
      verdictReason = `Active delinquency detected with high-cost 30%+ app loans. Adding new debt now guarantees a debt spiral. Prioritize consolidating existing debt into an MFI / SHG loan first.`;
    } else if (profile.recentDelinquencyOrBounce) {
      verdictReason = 'Recent loan bounce or delinquency detected; taking additional debt now risks rapid default and severe credit score impairment.';
    } else if (affordability.isOverleveraged) {
      verdictReason = `Existing loan repayments already consume ${Math.round(affordability.currentFOIR)}% of your monthly income. Additional borrowing will breach safe living expense buffers.`;
    } else {
      verdictReason = 'Current debt obligations and essential expenses leave insufficient cash flow to safely support any new monthly EMI.';
    }
  } else if (
    profile.requestedAmount > eligibility.borrowerSafeRange[1] * 1.15 ||
    stressScenario.isBreached ||
    (profile.loanType === 'unsecured_personal' && profile.requestedAmount >= 1000000 && profile.incomeType === 'self_employed_business')
  ) {
    verdict = 'BORROW LESS';
    if (profile.loanType === 'unsecured_personal' && profile.requestedAmount >= 1000000 && profile.hasCollateralProperty) {
      verdictReason = `₹15L as an unsecured personal loan is unsafe on documented ITR cash flow. Shift to a Secured Loan Against Property (LAP) to borrow safely at half the interest rate.`;
    } else if (profile.requestedAmount > eligibility.borrowerSafeRange[1]) {
      const requestedLakhs = (profile.requestedAmount / 100000).toFixed(1);
      const safeMaxLakhs = (eligibility.borrowerSafeRange[1] / 100000).toFixed(1);
      verdictReason = `Your requested amount (₹${requestedLakhs}L) exceeds your safe repayment capacity (₹${safeMaxLakhs}L). Trimming the loan amount protects you from unmanageable future EMIs.`;
    } else {
      verdictReason = 'A 20% income reduction would push your debt servicing into the danger zone. Reducing the principal amount guarantees long-term affordability.';
    }
  } else {
    verdict = 'BORROW';
    verdictReason = 'Your income stability, current low debt-to-income ratio, and healthy cash-flow buffer comfortably support this requested loan.';
  }

  // Amount Explanation
  const safeMinL = (eligibility.borrowerSafeRange[0] / 100000).toFixed(1);
  const safeMaxL = (eligibility.borrowerSafeRange[1] / 100000).toFixed(1);
  const lendMinL = (eligibility.lenderSanctionRange[0] / 100000).toFixed(1);
  const lendMaxL = (eligibility.lenderSanctionRange[1] / 100000).toFixed(1);

  const amountExplanation = `Banks will likely offer ₹${lendMinL}L–₹${lendMaxL}L based on aggressive 50-60% income formulas. However, your safe borrowing limit is strictly ₹${safeMinL}L–₹${safeMaxL}L. Always negotiate against the safe number to avoid overleverage.`;

  // Negotiation Card Advice:
  const negotiationPoints: string[] = [
    `Ask for the All-in APR: "Please quote the effective APR including processing fee and all mandatory add-ons, not just headline interest."`,
    `Counter high quotes: Your target fair rate is ${rateAnalysis.fairRateRange[0]}%–${rateAnalysis.fairRateRange[1]}%. If quoted higher, point to your verified stability.`,
    `Waive or cap the processing fee: Banks routinely reduce processing fees from 2% to 0.75%-1% upon firm borrower request.`
  ];

  if (eligibility.productRoutingHint) {
    negotiationPoints.unshift(eligibility.productRoutingHint);
  }

  const doNotCrossRules: string[] = [
    `Never agree to an EMI above ₹${recommendedMaxEMI.toLocaleString('en-IN')}/month.`,
    `Never accept loan insurance bundled silently into the sanctioned loan principal.`,
    `Do not stretch tenure beyond 48 months for an unsecured loan merely to lower monthly EMI.`
  ];

  return {
    verdict,
    verdictReason,
    lenderSanctionRange: eligibility.lenderSanctionRange,
    borrowerSafeRange: eligibility.borrowerSafeRange,
    amountExplanation,
    fairRateRange: rateAnalysis.fairRateRange,
    expectedLenderQuoteRange: rateAnalysis.expectedLenderQuoteRange,
    effectiveAPRRange: aprAnalysis.effectiveAPRRange,
    processingFeePercent: aprAnalysis.processingFeePercent,
    rateExplanation: rateAnalysis.rateExplanation,
    recommendedMaxEMI,
    tenureMatrix,
    stressScenario,
    confidence: rateAnalysis.confidence,
    confidenceReasons: rateAnalysis.confidenceReasons,
    productRoutingRecommendation: eligibility.productRoutingHint,
    negotiationPoints,
    doNotCrossRules
  };
}

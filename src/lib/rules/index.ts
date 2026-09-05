import { BorrowerProfile, Assessment, Verdict } from '../types';
import { calculateSafeAffordability } from './affordability';
import { calculateEligibilityAndSanction } from './eligibility';
import { calculateFairRates } from './rates';
import { calculateEffectiveAPR } from './apr';
import { generateTenureMatrix } from './emi';
import { calculateStressScenario } from './stress';

/**
 * Master Financial Assessment Engine.
 * 
 * Takes a completed BorrowerProfile and deterministically evaluates:
 * - O1: Verdict (BORROW, BORROW LESS, DON'T BORROW YET)
 * - O2: Maximum Amount (Estimated Lender Range vs Borrower-Safe Range)
 * - O3: Fair Interest Rate & Effective APR
 * - O4: Recommended Safe EMI Ceiling & Tenure Trade-offs
 */
export function evaluateAssessment(profile: BorrowerProfile): Assessment {
  // 1. Affordability & Safe EMI (Double-lock cash flow)
  const affordability = calculateSafeAffordability(profile);

  // 2. Fair Rates & Effective APR
  const rateAnalysis = calculateFairRates(profile);
  const midFairRate = (rateAnalysis.fairRateRange[0] + rateAnalysis.fairRateRange[1]) / 2;
  const aprAnalysis = calculateEffectiveAPR(rateAnalysis.fairRateRange, profile.requestedAmount, 36);

  // 3. Estimated Lender vs Borrower Safe Amounts
  const eligibility = calculateEligibilityAndSanction(profile, affordability.safeMaxEMI, midFairRate);

  // 4. Safe EMI & Tenure Matrix
  const safeLoanCeiling = eligibility.borrowerSafeRange[1];
  const baselinePrincipal = Math.min(profile.requestedAmount, Math.max(10000, safeLoanCeiling));
  const recommendedMaxEMI = affordability.safeMaxEMI;
  const tenureMatrix = generateTenureMatrix(
    baselinePrincipal > 0 ? baselinePrincipal : profile.requestedAmount,
    midFairRate
  );

  // 5. Stress Scenario
  const stressScenario = calculateStressScenario(profile, recommendedMaxEMI);

  // 6. Verdict (O1) Determination with nuanced multi-factor risk:
  let verdict: Verdict = 'BORROW';
  let verdictReason = '';

  // Multi-factor Distress Check (Anita's compounded vulnerability):
  const isCompoundedDistress = 
    profile.hasHighCostAppLoans && 
    profile.recentDelinquencyOrBounce && 
    (affordability.disposableCash <= 0 || affordability.currentFOIR >= 25);

  const isPureBounceAccidental = 
    profile.recentDelinquencyOrBounce && 
    profile.bounceWasCuredImmediately && 
    (profile.emergencySavingsMonths || 0) >= 3 &&
    affordability.currentFOIR < 20;

  if (isCompoundedDistress || affordability.safeMaxEMI <= 0 || affordability.isOverleveraged) {
    verdict = 'DON\'T BORROW YET';
    if (isCompoundedDistress) {
      verdictReason = 'You are servicing 30%+ instant app loans with a recent bounce and zero monthly cash surplus. Adding a new loan will trigger a severe default spiral. You must consolidate and clear the high-cost app debt first.';
    } else if (affordability.isOverleveraged) {
      verdictReason = `Existing loan EMIs already consume ${Math.round(affordability.currentFOIR)}% of total household income. Taking new debt breaches essential living expense safety margins.`;
    } else {
      verdictReason = 'Essential living expenses and current debt leave no uncommitted cash flow to support additional monthly repayments.';
    }
  } else if (
    profile.requestedAmount > eligibility.borrowerSafeRange[1] * 1.15 ||
    stressScenario.isBreached ||
    (profile.inferredProductRoute !== 'Secured Loan Against Property (LAP)' && profile.requestedAmount >= 1000000 && profile.primaryIncomeSignal === 'self_employed_business')
  ) {
    verdict = 'BORROW LESS';
    if (profile.requestedAmount >= 1000000 && profile.hasUnencumberedCollateral) {
      verdictReason = `₹${(profile.requestedAmount / 100000).toFixed(0)}L as an unsecured personal loan is unsafe on documented ITR earnings. Route through a Secured Loan Against Property (LAP) to cut your interest rate in half and borrow safely.`;
    } else if (profile.requestedAmount > eligibility.borrowerSafeRange[1]) {
      const reqL = (profile.requestedAmount / 100000).toFixed(1);
      const safeL = (eligibility.borrowerSafeRange[1] / 100000).toFixed(1);
      verdictReason = `Your requested loan of ₹${reqL}L exceeds your safe cash-flow capacity (₹${safeL}L). Trimming the principal protects your monthly living budget.`;
    } else {
      verdictReason = 'A 20% income reduction would push debt servicing into an unmanageable range. Lowering the loan amount preserves safety during economic downturns.';
    }
  } else {
    verdict = 'BORROW';
    verdictReason = 'Your income stability, modest existing obligations, and healthy cash-flow buffer comfortably support this requested loan.';
  }

  // Amount Explanation
  const safeMinL = (eligibility.borrowerSafeRange[0] / 100000).toFixed(1);
  const safeMaxL = (eligibility.borrowerSafeRange[1] / 100000).toFixed(1);
  const lendMinL = (eligibility.estimatedLenderRange[0] / 100000).toFixed(1);
  const lendMaxL = (eligibility.estimatedLenderRange[1] / 100000).toFixed(1);

  const amountExplanation = `Public bank underwriting formulas (50%–60% FOIR) estimate eligibility around ₹${lendMinL}L–₹${lendMaxL}L. However, your cash-flow safe borrowing range is strictly ₹${safeMinL}L–₹${safeMaxL}L. Always negotiate against your safe ceiling.`;

  // Tailored Negotiation Script
  const negotiationPoints: string[] = [
    `Ask for the All-in APR: "Please provide the official all-inclusive APR including processing fees and 18% GST in writing."`,
    `Counter high initial quotes: Your fair rate band is ${rateAnalysis.fairRateRange[0]}%–${rateAnalysis.fairRateRange[1]}%. Decline quotes above this range.`,
    `Negotiate upfront processing charges: Standard 2% fees can routinely be capped at 0.75%–1% for creditworthy borrowers.`
  ];

  if (eligibility.inferredProductRoute === 'Secured Loan Against Property (LAP)') {
    negotiationPoints.unshift('Do not apply for retail personal loans. Ask the bank for an MSME Loan Against Property / Vyapar Loan at 9.0%–10.5%.');
  }

  const doNotCrossRules: string[] = [
    `Never agree to an EMI higher than ₹${recommendedMaxEMI.toLocaleString('en-IN')}/month.`,
    `Never permit single-premium loan insurance to be added into your loan principal.`,
    `Do not stretch tenure beyond 48 months for unsecured consumption loans just to artificially lower the EMI.`
  ];

  return {
    verdict,
    verdictReason,
    estimatedLenderRange: eligibility.estimatedLenderRange,
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
    inferredProductRoute: eligibility.inferredProductRoute,
    productRouteRationale: eligibility.productRouteRationale,
    negotiationPoints,
    doNotCrossRules
  };
}

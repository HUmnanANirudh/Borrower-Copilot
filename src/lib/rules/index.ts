import { 
  BorrowerProfile, 
  Assessment, 
  Verdict, 
  BetterAlternative, 
  ReasonTrace,
  LenderQuoteInput,
  LenderQuoteEvaluation,
  AssumptionOverrides
} from '../types';
import { normalizeFacts, deriveMetrics } from './pipeline';
import { calculateEligibilityAndSanction } from './eligibility';
import { calculateFairRates } from './rates';
import { calculateEffectiveAPR } from './apr';
import { calculateEMI, generateTenureMatrix } from './emi';
import { calculateStressScenario } from './stress';

/**
 * MASTER FINANCIAL ASSESSMENT ENGINE
 * Refined around: Facts -> Derived Metrics -> Decisions Pipeline
 */
export function evaluateAssessment(
  profile: BorrowerProfile,
  overrides?: AssumptionOverrides
): Assessment {
  // Step 1: Normalize Facts
  const facts = normalizeFacts(profile);

  // Step 2: Derive Metrics (with optional overrides for evaluator sandbox)
  const metrics = deriveMetrics(facts, profile, overrides);

  // Step 3: Determine Pricing (Dimension 3)
  const rateAnalysis = calculateFairRates(profile);
  const midFairRate = (rateAnalysis.fairRateRange[0] + rateAnalysis.fairRateRange[1]) / 2;
  const aprAnalysis = calculateEffectiveAPR(rateAnalysis.fairRateRange, profile.requestedAmount, 36);

  const rateTrace: ReasonTrace = {
    valueDescription: `Fair Rate: ${rateAnalysis.fairRateRange[0]}%–${rateAnalysis.fairRateRange[1]}%`,
    drivers: [
      `Credit Status: ${profile.creditScoreStatus.toUpperCase()}`,
      `Security: ${facts.hasCollateral ? 'Unencumbered property available' : 'Unsecured cash-flow'}`,
      ...(profile.businessVintageYears ? [`Operating Vintage: ${profile.businessVintageYears} years (-50 bps credit)`] : []),
      ...(facts.hasHighCostAppDebt ? ['High-cost debt distress penalty applied'] : [])
    ],
    bindingRule: profile.creditScoreStatus === 'unknown' ? 'uncertainty_widened_band' : 'tier_pricing_schedule',
    rationale: rateAnalysis.rateExplanation
  };

  // Step 4: Determine Affordability & Safe EMI (Dimension 2)
  // Hard Double-Lock Decision
  const safeMaxEMI = Math.floor(Math.min(metrics.uncommittedCashFlowFloor, metrics.foirCeiling));
  const isCashFlowBinding = metrics.uncommittedCashFlowFloor < metrics.foirCeiling;

  const safeEMITrace: ReasonTrace = {
    valueDescription: `Safe EMI Ceiling: ₹${safeMaxEMI.toLocaleString('en-IN')}/month`,
    drivers: [
      `Effective Household Income: ₹${Math.round(facts.effectiveIncomeAfterHaircut).toLocaleString('en-IN')}`,
      `Living Expenses: ₹${Math.round(facts.effectiveExpensesWithSanityFloor).toLocaleString('en-IN')}${facts.isExpenseSanityApplied ? ' (Sanity floor enforced)' : ''}`,
      `Existing EMIs: ₹${facts.existingEMI.toLocaleString('en-IN')}`,
      `10% Liquid Buffer: ₹${Math.round(metrics.untouchableReserveBuffer).toLocaleString('en-IN')}`,
      `Cash-Flow Floor: ₹${Math.round(metrics.uncommittedCashFlowFloor).toLocaleString('en-IN')}`,
      `Safe ${metrics.safeFOIRCapPercent}% FOIR Room: ₹${Math.round(metrics.foirCeiling).toLocaleString('en-IN')}`
    ],
    bindingRule: isCashFlowBinding ? 'cash_flow_floor' : 'safe_foir_ceiling',
    rationale: isCashFlowBinding
      ? `₹${safeMaxEMI.toLocaleString('en-IN')}/mo because your uncommitted living cash-flow floor (₹${Math.round(metrics.uncommittedCashFlowFloor).toLocaleString('en-IN')}) is lower than your ${metrics.safeFOIRCapPercent}% FOIR ceiling.`
      : `₹${safeMaxEMI.toLocaleString('en-IN')}/mo because your safe ${metrics.safeFOIRCapPercent}% FOIR debt room is the tighter constraint.`
  };

  // Step 5: Determine Eligibility (Dimension 1)
  const eligibility = calculateEligibilityAndSanction(profile, safeMaxEMI, midFairRate);

  const lenderRangeTrace: ReasonTrace = {
    valueDescription: `Estimated Lender Range: ₹${(eligibility.estimatedLenderRange[0]/100000).toFixed(1)}L–₹${(eligibility.estimatedLenderRange[1]/100000).toFixed(1)}L`,
    drivers: [
      `Bank 50%-60% FOIR Formula`,
      `Assessed Income: ₹${Math.round(profile.primaryIncomeSignal === 'self_employed_business' && profile.itrDeclaredMonthlyTaxable ? profile.itrDeclaredMonthlyTaxable : facts.totalHouseholdIncome).toLocaleString('en-IN')}`,
      `Extended 60-month tenure simulation`
    ],
    bindingRule: 'bank_regulatory_foir_benchmark',
    rationale: 'Public underwriting formulas estimate eligibility based on 50%–60% of documented income, assuming long 5-year tenures.'
  };

  const safeAmountTrace: ReasonTrace = {
    valueDescription: `Borrower-Safe Range: ₹${(eligibility.borrowerSafeRange[0]/100000).toFixed(1)}L–₹${(eligibility.borrowerSafeRange[1]/100000).toFixed(1)}L`,
    drivers: [
      `Safe Monthly EMI Ceiling: ₹${safeMaxEMI.toLocaleString('en-IN')}`,
      `Conservative 36–48 month tenure (minimizes lifetime interest)`,
      `Fair Mid-Rate: ${midFairRate.toFixed(2)}%`
    ],
    bindingRule: 'double_lock_repayment_capacity',
    rationale: 'Derived strictly from your safe cash-flow EMI over conservative 3 to 4 year tenures.'
  };

  // Step 6: Determine 3-Dimensional Status
  const eligibilityStatus = eligibility.estimatedLenderRange[1] >= profile.requestedAmount * 0.8
    ? 'ELIGIBLE'
    : eligibility.estimatedLenderRange[1] > 0 ? 'PARTIALLY_ELIGIBLE' : 'UNLIKELY';

  const affordabilityStatus = safeMaxEMI <= 0 || metrics.isOverleveraged
    ? 'UNSAFE'
    : profile.requestedAmount > eligibility.borrowerSafeRange[1] ? 'STRETCHED' : 'AFFORDABLE';

  const pricingStatus = profile.creditScoreStatus === '750_plus'
    ? 'PRIME'
    : profile.creditScoreStatus === 'unknown' ? 'UNCERTAIN' : 'COMPETITIVE';

  // Step 7: Tenure Matrix & Stress Scenario
  const baselinePrincipal = eligibility.borrowerSafeRange[1] > 0
    ? Math.min(profile.requestedAmount, eligibility.borrowerSafeRange[1])
    : profile.requestedAmount;
  const tenureMatrix = generateTenureMatrix(
    baselinePrincipal > 0 ? baselinePrincipal : profile.requestedAmount,
    midFairRate
  );
  const stressScenario = calculateStressScenario(
    profile, 
    safeMaxEMI, 
    overrides?.incomeStressPercent ?? 20
  );

  // Step 8: Verdict & Actionable "Better Alternative"
  let verdict: Verdict = 'BORROW';
  let verdictReason = '';
  let betterAlternative: BetterAlternative;

  // Anita Compounded Distress Check:
  const isCompoundedDistress = 
    facts.hasHighCostAppDebt && 
    facts.hasRecentBounce && 
    (metrics.disposableCash <= 0 || metrics.currentFOIR >= 25);

  if (isCompoundedDistress || safeMaxEMI <= 0 || metrics.isOverleveraged) {
    verdict = 'DON\'T BORROW YET';
    if (isCompoundedDistress) {
      verdictReason = 'You are servicing high-cost 30%+ instant app loans with a recent bounce and zero monthly cash surplus. Adding commercial debt now guarantees a debt spiral.';
      betterAlternative = {
        action: 'refinance_existing_debt_first',
        title: 'Refinance High-Cost App Loans First',
        recommendation: 'Do not take new commercial debt today. Explore regulated lower-cost restructuring (such as self-help micro-credit or non-profit debt consolidation) to retire 30%+ app debt.',
        illustrativeScenario: 'For illustration: Consolidating ₹35,000 at a regulated 15% rate over 24 months costs ~₹1,700/mo, instantly freeing up over ₹6,800 every month.'
      };
    } else if (metrics.currentFOIR >= (metrics.safeFOIRCapPercent ?? 35)) {
      verdictReason = `Existing loan repayments already consume ${Math.round(metrics.currentFOIR)}% of income (breaching the ${metrics.safeFOIRCapPercent}% safe ceiling).`;
      betterAlternative = {
        action: 'wait_and_rebuild_buffer',
        title: 'Wait and Pay Down Existing EMIs',
        recommendation: 'Wait until existing car/personal loans mature or pay down balances to bring your current FOIR below 25% before re-applying.'
      };
    } else {
      const expenseShare = Math.round((facts.effectiveExpensesWithSanityFloor / (facts.totalHouseholdIncome || 1)) * 100);
      verdictReason = `Household living expenses (₹${facts.effectiveExpensesWithSanityFloor.toLocaleString('en-IN')}/mo) consume ${expenseShare}% of monthly income, leaving zero uncommitted cash buffer for new loan EMIs.`;
      betterAlternative = {
        action: 'wait_and_rebuild_buffer',
        title: 'Build Cash Surplus Before Borrowing',
        recommendation: 'Your essential living costs leave no safe margin for monthly repayments. Focus on trimming expenses or increasing income to create a liquid cushion before committing to new debt.'
      };
    }
  } else if (
    profile.requestedAmount > eligibility.borrowerSafeRange[1] * 1.15 ||
    stressScenario.isBreached ||
    (eligibility.inferredProductRoute.includes('LAP') && profile.requestedAmount >= 1000000)
  ) {
    verdict = 'BORROW LESS';
    if (eligibility.inferredProductRoute.includes('LAP') && facts.hasCollateral) {
      verdictReason = `Borrowing ₹${(profile.requestedAmount / 100000).toFixed(0)}L as an unsecured personal loan is unsafe on documented ITR cash flow. Route through a Secured Loan Against Property (LAP) to cut your rate in half.`;
      betterAlternative = {
        action: 'use_secured_product_instead',
        title: 'Pledge Unencumbered Commercial/Residential Property',
        recommendation: 'Do not accept an unsecured personal loan quote. Ask your bank for a Secured LAP / MSME Vyapar Loan at 9.0%–10.5% for 7–10 years.',
        illustrativeScenario: 'At 9.75% over 7 years, ₹15 Lakhs costs ~₹24,780/mo (saving ₹12,500/mo vs a 5-year unsecured loan at 17%).'
      };
    } else if (profile.requestedAmount > eligibility.borrowerSafeRange[1]) {
      const reqL = (profile.requestedAmount / 100000).toFixed(1);
      const safeL = (eligibility.borrowerSafeRange[1] / 100000).toFixed(1);
      verdictReason = `Your requested loan of ₹${reqL}L exceeds your safe cash-flow capacity (₹${safeL}L). Trimming the principal protects your monthly living budget.`;
      betterAlternative = {
        action: 'borrow_less',
        title: `Trim Loan Request to ₹${safeL} Lakhs`,
        recommendation: `Cap your loan request at ₹${safeL}L. This keeps your monthly commitment within your safe EMI ceiling of ₹${safeMaxEMI.toLocaleString('en-IN')}/mo.`
      };
    } else {
      verdictReason = 'A 20% income reduction pushes debt servicing into the danger zone. Reducing the principal amount guarantees long-term affordability.';
      betterAlternative = {
        action: 'borrow_less',
        title: 'Reduce Loan to Cushion Income Shocks',
        recommendation: 'Lower the requested principal by 15%–20% to ensure your household can comfortably survive economic downturns.'
      };
    }
  } else {
    verdict = 'BORROW';
    verdictReason = 'Your income stability, modest existing obligations, and healthy cash-flow buffer comfortably support this requested loan.';
    betterAlternative = {
      action: 'borrow_now',
      title: 'Proceed with Prime Loan Negotiation',
      recommendation: 'Your profile qualifies for prime terms. Negotiate firmly for 10.5%–11.5% interest and request a processing fee waiver.'
    };
  }

  // Step 9: Why We Stopped Asking Questions Explanation
  const stoppingExplanation = 'Assessment complete. The engine stopped asking questions because remaining unanswered variables would not materially alter your safe borrowing range, rate band, or EMI ceiling.';
  const highestRemainingInformationGap = profile.creditScoreStatus === 'unknown'
    ? 'Verified bureau credit report (Checking actual score will narrow the fair rate band by ~200 bps).'
    : undefined;

  // Step 10: Tailored Negotiation Script
  const negotiationPoints: string[] = [
    `Demand All-In APR Disclosure: "Please provide the official all-inclusive APR including processing fees and 18% GST in writing."`,
    `Counter High Initial Quotes: Your fair rate band is ${rateAnalysis.fairRateRange[0]}%–${rateAnalysis.fairRateRange[1]}%. Firmly decline initial quotes above this range.`,
    `Cap the Upfront Processing Charge: Standard 2% fees can routinely be negotiated down to 0.75%–1% for creditworthy borrowers.`
  ];

  if (eligibility.inferredProductRoute.includes('LAP')) {
    negotiationPoints.unshift('Do not apply for retail personal loans. Ask the bank for an MSME Loan Against Property (LAP) / Vyapar Loan at 9.0%–10.5%.');
  }

  const doNotCrossRules: string[] = [
    `Never agree to an EMI higher than ₹${safeMaxEMI.toLocaleString('en-IN')}/month (${safeEMITrace.bindingRule === 'cash_flow_floor' ? 'Hard cash-flow floor' : '35% FOIR cap'}).`,
    `Never permit single-premium loan insurance to be added into your loan principal.`,
    `Do not stretch tenure beyond 48 months for unsecured consumption loans just to artificially lower the EMI.`
  ];

  return {
    verdict,
    verdictReason,
    betterAlternative,
    eligibilityStatus,
    estimatedLenderRange: eligibility.estimatedLenderRange,
    lenderRangeTrace,
    affordabilityStatus,
    borrowerSafeRange: eligibility.borrowerSafeRange,
    recommendedMaxEMI: safeMaxEMI,
    safeEMITrace,
    safeAmountTrace,
    pricingStatus,
    fairRateRange: rateAnalysis.fairRateRange,
    expectedLenderQuoteRange: rateAnalysis.expectedLenderQuoteRange,
    effectiveAPRRange: aprAnalysis.effectiveAPRRange,
    processingFeePercent: aprAnalysis.processingFeePercent,
    rateTrace,
    tenureMatrix,
    stressScenario,
    confidence: rateAnalysis.confidence,
    confidenceReasons: rateAnalysis.confidenceReasons,
    stoppingExplanation,
    highestRemainingInformationGap,
    inferredProductRoute: eligibility.inferredProductRoute,
    productRouteRationale: eligibility.productRouteRationale,
    negotiationPoints,
    doNotCrossRules
  };
}

/**
 * FEATURE 5: LENDER QUOTE COMPARISON ("BANK REALITY CHECK")
 * Allows borrowers to input an actual quote received from a sales executive
 * and compares it against fair market pricing and safe EMI ceilings.
 */
export function evaluateLenderQuote(
  quote: LenderQuoteInput,
  assessment: Assessment
): LenderQuoteEvaluation {
  const fairRateMin = assessment.fairRateRange[0];
  const fairRateMax = assessment.fairRateRange[1];

  // 1. Quoted Monthly EMI (Standard reducing balance amortization)
  const quotedMonthlyEMI = calculateEMI(quote.loanAmount, quote.quotedInterestRate, quote.tenureMonths);
  const isEMIExceeded = quotedMonthlyEMI > assessment.recommendedMaxEMI;

  // 2. Rate Variance in basis points
  const midFairRate = (fairRateMin + fairRateMax) / 2;
  const rateVarianceBps = Math.round((quote.quotedInterestRate - midFairRate) * 100);

  // 3. Upfront charges with 18% GST on processing fee
  const feeWithGST = Math.round((quote.loanAmount * quote.processingFeePercent / 100) * 1.18);
  const totalUpfront = feeWithGST + (quote.mandatoryInsuranceOrCharges || 0);

  // 4. Exact Actuarial All-In APR (Solving for internal rate of return)
  // Net disbursed = Principal - Upfront charges
  const netDisbursed = quote.loanAmount - totalUpfront;
  let effectiveAllInAPR = quote.quotedInterestRate;

  if (netDisbursed > 0 && quotedMonthlyEMI > 0 && quote.tenureMonths > 0) {
    let r = (quotedMonthlyEMI * quote.tenureMonths - netDisbursed) / (netDisbursed * quote.tenureMonths);
    if (r <= 0) r = quote.quotedInterestRate / 1200;

    for (let i = 0; i < 25; i++) {
      const pow = Math.pow(1 + r, -quote.tenureMonths);
      const f = (quotedMonthlyEMI * (1 - pow) / r) - netDisbursed;
      const df = quotedMonthlyEMI * ((quote.tenureMonths * pow / (1 + r)) - ((1 - pow) / (r * r)));
      if (Math.abs(df) < 1e-12) break;
      const nextR = r - f / df;
      if (Math.abs(nextR - r) < 1e-7) {
        r = nextR;
        break;
      }
      r = nextR > 0 ? nextR : r / 2;
    }
    effectiveAllInAPR = Number((r * 12 * 100).toFixed(2));
  }

  // 5. Total Cost of Credit and Total Outflow
  const totalInterest = Math.max(0, (quotedMonthlyEMI * quote.tenureMonths) - quote.loanAmount);
  const totalCostOfCredit = Math.round(totalInterest + totalUpfront);
  const totalOutflow = Math.round(quote.loanAmount + totalCostOfCredit);

  // 6. Verdict Determination
  let verdict: 'FAIR' | 'SLIGHTLY_HIGH' | 'ABOVE_FAIR_RANGE' | 'PREDATORY' = 'FAIR';
  const isExtremelyExceeded = quotedMonthlyEMI > assessment.recommendedMaxEMI * 1.15;

  if (isExtremelyExceeded || quote.quotedInterestRate >= fairRateMax + 2.5 || effectiveAllInAPR >= fairRateMax + 3.5) {
    verdict = 'PREDATORY';
  } else if (isEMIExceeded || quote.quotedInterestRate > fairRateMax) {
    verdict = 'ABOVE_FAIR_RANGE';
  } else if (quote.quotedInterestRate > fairRateMin + 0.5 || effectiveAllInAPR > fairRateMax) {
    verdict = 'SLIGHTLY_HIGH';
  }

  // 7. Counter-Offer Advice (Clean text, no emojis)
  const counterOfferAdvice: string[] = [];
  if (quote.quotedInterestRate > fairRateMax) {
    counterOfferAdvice.push(`Quoted interest rate (${quote.quotedInterestRate}%) is ${rateVarianceBps} bps above your fair band (${fairRateMin}%–${fairRateMax}%). Counter with: "My verified profile qualifies for ${fairRateMin}%. Please escalate to your credit manager."`);
  }
  if (isEMIExceeded) {
    counterOfferAdvice.push(`Quoted monthly EMI of ₹${quotedMonthlyEMI.toLocaleString('en-IN')}/mo exceeds your safe ceiling of ₹${assessment.recommendedMaxEMI.toLocaleString('en-IN')}/mo by ₹${(quotedMonthlyEMI - assessment.recommendedMaxEMI).toLocaleString('en-IN')}/mo. Reduce the loan principal to match your cash flow.`);
  }
  if (quote.mandatoryInsuranceOrCharges > 0) {
    counterOfferAdvice.push(`Insurance charges of ₹${quote.mandatoryInsuranceOrCharges.toLocaleString('en-IN')} are bundled into the quote. Request: "I already hold existing term life cover; remove the mandatory loan protection charge."`);
  }
  if (quote.processingFeePercent > 1.0) {
    counterOfferAdvice.push(`Processing fee of ${quote.processingFeePercent}% is higher than competitive tier-1 benchmarks. Request: "Please reduce processing fees to 0.5%–0.75% to match market standards."`);
  }

  return {
    verdict,
    quotedRate: quote.quotedInterestRate,
    fairRateRange: assessment.fairRateRange,
    rateVarianceBps,
    quotedMonthlyEMI,
    safeMaxEMI: assessment.recommendedMaxEMI,
    isEMIExceeded,
    effectiveAllInAPR,
    totalOutflow,
    totalCostOfCredit,
    counterOfferAdvice
  };
}

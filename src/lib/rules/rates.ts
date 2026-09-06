import { BorrowerProfile, ConfidenceLevel } from '../types';

/**
 * Calculates fair market interest rate bands and expected lender quotes.
 * 
 * CORE PRINCIPLE:
 * - Credit Score = Unknown is NOT modeled as 300.
 * - Unknown bureau history transparently widens the fair-rate band and downgrades confidence.
 * - Business vintage / stability provides measurable mitigating impact.
 */
export function calculateFairRates(profile: BorrowerProfile): {
  fairRateRange: [number, number];
  expectedLenderQuoteRange: [number, number];
  confidence: ConfidenceLevel;
  confidenceReasons: string[];
  rateExplanation: string;
} {
  const confidenceReasons: string[] = [];

  // 1. Base rate by inferred security
  let baseMin = 11.0;
  let baseMax = 12.5;

  if (profile.hasUnencumberedCollateral && (profile.collateralEstimatedValue || 0) >= 2000000) {
    baseMin = 9.0;
    baseMax = 10.5;
    confidenceReasons.push('Unencumbered property collateral unlocks prime secured LAP pricing.');
  }

  // 2. Adjust by Credit Bureau Status
  let scoreAdjustmentMin = 0;
  let scoreAdjustmentMax = 0;

  switch (profile.creditScoreStatus) {
    case '750_plus':
      scoreAdjustmentMin = -0.75;
      scoreAdjustmentMax = -0.50;
      confidenceReasons.push('Strong credit score (750+) qualifies for tier-1 prime bank rates.');
      break;
    case '700_749':
      scoreAdjustmentMin = 0.5;
      scoreAdjustmentMax = 1.0;
      confidenceReasons.push('Good credit score (700–749) qualifies for competitive pricing.');
      break;
    case '650_699':
      scoreAdjustmentMin = 2.0;
      scoreAdjustmentMax = 3.5;
      confidenceReasons.push('Sub-prime credit score (650–699) incurs standard NBFC risk premium.');
      break;
    case 'below_650':
      scoreAdjustmentMin = 4.5;
      scoreAdjustmentMax = 7.0;
      confidenceReasons.push('Low credit score (<650) incurs high risk pricing from fintech/NBFCs.');
      break;
    case 'unknown':
    default:
      // Unknown credit score: Widen band without pretending a score exists
      scoreAdjustmentMin = 0.75;
      scoreAdjustmentMax = 3.5;
      confidenceReasons.push('Credit bureau history is unknown; fair rate band is widened to reflect underwriting uncertainty.');
      break;
  }

  // 3. Vintage & Track Record Mitigation
  let stabilityAdjustment = 0;
  if (profile.businessVintageYears && profile.businessVintageYears >= 10) {
    // 10+ years operating history provides deterministic proof of cash-flow resilience
    stabilityAdjustment -= 0.5;
    confidenceReasons.push('Long business operating vintage (10+ years) mitigates lack of formal bureau score.');
  } else if (profile.professionalPracticeYears && profile.professionalPracticeYears >= 3) {
    // 3+ years active licensed practice qualifies for prime professional rates
    stabilityAdjustment -= 0.5;
    confidenceReasons.push('Verified professional practice vintage (3+ years) qualifies for specialized low-rate doctor/CA loan tiers.');
  } else if (profile.primaryIncomeSignal === 'gig_freelance') {
    stabilityAdjustment += 2.0;
  }

  // 4. High-cost debt risk penalty
  if (profile.hasHighCostAppLoans) {
    stabilityAdjustment += 3.0;
    confidenceReasons.push('Active 30%+ app debt indicates high credit distress.');
  }

  const fairMin = Number((baseMin + scoreAdjustmentMin + stabilityAdjustment).toFixed(2));
  const fairMax = Number((baseMax + scoreAdjustmentMax + stabilityAdjustment).toFixed(2));

  // Initial sales pitches quote 1.5% to 2.5% higher before counter-offer
  const lenderQuoteMin = Number((fairMin + 1.25).toFixed(2));
  const lenderQuoteMax = Number((fairMax + 2.50).toFixed(2));

  // Determine Confidence
  let confidence: ConfidenceLevel = 'HIGH';
  if (profile.creditScoreStatus === 'unknown') {
    confidence = 'MEDIUM';
  }
  if (profile.creditScoreStatus === 'unknown' && (profile.primaryIncomeSignal === 'gig_freelance' || profile.hasHighCostAppLoans)) {
    confidence = 'LOW';
  }

  const rateExplanation = `Fair market interest for this profile is ${fairMin}%–${fairMax}%. Lenders typically pitch initial quotes at ${lenderQuoteMin}%–${lenderQuoteMax}%. Use your safe metrics to negotiate down into the fair range.`;

  return {
    fairRateRange: [fairMin, fairMax],
    expectedLenderQuoteRange: [lenderQuoteMin, lenderQuoteMax],
    confidence,
    confidenceReasons,
    rateExplanation
  };
}

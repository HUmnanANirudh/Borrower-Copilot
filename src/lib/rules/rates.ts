import { BorrowerProfile, ConfidenceLevel } from '../types';

/**
 * Calculates fair market interest rate bands and expected lender quotes.
 * 
 * CORE RULE:
 * Credit Score = Unknown must NEVER be converted to 0 or treated as a rejection.
 * Instead, it widens the fair-rate band and flags Low/Medium confidence.
 */
export function calculateFairRates(profile: BorrowerProfile): {
  fairRateRange: [number, number];
  expectedLenderQuoteRange: [number, number];
  confidence: ConfidenceLevel;
  confidenceReasons: string[];
  rateExplanation: string;
} {
  const confidenceReasons: string[] = [];

  // Base rate by loan type
  let baseMin = 11.0;
  let baseMax = 12.5;

  if (profile.loanType === 'secured_property_lap' || profile.hasCollateralProperty) {
    baseMin = 8.75;
    baseMax = 10.25;
  } else if (profile.loanType === 'business_working_capital') {
    baseMin = 13.0;
    baseMax = 16.0;
  } else if (profile.loanType === 'gold_asset_loan') {
    baseMin = 8.5;
    baseMax = 10.0;
  }

  // Adjust by Credit Score Band
  let scoreAdjustmentMin = 0;
  let scoreAdjustmentMax = 0;
  let scoreConfidencePenalty = false;

  switch (profile.creditScoreBand) {
    case '750_plus':
      scoreAdjustmentMin = -0.75;
      scoreAdjustmentMax = -0.50;
      confidenceReasons.push('Strong credit score (750+) secures prime bank pricing tier.');
      break;
    case '700_749':
      scoreAdjustmentMin = 0.5;
      scoreAdjustmentMax = 1.0;
      confidenceReasons.push('Good credit profile (700-749) qualifies for competitive rates.');
      break;
    case '650_699':
      scoreAdjustmentMin = 2.0;
      scoreAdjustmentMax = 3.5;
      confidenceReasons.push('Average credit (650-699) attracts sub-prime risk premium from NBFCs.');
      break;
    case 'below_650':
      scoreAdjustmentMin = 4.0;
      scoreAdjustmentMax = 6.5;
      confidenceReasons.push('Low credit score (<650) risks punitive pricing or rejection.');
      break;
    case 'unknown':
    default:
      // Unknown credit score: Widen band!
      scoreAdjustmentMin = 0.5;
      scoreAdjustmentMax = 3.5;
      scoreConfidencePenalty = true;
      confidenceReasons.push('Credit score is unknown; rate band is widened by 300 bps to account for bureau risk.');
      break;
  }

  // Adjust by Employment & Stability
  let employmentAdjustment = 0;
  if (profile.incomeType === 'salaried_corporate') {
    employmentAdjustment = 0;
  } else if (profile.incomeType === 'self_employed_professional') {
    employmentAdjustment = 0.5;
  } else if (profile.incomeType === 'self_employed_business') {
    employmentAdjustment = 1.5;
  } else if (profile.incomeType === 'salaried_informal' || profile.incomeType === 'gig_freelance') {
    employmentAdjustment = 2.5;
    confidenceReasons.push('Informal or gig earnings have wider lender underwriting variance.');
  }

  if (profile.jobStability === 'frequent_switches' || profile.jobStability === 'new_employment_sub_6m') {
    employmentAdjustment += 1.0;
  }

  const fairMin = Number((baseMin + scoreAdjustmentMin + employmentAdjustment).toFixed(2));
  const fairMax = Number((baseMax + scoreAdjustmentMax + employmentAdjustment).toFixed(2));

  // Lenders typically quote 1.5% to 3.0% higher in direct sales before negotiation
  const lenderQuoteMin = Number((fairMin + 1.25).toFixed(2));
  const lenderQuoteMax = Number((fairMax + 2.50).toFixed(2));

  // Determine confidence level
  let confidence: ConfidenceLevel = 'HIGH';
  if (scoreConfidencePenalty || profile.jobStability === 'new_employment_sub_6m') {
    confidence = 'MEDIUM';
  }
  if (scoreConfidencePenalty && (profile.incomeType === 'salaried_informal' || profile.incomeType === 'gig_freelance')) {
    confidence = 'LOW';
  }

  const rateExplanation = `Fair interest for your profile is ${fairMin}%–${fairMax}%. Lenders will likely open negotiations quoting ${lenderQuoteMin}%–${lenderQuoteMax}%. Counter-quote within the fair band using your safe borrowing metrics.`;

  return {
    fairRateRange: [fairMin, fairMax],
    expectedLenderQuoteRange: [lenderQuoteMin, lenderQuoteMax],
    confidence,
    confidenceReasons,
    rateExplanation
  };
}

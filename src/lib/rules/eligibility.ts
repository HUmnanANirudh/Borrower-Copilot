import { BorrowerProfile } from '../types';

/**
 * Standard reverse EMI amortization formula:
 * P = (E * ((1 + r)^n - 1)) / (r * (1 + r)^n)
 */
export function calculatePrincipalFromEMI(emi: number, annualRatePercent: number, tenureMonths: number): number {
  if (emi <= 0 || annualRatePercent <= 0 || tenureMonths <= 0) return 0;
  const r = annualRatePercent / (12 * 100);
  const factor = Math.pow(1 + r, tenureMonths);
  const principal = (emi * (factor - 1)) / (r * factor);
  return Math.max(0, Math.round(principal));
}

export interface EligibilityResult {
  estimatedLenderRange: [number, number];
  borrowerSafeRange: [number, number];
  inferredProductRoute: string;
  productRouteRationale: string;
  isSanctionInflationHigh: boolean;
}

/**
 * Evaluates Estimated Lender-Eligible Range versus Borrower-Safe Range.
 *
 * CORE PHILOSOPHICAL REFINEMENT:
 * - We do NOT claim to know a proprietary bank algorithm ("Bank will sanction X").
 * - We provide an "Estimated lender-eligible range based on public credit constraints and product norms".
 * - Inferred Product Routing: Borrowers are never forced to choose between LAP vs Personal Loan upfront.
 *   The engine infers the optimal instrument based on:
 *   Purpose + Ticket Size + Security/Collateral + Cash Flow Capacity.
 */
export function calculateEligibilityAndSanction(
  profile: BorrowerProfile,
  safeMaxEMI: number,
  fairAnnualRate: number
): EligibilityResult {
  const totalIncome = profile.netMonthlyIncome + (profile.coApplicantIncome || 0);
  const existingEMI = profile.existingMonthlyEMI;

  // 1. Inferred Product Routing
  let inferredProductRoute = 'Unsecured Personal Loan';
  let productRouteRationale = 'Standard unsecured personal credit based on verifiable regular salary income.';

  const isHighTicket = profile.requestedAmount >= 1000000;
  const hasSubstantialCollateral = profile.hasUnencumberedCollateral && (profile.collateralEstimatedValue || 0) >= 2000000;

  if (hasSubstantialCollateral && (isHighTicket || profile.loanPurpose === 'business_expansion')) {
    inferredProductRoute = 'Secured Loan Against Property (LAP)';
    productRouteRationale = `You own unencumbered property worth ~₹${((profile.collateralEstimatedValue || 0) / 100000).toFixed(0)}L. Taking ₹10L+ as an unsecured personal loan carries punitive 15%–20% rates with short 5-year tenures. Pledging property as security unlocks a 7–10 year LAP at 9.0%–10.5% interest, cutting your monthly EMI in half.`;
  } else if (profile.hasHighCostAppLoans && profile.loanPurpose === 'debt_consolidation') {
    inferredProductRoute = 'Microfinance / Self-Help Group (SHG) Debt Restructuring';
    productRouteRationale = 'Servicing predatory 30%+ instant loan apps leaves negative cash flow. Refinance via formal MFI/SHG credit (12%–16%) to extinguish app loans before taking any new commercial credit.';
  } else if (profile.loanPurpose === 'asset_vehicle') {
    inferredProductRoute = 'Hypothecated Commercial Vehicle / Two-Wheeler Loan';
    productRouteRationale = 'Secured vehicle hypothecation yields 11%–14% rates, lower than general unsecured personal credit.';
  }

  // 2. Estimated Lender Eligibility (Bank 50%-60% FOIR with aggressive 60m tenure)
  // Self-employed ITR constraint check:
  // If self-employed, banks underwrite strictly on documented ITR net income, NOT gross cash turnover.
  let lenderAssessedIncome = totalIncome;
  if (profile.primaryIncomeSignal === 'self_employed_business' && profile.itrDeclaredMonthlyTaxable) {
    lenderAssessedIncome = profile.itrDeclaredMonthlyTaxable + (profile.coApplicantIncome || 0);
  } else if (profile.primaryIncomeSignal === 'gig_freelance') {
    // Formal lenders haircut unverified gig earnings by 35%
    lenderAssessedIncome = totalIncome * 0.65;
  }

  const lenderFOIR = profile.creditScoreStatus === '750_plus' ? 0.60 : 0.50;
  const lenderMaxEMI = Math.max(0, (lenderAssessedIncome * lenderFOIR) - existingEMI);

  // If secured LAP route: tenure can stretch to 84-120 months and LTV caps at 50%-60% of property
  let estimatedLenderMax = 0;
  let estimatedLenderMin = 0;

  if (inferredProductRoute === 'Secured Loan Against Property (LAP)') {
    const ltvCap = (profile.collateralEstimatedValue || 4000000) * 0.50; // 50% conservative LTV
    const cashFlowLenderAmount = calculatePrincipalFromEMI(lenderMaxEMI, 10.0, 84); // 7-year tenure
    estimatedLenderMax = Math.min(ltvCap, Math.max(profile.requestedAmount, cashFlowLenderAmount));
    estimatedLenderMin = estimatedLenderMax * 0.75;
  } else {
    estimatedLenderMax = calculatePrincipalFromEMI(lenderMaxEMI, fairAnnualRate + 1.5, 60);
    estimatedLenderMin = calculatePrincipalFromEMI(lenderMaxEMI * 0.85, fairAnnualRate + 2.0, 48);
  }

  // 3. Borrower-Safe Amount (Strictly bounded by safeMaxEMI over 36-48 months)
  const borrowerSafeMax = calculatePrincipalFromEMI(safeMaxEMI, fairAnnualRate, 48);
  const borrowerSafeMin = calculatePrincipalFromEMI(safeMaxEMI * 0.85, fairAnnualRate, 36);

  // Round to clean ₹10,000 increments
  const finalLenderRange: [number, number] = [
    Math.round(estimatedLenderMin / 10000) * 10000,
    Math.round(estimatedLenderMax / 10000) * 10000
  ];

  const finalSafeRange: [number, number] = [
    Math.round(borrowerSafeMin / 10000) * 10000,
    Math.round(borrowerSafeMax / 10000) * 10000
  ];

  const isSanctionInflationHigh = finalLenderRange[1] > finalSafeRange[1] * 1.25;

  return {
    estimatedLenderRange: finalLenderRange,
    borrowerSafeRange: finalSafeRange,
    inferredProductRoute,
    productRouteRationale,
    isSanctionInflationHigh
  };
}

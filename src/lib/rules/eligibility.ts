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

/**
 * Evaluates Lender Eligibility (how much a bank will aggressively sanction)
 * versus Borrower-Safe Affordability (what the borrower can safely repay).
 */
export function calculateEligibilityAndSanction(
  profile: BorrowerProfile,
  safeMaxEMI: number,
  fairAnnualRate: number
): {
  lenderSanctionRange: [number, number];
  borrowerSafeRange: [number, number];
  lenderMaxEMI: number;
  productRoutingHint?: string;
  isSanctionInflationHigh: boolean;
} {
  const netIncome = Math.max(0, profile.netMonthlyIncome);
  const existingEMI = Math.max(0, profile.existingMonthlyEMI);

  // Bank/Lender aggressive FOIR: 50% to 60%
  // Prime salaried banks will push up to 55-60%, NBFCs up to 60-65%
  const lenderFOIR = profile.creditScoreBand === '750_plus' ? 0.60 : 0.50;
  const lenderMaxEMI = Math.max(0, (netIncome * lenderFOIR) - existingEMI);

  // Lenders typically push 60-month (5-year) tenures to artificially inflate loan amount
  const lenderPrincipalMax = calculatePrincipalFromEMI(lenderMaxEMI, fairAnnualRate + 1.5, 60);
  const lenderPrincipalMin = calculatePrincipalFromEMI(lenderMaxEMI * 0.85, fairAnnualRate + 2.0, 48);

  // Borrower-Safe tenure recommendation is conservative: 36 to 48 months
  const borrowerSafeMax = calculatePrincipalFromEMI(safeMaxEMI, fairAnnualRate, 48);
  const borrowerSafeMin = calculatePrincipalFromEMI(safeMaxEMI * 0.85, fairAnnualRate, 36);

  // Product routing intelligence:
  // e.g. Self-employed SME (Ravi) asking for ₹15L as unsecured personal loan
  let productRoutingHint: string | undefined;
  if (
    profile.incomeType === 'self_employed_business' && 
    profile.requestedAmount >= 1000000 &&
    profile.loanType === 'unsecured_personal'
  ) {
    productRoutingHint = 'Redirect to Secured LAP / MSME Business Loan. Taking ₹10L+ as an unsecured personal loan carries punitive 15-18% rates; a loan against property or machinery unlocks 9-11% interest with longer tenure.';
  } else if (profile.hasCollateralProperty && profile.requestedAmount >= 1000000) {
    productRoutingHint = 'Collateral available: Pledging commercial/residential property for a Loan Against Property (LAP) cuts interest rate by ~300-500 bps.';
  }

  // Check if lender sanction is significantly higher than safe borrowing (trap alert)
  const isSanctionInflationHigh = lenderPrincipalMax > borrowerSafeMax * 1.25;

  return {
    lenderSanctionRange: [
      Math.round(lenderPrincipalMin / 10000) * 10000,
      Math.round(lenderPrincipalMax / 10000) * 10000
    ],
    borrowerSafeRange: [
      Math.round(borrowerSafeMin / 10000) * 10000,
      Math.round(borrowerSafeMax / 10000) * 10000
    ],
    lenderMaxEMI: Math.round(lenderMaxEMI),
    productRoutingHint,
    isSanctionInflationHigh
  };
}

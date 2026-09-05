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
 *
 * Distinctive Route Handling:
 * - Ravi: ₹15L requested on ₹78k household income with ITR showing ₹35k/mo.
 *   Unsecured personal loan eligibility caps at ₹4L–₹6L (or outright rejection due to low ITR).
 *   However, unencumbered ₹45L shop premises unlocks Secured LAP / Business loan up to ₹25L+ at 9.5%.
 * - Priya: Prime salaried, high sanction (₹12L–₹14L), safe ceiling is ₹7.5L–₹8.5L.
 * - Anita: High-risk overleverage, safe amount is ₹0 (restructure first).
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
  alternativeProduct?: {
    name: string;
    rateRange: [number, number];
    possibleAmount: [number, number];
    rationale: string;
  };
} {
  const netIncome = Math.max(0, profile.netMonthlyIncome);
  const existingEMI = Math.max(0, profile.existingMonthlyEMI);

  // Bank/Lender aggressive FOIR: 50% to 60%
  // Prime salaried gets 55%-60%. Self-employed without audited ITR gets 45%-50% of ITR income!
  let assessedIncomeForLender = netIncome;
  if (profile.incomeType === 'self_employed_business' && profile.itrDeclaredNetMonthly) {
    // Banks underwrite on ITR declared income (not unverified cash profit)
    assessedIncomeForLender = profile.itrDeclaredNetMonthly;
  } else if (profile.incomeType === 'gig_freelance') {
    // Informal/gig gets 40% haircut from formal lenders
    assessedIncomeForLender = netIncome * 0.65;
  }

  const lenderFOIR = profile.creditScoreBand === '750_plus' ? 0.60 : 0.50;
  const lenderMaxEMI = Math.max(0, (assessedIncomeForLender * lenderFOIR) - existingEMI);

  // Lenders stretch tenure to 60 months (5 years) to inflate sanctioned principal
  const lenderPrincipalMax = calculatePrincipalFromEMI(lenderMaxEMI, fairAnnualRate + 1.5, 60);
  const lenderPrincipalMin = calculatePrincipalFromEMI(lenderMaxEMI * 0.85, fairAnnualRate + 2.0, 48);

  // Borrower-Safe tenure recommendation is conservative: 36 to 48 months
  const borrowerSafeMax = calculatePrincipalFromEMI(safeMaxEMI, fairAnnualRate, 48);
  const borrowerSafeMin = calculatePrincipalFromEMI(safeMaxEMI * 0.85, fairAnnualRate, 36);

  // Product Routing Intelligence:
  let productRoutingHint: string | undefined;
  let alternativeProduct: any = undefined;

  // RAVI CASE: Kirana owner wanting ₹15L for business, owns ₹45L unencumbered shop
  if (profile.hasCollateralProperty && profile.collateralValue && profile.collateralValue >= 2000000) {
    if (profile.loanType === 'unsecured_personal' && profile.requestedAmount >= 1000000) {
      productRoutingHint = `Crucial Routing: Do not take ₹15L as an Unsecured Personal Loan. Banks will cap you at ₹4L–₹6L due to ITR limits, or charge 16%–21% interest. Your unencumbered ₹45L shop premises qualifies you for a Secured Loan Against Property (LAP) at 9.0%–10.5% for up to ₹25L.`;
      alternativeProduct = {
        name: 'Secured Loan Against Property (LAP)',
        rateRange: [9.0, 10.5],
        possibleAmount: [1500000, 2500000],
        rationale: 'Pledging commercial shop collateral lowers interest by 600–900 bps and allows a comfortable 7–10 year business loan tenure.'
      };
    }
  } else if (profile.incomeType === 'self_employed_business' && profile.requestedAmount >= 1000000) {
    productRoutingHint = 'For business amounts above ₹10L, formal MSME CGTMSE schemes or equipment loans offer significantly better rates than retail personal loans.';
  }

  // ANITA CASE: High-cost informal app loans at 30%+
  if (profile.hasInformalHighCostDebt && profile.recentDelinquencyOrBounce) {
    productRoutingHint = 'Urgent Debt Warning: You are servicing 3 high-cost loan apps at 30%+ interest with a recent bounce. Taking another ₹1.5L loan will accelerate default. Route to debt consolidation / Stree Nidhi / MFI loan at 12%-18% to replace 30%+ debt first.';
  }

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
    alternativeProduct,
    isSanctionInflationHigh
  };
}

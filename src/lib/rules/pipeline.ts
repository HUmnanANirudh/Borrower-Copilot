import { BorrowerProfile, NormalizedFacts, DerivedMetrics } from '../types';

/**
 * Normalizes raw borrower inputs into clean facts.
 * 
 * Includes:
 * 1. Variable compensation haircut for salaried (50% haircut if variable > 15%).
 * 2. Expense Sanity Floor:
 *    If a borrower claims unrealistically low expenses (e.g. ₹1L income but claims ₹5k expenses),
 *    enforce an urban minimum subsistence floor (at least 20% of net income or ₹12,000).
 */
export function normalizeFacts(profile: BorrowerProfile): NormalizedFacts {
  const primaryIncome = Math.max(0, profile.netMonthlyIncome);
  const coIncome = Math.max(0, profile.coApplicantIncome || 0);
  const totalHouseholdIncome = primaryIncome + coIncome;

  // Variable Pay Haircut
  let effectiveIncomeAfterHaircut = totalHouseholdIncome;
  if (profile.variablePayPortionPercent && profile.variablePayPortionPercent > 15) {
    const variablePortion = (profile.variablePayPortionPercent / 100) * primaryIncome;
    effectiveIncomeAfterHaircut = totalHouseholdIncome - (variablePortion * 0.5);
  }

  // Expense Sanity Floor (Adversarial edge case: claims ₹5,000 on ₹1,00,000 income)
  const statedExpenses = Math.max(0, profile.householdLivingExpenses);
  const minimumSubsistenceFloor = Math.max(12000, totalHouseholdIncome * 0.20);
  const isExpenseSanityApplied = statedExpenses < minimumSubsistenceFloor && totalHouseholdIncome > 30000;
  const effectiveExpensesWithSanityFloor = isExpenseSanityApplied ? minimumSubsistenceFloor : statedExpenses;

  return {
    primaryIncome,
    coIncome,
    totalHouseholdIncome,
    effectiveIncomeAfterHaircut,
    existingEMI: Math.max(0, profile.existingMonthlyEMI),
    statedExpenses,
    effectiveExpensesWithSanityFloor,
    isExpenseSanityApplied,
    creditScoreStatus: profile.creditScoreStatus || 'unknown',
    requestedAmount: Math.max(10000, profile.requestedAmount),
    hasCollateral: Boolean(profile.hasUnencumberedCollateral),
    collateralValue: Math.max(0, profile.collateralEstimatedValue || 0),
    hasHighCostAppDebt: Boolean(profile.hasHighCostAppLoans),
    hasRecentBounce: Boolean(profile.recentDelinquencyOrBounce),
    emergencySavingsMonths: profile.emergencySavingsMonths ?? 0,
    businessVintageYears: profile.businessVintageYears ?? 0,
  };
}

/**
 * Computes derived risk, cash-flow, and capacity metrics.
 */
export function deriveMetrics(facts: NormalizedFacts, profile: BorrowerProfile): DerivedMetrics {
  const income = facts.effectiveIncomeAfterHaircut;
  const existingEMI = facts.existingEMI;
  const expenses = facts.effectiveExpensesWithSanityFloor;

  // 1. Current FOIR
  const currentFOIR = income > 0 ? (existingEMI / income) * 100 : 100;

  // 2. Cash-Flow Floor
  const disposableCash = Math.max(0, income - expenses - existingEMI);
  const untouchableReserveBuffer = income * 0.10; // 10% emergency cushion
  const uncommittedCashFlowFloor = Math.max(0, disposableCash - untouchableReserveBuffer);

  // 3. Safe FOIR Cap
  let safeFOIRCapPercent = 35;
  if (profile.primaryIncomeSignal === 'gig_freelance' || profile.primaryIncomeSignal === 'salaried_informal') {
    safeFOIRCapPercent = 25; // Gig cash flow fluctuates
  }

  const maxAllowableDebtServicing = (income * safeFOIRCapPercent) / 100;
  const foirCeiling = Math.max(0, maxAllowableDebtServicing - existingEMI);

  // 4. Overleverage Check
  const isOverleveraged = currentFOIR >= 35 || (expenses + existingEMI) >= (facts.totalHouseholdIncome * 0.90);

  // 5. Debt Distress Score (0 to 100)
  let debtDistressScore = 0;
  if (facts.hasHighCostAppDebt) debtDistressScore += 35;
  if (facts.hasRecentBounce) debtDistressScore += 30;
  if (currentFOIR >= 30) debtDistressScore += 25;
  if (disposableCash <= 0) debtDistressScore += 30;
  if (facts.emergencySavingsMonths === 0) debtDistressScore += 15;
  debtDistressScore = Math.min(100, debtDistressScore);

  // 6. Collateral Coverage LTV
  const collateralCoverageLTV = facts.collateralValue > 0 
    ? (facts.requestedAmount / facts.collateralValue) * 100 
    : 0;

  return {
    currentFOIR,
    disposableCash,
    untouchableReserveBuffer,
    uncommittedCashFlowFloor,
    safeFOIRCapPercent,
    maxAllowableDebtServicing,
    foirCeiling,
    isOverleveraged,
    debtDistressScore,
    collateralCoverageLTV
  };
}

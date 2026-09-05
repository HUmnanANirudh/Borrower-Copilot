import { BorrowerProfile } from '../types';

/**
 * Calculates Borrower-Safe Affordability limits.
 * 
 * CORE PRINCIPLE:
 * Lenders look at top-line income and max out FOIR to 50%-60%.
 * Borrower-Safe Affordability caps total debt payments strictly at:
 * 1. 35% of true net monthly income (Safe FOIR ceiling).
 * 2. Uncommitted Cash Flow: Net Income - Household Expenses - Emergency Buffer.
 */
export function calculateSafeAffordability(profile: BorrowerProfile): {
  safeMaxEMI: number;
  uncommittedCashFlow: number;
  currentFOIR: number;
  isOverleveraged: boolean;
  safeFOIRCapPercent: number;
} {
  const netIncome = Math.max(0, profile.netMonthlyIncome);
  const existingEMI = Math.max(0, profile.existingMonthlyEMI);
  const expenses = Math.max(0, profile.householdExpenses);

  // Current Debt Burden
  const currentFOIR = netIncome > 0 ? (existingEMI / netIncome) * 100 : 100;

  // Safe FOIR standard is 35%
  // If income stability is weak or frequent switches, adjust down to 30%
  let safeFOIRCapPercent = 35;
  if (profile.jobStability === 'frequent_switches' || profile.jobStability === 'new_employment_sub_6m') {
    safeFOIRCapPercent = 28;
  } else if (profile.jobStability === 'recent_switch_6m_1yr') {
    safeFOIRCapPercent = 32;
  }

  // Adjust for variable salary haircut:
  // If salaried receives > 25% variable, we discount the variable component by 50%
  let adjustedNetIncome = netIncome;
  if (profile.variablePayPercent && profile.variablePayPercent > 20) {
    const variablePortion = (profile.variablePayPercent / 100) * netIncome;
    adjustedNetIncome = netIncome - (variablePortion * 0.5);
  }

  // 1. Max debt capacity allowed under safe FOIR
  const totalSafeDebtCapacity = (adjustedNetIncome * safeFOIRCapPercent) / 100;
  const safeEMICapFromFOIR = Math.max(0, totalSafeDebtCapacity - existingEMI);

  // 2. Uncommitted Cash Flow Check
  // An emergency monthly reserve buffer of 10% of income is preserved
  const monthlyBuffer = adjustedNetIncome * 0.10;
  const uncommittedCashFlow = Math.max(0, adjustedNetIncome - expenses - existingEMI - monthlyBuffer);

  // The borrower-safe EMI ceiling is the tighter of the two:
  const safeMaxEMI = Math.floor(Math.min(safeEMICapFromFOIR, uncommittedCashFlow));

  return {
    safeMaxEMI,
    uncommittedCashFlow,
    currentFOIR,
    isOverleveraged: currentFOIR >= 40 || existingEMI + expenses > adjustedNetIncome,
    safeFOIRCapPercent,
  };
}

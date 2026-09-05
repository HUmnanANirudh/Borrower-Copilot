import { BorrowerProfile } from '../types';

/**
 * Calculates Borrower-Safe Affordability limits.
 *
 * CORE PHILOSOPHY & RBI ALIGNMENT:
 * - Banks look at gross top-line income and stretch FOIR to 50%-60%, ignoring living realities.
 * - Borrower-Safe Affordability enforces a two-lock safety mechanism:
 *   1. Safe FOIR Lock: Capped at 35% of true net income (reduced for instability).
 *   2. Free Cash-Flow Lock: Net Income - Essential Expenses - Existing EMIs - Emergency Reserve.
 */
export function calculateSafeAffordability(profile: BorrowerProfile): {
  safeMaxEMI: number;
  uncommittedCashFlow: number;
  currentFOIR: number;
  isOverleveraged: boolean;
  safeFOIRCapPercent: number;
  disposableIncome: number;
} {
  const netIncome = Math.max(0, profile.netMonthlyIncome);
  const existingEMI = Math.max(0, profile.existingMonthlyEMI);
  const expenses = Math.max(0, profile.householdExpenses);

  // Current FOIR (Existing Debt Burden)
  const currentFOIR = netIncome > 0 ? (existingEMI / netIncome) * 100 : 100;

  // Safe FOIR baseline: 35%
  let safeFOIRCapPercent = 35;
  if (profile.jobStability === 'frequent_switches' || profile.incomeType === 'gig_freelance') {
    safeFOIRCapPercent = 25; // Gig/informal cash flows fluctuate; cap debt at 25%
  } else if (profile.jobStability === 'new_employment_sub_6m') {
    safeFOIRCapPercent = 28;
  } else if (profile.jobStability === 'recent_switch_6m_1yr') {
    safeFOIRCapPercent = 30;
  }

  // Adjust for Variable Pay Haircut:
  // Salaried receiving variable pay/bonus gets a 50% haircut on the variable portion
  let adjustedNetIncome = netIncome;
  if (profile.variablePayPercent && profile.variablePayPercent > 15) {
    const variablePortion = (profile.variablePayPercent / 100) * netIncome;
    adjustedNetIncome = netIncome - (variablePortion * 0.5);
  }

  // Lock 1: Max debt capacity under safe FOIR
  const totalSafeDebtCapacity = (adjustedNetIncome * safeFOIRCapPercent) / 100;
  const safeEMICapFromFOIR = Math.max(0, totalSafeDebtCapacity - existingEMI);

  // Lock 2: Free Cash Flow Lock
  // Reserve 10% of monthly income as untouchable emergency cash
  const monthlyReserveBuffer = adjustedNetIncome * 0.10;
  const disposableIncome = Math.max(0, adjustedNetIncome - expenses - existingEMI);
  const uncommittedCashFlow = Math.max(0, disposableIncome - monthlyReserveBuffer);

  // The borrower-safe EMI ceiling is the tighter of the two locks
  const safeMaxEMI = Math.floor(Math.min(safeEMICapFromFOIR, uncommittedCashFlow));

  // Overleveraged check:
  // If current existing EMI alone is >= 35%, or expenses + existing EMI exceeds 90% of income
  const isOverleveraged = currentFOIR >= 35 || (existingEMI + expenses) >= (netIncome * 0.92);

  return {
    safeMaxEMI,
    uncommittedCashFlow,
    currentFOIR,
    isOverleveraged,
    safeFOIRCapPercent,
    disposableIncome
  };
}

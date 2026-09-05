import { BorrowerProfile } from '../types';

/**
 * Calculates Borrower-Safe Affordability limits.
 *
 * RIGOROUS TWO-LOCK CASH-FLOW ARCHITECTURE:
 *
 * Lock 1 (Cash-Flow Floor):
 *   Disposable Cash = Net Monthly Income (including co-applicant)
 *                   - Essential Household Living Expenses
 *                   - Ongoing Existing EMIs
 *   Untouchable Buffer = 10% of Net Income (liquid contingency)
 *   Cash-Flow Ceiling = max(0, Disposable Cash - Untouchable Buffer)
 *
 * Lock 2 (Safe FOIR Cap):
 *   Max Total Debt Obligation = Effective Net Income × Safe FOIR%
 *   Safe FOIR Cap:
 *     - Standard Salaried / Established Business: 35%
 *     - Irregular Gig / Informal: 25% (protects from volatile platform earnings)
 *   FOIR Ceiling = max(0, Max Total Debt Obligation - Ongoing Existing EMIs)
 *
 * Final Safe EMI Ceiling = min(Lock 1, Lock 2)
 */
export function calculateSafeAffordability(profile: BorrowerProfile): {
  safeMaxEMI: number;
  uncommittedCashFlow: number;
  currentFOIR: number;
  isOverleveraged: boolean;
  safeFOIRCapPercent: number;
  disposableCash: number;
  totalHouseholdIncome: number;
} {
  const primaryIncome = Math.max(0, profile.netMonthlyIncome);
  const coIncome = Math.max(0, profile.coApplicantIncome || 0);
  const totalHouseholdIncome = primaryIncome + coIncome;

  const existingEMI = Math.max(0, profile.existingMonthlyEMI);
  const expenses = Math.max(0, profile.householdLivingExpenses);

  // Current FOIR (Existing Debt Burden)
  const currentFOIR = totalHouseholdIncome > 0 ? (existingEMI / totalHouseholdIncome) * 100 : 100;

  // Variable Pay Haircut for Salaried:
  // If variable bonus exceeds 15% of annual compensation, haircut that portion by 50%
  let effectiveIncome = totalHouseholdIncome;
  if (profile.variablePayPortionPercent && profile.variablePayPortionPercent > 15) {
    const variableAmount = (profile.variablePayPortionPercent / 100) * primaryIncome;
    effectiveIncome = totalHouseholdIncome - (variableAmount * 0.5);
  }

  // Safe FOIR standard:
  // 35% for regular salaried/business, 25% for gig/informal earnings
  let safeFOIRCapPercent = 35;
  if (profile.primaryIncomeSignal === 'gig_freelance' || profile.primaryIncomeSignal === 'salaried_informal') {
    safeFOIRCapPercent = 25;
  }

  // Lock 1: Cash-Flow Floor
  const disposableCash = Math.max(0, effectiveIncome - expenses - existingEMI);
  const untouchableMonthlyBuffer = effectiveIncome * 0.10; // 10% liquidity cushion
  const cashFlowCeiling = Math.max(0, disposableCash - untouchableMonthlyBuffer);

  // Lock 2: FOIR Cap
  const maxAllowableDebtServicing = (effectiveIncome * safeFOIRCapPercent) / 100;
  const foirCeiling = Math.max(0, maxAllowableDebtServicing - existingEMI);

  // Safe EMI is strictly the tighter of the two locks:
  const safeMaxEMI = Math.floor(Math.min(cashFlowCeiling, foirCeiling));

  // Overleveraged check:
  // Existing EMI >= 35% of income, or living costs + existing debt consumes >= 90% of income
  const isOverleveraged = currentFOIR >= 35 || (expenses + existingEMI) >= (totalHouseholdIncome * 0.90);

  return {
    safeMaxEMI,
    uncommittedCashFlow: cashFlowCeiling,
    currentFOIR,
    isOverleveraged,
    safeFOIRCapPercent,
    disposableCash,
    totalHouseholdIncome
  };
}

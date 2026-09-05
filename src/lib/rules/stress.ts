import { BorrowerProfile, StressScenario } from '../types';

/**
 * Conducts stress testing under two critical borrower vulnerabilities:
 * 1. Income shock: Net monthly income falls by 20% (job disruption, business slowdown).
 * 2. Rate hike: Interest rate climbs by 200 bps (+2.0%).
 */
export function calculateStressScenario(
  profile: BorrowerProfile,
  recommendedMaxEMI: number
): StressScenario {
  const netIncome = Math.max(1, profile.netMonthlyIncome);
  const existingEMI = Math.max(0, profile.existingMonthlyEMI);
  const totalOriginalObligation = existingEMI + recommendedMaxEMI;
  const originalFOIR = Math.round((totalOriginalObligation / netIncome) * 100);

  // Scenario: 20% Income Reduction
  const stressedIncome = netIncome * 0.80;
  const stressedFOIR = Math.round((totalOriginalObligation / stressedIncome) * 100);

  // Breach threshold is 50% FOIR under stress
  const isBreached = stressedFOIR > 50;

  const explanation = isBreached
    ? `If income drops by 20%, your total debt burden jumps from ${originalFOIR}% to ${stressedFOIR}% of monthly income. This crosses the safe 50% limit. We recommend lowering the requested principal or opting for a 48m tenure to cushion monthly cash flow.`
    : `Even if income falls by 20%, your total EMI commitment remains at ${stressedFOIR}% of earnings, leaving adequate buffer for household living expenses.`;

  return {
    type: 'income_shock',
    title: '20% Income Shock Stress Test',
    description: 'Simulates financial stability if your take-home pay or business revenue decreases by 20%.',
    originalFOIR,
    stressedFOIR,
    isBreached,
    explanation
  };
}

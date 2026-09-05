import { BorrowerProfile, StressScenario, ConsequenceStatus } from '../types';

/**
 * Conducts stress testing under income shock vulnerability.
 * Rule: Income shock = -20% (Source: My judgement)
 * 
 * Tracks consequence:
 * Normal: EMI / net income = X%
 * Stressed: EMI / stressed income = Y%
 * Status:
 *   - <= 40%: "Still manageable"
 *   - 41%–50%: "Uncomfortable"
 *   - > 50%: "Unsafe" (breaches safe debt ceiling)
 */
export function calculateStressScenario(
  profile: BorrowerProfile,
  recommendedMaxEMI: number,
  incomeStressPercent: number = 20
): StressScenario {
  const netIncome = Math.max(1, profile.netMonthlyIncome);
  const existingEMI = Math.max(0, profile.existingMonthlyEMI);
  const totalOriginalObligation = existingEMI + recommendedMaxEMI;
  const originalFOIR = Math.round((totalOriginalObligation / netIncome) * 100);

  // Stressed income
  const stressMultiplier = Math.max(0.1, (100 - incomeStressPercent) / 100);
  const stressedIncome = netIncome * stressMultiplier;
  const stressedFOIR = Math.round((totalOriginalObligation / stressedIncome) * 100);

  let consequenceStatus: ConsequenceStatus = 'Still manageable';
  if (stressedFOIR > 50) {
    consequenceStatus = 'Unsafe';
  } else if (stressedFOIR > 38) {
    consequenceStatus = 'Uncomfortable';
  }

  const isBreached = consequenceStatus === 'Unsafe';

  const explanation = consequenceStatus === 'Unsafe'
    ? `If monthly income drops by ${incomeStressPercent}%, your total debt servicing jumps from ${originalFOIR}% to ${stressedFOIR}% of income. This breaches the safe 50% crisis ceiling, threatening essential living expenses.`
    : consequenceStatus === 'Uncomfortable'
    ? `If monthly income drops by ${incomeStressPercent}%, your total debt burden climbs from ${originalFOIR}% to ${stressedFOIR}%. This leaves little room for discretionary spending, though essential bills remain covered.`
    : `Even with a ${incomeStressPercent}% drop in monthly earnings, your total debt obligations remain at ${stressedFOIR}% of income, leaving a comfortable cushion for living expenses.`;

  return {
    type: 'income_shock',
    title: `${incomeStressPercent}% Income Drop Stress Test`,
    description: `Evaluates debt burden if take-home income falls by ${incomeStressPercent}%.`,
    incomeStressPercent,
    originalFOIR,
    stressedFOIR,
    isBreached,
    consequenceStatus,
    explanation
  };
}

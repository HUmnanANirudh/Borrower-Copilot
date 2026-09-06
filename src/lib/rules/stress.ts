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

  const livingExpenses = Math.max(0, profile.householdLivingExpenses);
  const isBudgetDeficit = recommendedMaxEMI <= 0 && (livingExpenses >= netIncome * 0.85);

  let consequenceStatus: ConsequenceStatus = 'Still manageable';
  if (stressedFOIR > 50 || (isBudgetDeficit && stressedIncome < livingExpenses)) {
    consequenceStatus = 'Unsafe';
  } else if (stressedFOIR > 38 || isBudgetDeficit) {
    consequenceStatus = 'Uncomfortable';
  }

  const isBreached = consequenceStatus === 'Unsafe';

  let explanation: string;
  if (isBudgetDeficit) {
    const deficitAmount = Math.max(0, Math.round(livingExpenses - stressedIncome));
    explanation = `With zero room for new debt, your debt ratio is 0%. However, because essential living expenses (₹${livingExpenses.toLocaleString('en-IN')}) already consume almost all income, a ${incomeStressPercent}% drop creates an immediate monthly household deficit of ₹${deficitAmount.toLocaleString('en-IN')}.`;
  } else if (consequenceStatus === 'Unsafe') {
    explanation = `If monthly income drops by ${incomeStressPercent}%, your total debt servicing jumps from ${originalFOIR}% to ${stressedFOIR}% of income. This breaches the safe 50% crisis ceiling, threatening essential living expenses.`;
  } else if (consequenceStatus === 'Uncomfortable') {
    explanation = `If monthly income drops by ${incomeStressPercent}%, your total debt burden climbs from ${originalFOIR}% to ${stressedFOIR}%. This leaves little room for discretionary spending, though essential bills remain covered.`;
  } else {
    explanation = `Even with a ${incomeStressPercent}% drop in monthly earnings, your total debt obligations remain at ${stressedFOIR}% of income, leaving a comfortable cushion for living expenses.`;
  }

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

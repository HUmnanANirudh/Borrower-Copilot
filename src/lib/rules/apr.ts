/**
 * All-In Effective APR (Annual Percentage Rate) Calculation.
 * 
 * CORE PRINCIPLE:
 * Lenders market attractive headline rates (e.g. "11% personal loan!")
 * but tack on:
 * - 1.5% - 2.5% upfront processing fee
 * - 18% GST on processing fees
 * - Mandatory loan insurance/documentation (~₹2,000 - ₹5,000)
 * 
 * This module reveals the true annualized cost to the borrower.
 */
export function calculateEffectiveAPR(
  nominalRateRange: [number, number],
  principalAmount: number,
  tenureMonths: number = 36
): {
  effectiveAPRRange: [number, number];
  processingFeePercent: number;
  totalUpfrontDeduction: number;
  aprMarkupDifference: number;
} {
  // Market standard processing fee is 2.0%
  const processingFeePercent = 2.0;
  const gstRate = 0.18; // 18% GST on financial services in India
  
  const baseFee = (principalAmount * processingFeePercent) / 100;
  const feeWithGST = baseFee * (1 + gstRate);
  const docCharges = principalAmount > 500000 ? 1500 : 850;
  const totalUpfrontDeduction = Math.round(feeWithGST + docCharges);

  // Annualized upfront cost impact = (Upfront Costs / Principal) / (Tenure in Years)
  const tenureYears = tenureMonths / 12;
  const upfrontAnnualCostPercent = (totalUpfrontDeduction / (principalAmount || 1)) / tenureYears * 100;

  const aprMin = Number((nominalRateRange[0] + upfrontAnnualCostPercent).toFixed(2));
  const aprMax = Number((nominalRateRange[1] + upfrontAnnualCostPercent).toFixed(2));

  return {
    effectiveAPRRange: [aprMin, aprMax],
    processingFeePercent,
    totalUpfrontDeduction,
    aprMarkupDifference: Number(upfrontAnnualCostPercent.toFixed(2))
  };
}

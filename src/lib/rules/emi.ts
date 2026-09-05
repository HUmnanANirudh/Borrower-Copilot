import { TenureOption } from '../types';

/**
 * Standard EMI Calculation formula:
 * E = P * r * (1 + r)^n / ((1 + r)^n - 1)
 */
export function calculateEMI(principal: number, annualRatePercent: number, tenureMonths: number): number {
  if (principal <= 0 || annualRatePercent <= 0 || tenureMonths <= 0) return 0;
  const r = annualRatePercent / (12 * 100);
  const factor = Math.pow(1 + r, tenureMonths);
  const emi = (principal * r * factor) / (factor - 1);
  return Math.round(emi);
}

/**
 * Generates the tenure comparison matrix for 24, 36, 48, and 60 months.
 */
export function generateTenureMatrix(principal: number, annualRatePercent: number): TenureOption[] {
  const tenures = [24, 36, 48, 60];

  return tenures.map(tenureMonths => {
    const emi = calculateEMI(principal, annualRatePercent, tenureMonths);
    const totalRepayment = emi * tenureMonths;
    const totalInterest = Math.max(0, totalRepayment - principal);

    return {
      tenureMonths,
      emi,
      totalInterest,
      totalRepayment
    };
  });
}

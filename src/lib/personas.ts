import { BorrowerProfile } from './types';

/**
 * EXACT BENCHMARK PERSONAS (From Evaluator Specification):
 *
 * 1. Priya, 29 (Bengaluru · Salaried)
 * - Software engineer at a large MNC for 5 years.
 * - Net ₹1,10,000/month.
 * - One car loan, EMI ₹14,000, 2 years left.
 * - Credit score 780.
 * - Rents at ₹28,000/month (Household expenses ~₹40,000 total with living costs).
 * - Wants ₹8,00,000 personal loan for a wedding.
 *
 * 2. Ravi, 42 (Mysuru · Self-Employed)
 * - Kirana store for 14 years.
 * - Cash income ₹40,000–80,000/month (avg ~₹60,000/mo); ITR shows ₹4,20,000/year (₹35,000/mo taxable).
 * - Wife earns ₹18,000/month teaching (Household total net income: ₹78,000/mo).
 * - Household expenses: ~₹30,000/mo.
 * - Owns shop premises: ~₹45,00,000 unencumbered collateral.
 * - Never taken formal loan; no credit score (Unknown).
 * - Wants ₹15,00,000 for second stock line & delivery vehicle.
 *
 * 3. Anita, 35 (Hubballi · Informal)
 * - Delivery-platform rider plus home tailoring.
 * - ₹26,000–30,000/month (avg ₹28,000/mo).
 * - Two children, husband unemployed 8 months.
 * - Household expenses: ~₹20,000/mo.
 * - Three app loans, ₹35,000 outstanding at 30%+, approx ₹8,500/mo EMI servicing.
 * - One EMI bounced last month.
 * - No formal bureau score / Unknown.
 * - Wants ₹1,50,000 for electric scooter to double delivery runs.
 */

export const PERSONA_PRIYA: BorrowerProfile = {
  loanPurpose: 'personal',
  loanType: 'unsecured_personal',
  requestedAmount: 800000,
  age: 29,
  incomeType: 'salaried_corporate',
  netMonthlyIncome: 110000,
  existingMonthlyEMI: 14000,
  householdExpenses: 40000, // ₹28,000 rent + ₹12,000 food/utilities
  creditScoreBand: '750_plus', // 780 score
  jobStability: 'stable_2yr_plus', // 5 years at MNC
  variablePayPercent: 10,
  emergencySavingsMonths: 6,
  recentDelinquencyOrBounce: false,
};

export const PERSONA_RAVI: BorrowerProfile = {
  loanPurpose: 'business_expansion',
  loanType: 'unsecured_personal', // Exploring unsecured first
  requestedAmount: 1500000,
  age: 42,
  incomeType: 'self_employed_business',
  netMonthlyIncome: 78000, // ₹60,000 Kirana profit + ₹18,000 wife teaching
  existingMonthlyEMI: 0,
  householdExpenses: 32000,
  creditScoreBand: 'unknown', // No formal loan history / no credit score
  jobStability: 'stable_2yr_plus', // 14 years in Kirana
  businessVintageYears: 14,
  itrDeclaredNetMonthly: 35000, // ₹4,20,000 / 12
  hasCollateralProperty: true, // Owns shop premises
  collateralValue: 4500000, // ₹45L unencumbered
  recentDelinquencyOrBounce: false,
};

export const PERSONA_ANITA: BorrowerProfile = {
  loanPurpose: 'personal',
  loanType: 'unsecured_personal',
  requestedAmount: 150000,
  age: 35,
  incomeType: 'gig_freelance',
  netMonthlyIncome: 28000, // ₹26k-₹30k average
  existingMonthlyEMI: 8500, // Servicing ₹35k across 3 high-cost payday apps at 30%+
  householdExpenses: 20000, // Two kids, living costs
  creditScoreBand: 'unknown',
  jobStability: 'frequent_switches', // Platform gig + tailoring
  hasInformalHighCostDebt: true, // 3 predatory app loans at 30%+
  recentDelinquencyOrBounce: true, // One EMI bounced last month
  emergencySavingsMonths: 0,
};

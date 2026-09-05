import { BorrowerProfile } from './types';

/**
 * EXACT BENCHMARK PERSONAS (From Evaluator Specification):
 *
 * 1. Priya, 29 (Bengaluru · Salaried)
 * - Software engineer at a large MNC for 5 years. Net ₹1,10,000/month.
 * - One car loan, EMI ₹14,000, 2 years left. Credit score 780. Rents at ₹28,000.
 * - Total living expenses: ₹40,000/mo.
 * - Wants ₹8,00,000 personal loan for a wedding.
 *
 * 2. Ravi, 42 (Mysuru · Self-Employed)
 * - Kirana store for 14 years. Cash income ₹40,000–80,000/month (avg ~₹60,000/mo).
 * - ITR shows ₹4,20,000/year (taxable ₹35,000/mo).
 * - Wife earns ₹18,000/mo teaching (co-applicant income).
 * - Owns shop premises, ~₹45,00,000 unencumbered.
 * - Never taken formal loan; no credit score (Unknown).
 * - Wants ₹15,00,000 for second stock line & delivery vehicle.
 *
 * 3. Anita, 35 (Hubballi · Informal)
 * - Delivery platform rider + home tailoring. ₹26,000–30,000/month (avg ₹28,000/mo).
 * - Two children, husband unemployed 8 months. Expenses ₹20,000/mo.
 * - Three app loans, ₹35,000 outstanding at 30%+, servicing ~₹8,500/mo.
 * - One EMI bounced last month. Unknown bureau score.
 * - Wants ₹1,50,000 for electric scooter to double delivery runs.
 */

export const PERSONA_PRIYA: BorrowerProfile = {
  loanPurpose: 'wedding_personal',
  requestedAmount: 800000,
  age: 29,
  primaryIncomeSignal: 'salaried_corporate',
  netMonthlyIncome: 110000,
  existingMonthlyEMI: 14000,
  householdLivingExpenses: 40000, // ₹28,000 rent + ₹12,000 living costs
  creditScoreStatus: '750_plus', // 780 score
  variablePayPortionPercent: 10,
  emergencySavingsMonths: 6,
  recentDelinquencyOrBounce: false,
};

export const PERSONA_RAVI: BorrowerProfile = {
  loanPurpose: 'business_expansion',
  requestedAmount: 1500000,
  age: 42,
  primaryIncomeSignal: 'self_employed_business',
  netMonthlyIncome: 60000, // Net store profit
  coApplicantIncome: 18000, // Wife's teaching salary
  existingMonthlyEMI: 0,
  householdLivingExpenses: 32000,
  creditScoreStatus: 'unknown', // No formal bureau record
  businessVintageYears: 14,
  itrDeclaredMonthlyTaxable: 35000, // ₹4.2L annual ITR
  hasUnencumberedCollateral: true, // Owns shop premises
  collateralEstimatedValue: 4500000, // ₹45L unencumbered
  recentDelinquencyOrBounce: false,
};

export const PERSONA_ANITA: BorrowerProfile = {
  loanPurpose: 'asset_vehicle',
  requestedAmount: 150000,
  age: 35,
  primaryIncomeSignal: 'gig_freelance',
  netMonthlyIncome: 28000,
  coApplicantIncome: 0,
  existingMonthlyEMI: 8500, // 3 predatory app loans at 30%+
  householdLivingExpenses: 20000, // Two kids, living costs
  creditScoreStatus: 'unknown',
  hasHighCostAppLoans: true,
  totalHighCostDebtOutstanding: 35000,
  recentDelinquencyOrBounce: true,
  bounceRecencyMonths: 1, // Bounced last month
  bounceWasCuredImmediately: false,
  emergencySavingsMonths: 0,
};

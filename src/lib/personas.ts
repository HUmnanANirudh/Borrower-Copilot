import { BorrowerProfile } from './types';

/**
 * Three Benchmark Personas for Evaluator Testing:
 * - Priya: Prime Salaried (High confidence, BORROW verdict, prime rates)
 * - Ravi: Self-employed SME (Medium confidence, BORROW LESS on unsecured / Redirect to LAP)
 * - Anita: Informal / Gig with Delinquency (DON'T BORROW YET / Restructure)
 */

export const PERSONA_PRIYA: BorrowerProfile = {
  loanPurpose: 'home_renovation',
  loanType: 'unsecured_personal',
  requestedAmount: 800000,
  age: 29,
  incomeType: 'salaried_corporate',
  netMonthlyIncome: 120000,
  existingMonthlyEMI: 15000,
  householdExpenses: 35000,
  creditScoreBand: '750_plus',
  jobStability: 'stable_2yr_plus',
  variablePayPercent: 10,
  emergencySavingsMonths: 6,
  recentDelinquencyOrBounce: false,
};

export const PERSONA_RAVI: BorrowerProfile = {
  loanPurpose: 'business_expansion',
  loanType: 'unsecured_personal',
  requestedAmount: 1500000,
  age: 38,
  incomeType: 'self_employed_business',
  netMonthlyIncome: 150000,
  existingMonthlyEMI: 20000,
  householdExpenses: 45000,
  creditScoreBand: '700_749',
  jobStability: 'stable_2yr_plus',
  businessVintageYears: 6,
  itrDeclaredNetMonthly: 85000,
  hasCollateralProperty: true,
  collateralValue: 4000000,
  recentDelinquencyOrBounce: false,
};

export const PERSONA_ANITA: BorrowerProfile = {
  loanPurpose: 'debt_consolidation',
  loanType: 'unsecured_personal',
  requestedAmount: 300000,
  age: 33,
  incomeType: 'gig_freelance',
  netMonthlyIncome: 35000,
  existingMonthlyEMI: 14000,
  householdExpenses: 18000,
  creditScoreBand: 'unknown',
  jobStability: 'recent_switch_6m_1yr',
  hasInformalHighCostDebt: true,
  recentDelinquencyOrBounce: true,
  emergencySavingsMonths: 0.5,
};

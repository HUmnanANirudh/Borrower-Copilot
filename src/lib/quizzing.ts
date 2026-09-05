import { BorrowerProfile, QuizQuestion } from './types';

/**
 * 10 Must-Have Baseline Questions + Adaptive Branching Pool.
 */
export const BASELINE_QUESTIONS: QuizQuestion[] = [
  {
    id: 'loanPurpose',
    category: 'loan_basics',
    title: 'What is the purpose of this loan?',
    subtitle: 'Lenders evaluate risk differently depending on productive vs consumption borrowing.',
    inputType: 'choice_pill',
    options: [
      { value: 'personal', label: 'Personal & Lifestyle', description: 'General personal expenses or wedding' },
      { value: 'home_renovation', label: 'Home Renovation', description: 'Upgrades, repairs, or interiors' },
      { value: 'business_expansion', label: 'Business Growth', description: 'Inventory, equipment, or working capital' },
      { value: 'debt_consolidation', label: 'Debt Consolidation', description: 'Combine credit cards or high-cost loans' },
      { value: 'medical_emergency', label: 'Medical or Emergency', description: 'Unplanned hospital or urgent expenses' },
    ],
    defaultValue: 'personal'
  },
  {
    id: 'loanType',
    category: 'loan_basics',
    title: 'What type of loan are you exploring?',
    subtitle: 'Secured loans (property/gold) have dramatically lower rates than unsecured loans.',
    inputType: 'choice_pill',
    options: [
      { value: 'unsecured_personal', label: 'Unsecured Personal Loan', description: 'No collateral needed (Higher rates 11-18%)' },
      { value: 'secured_property_lap', label: 'Loan Against Property (LAP)', description: 'Pledge house/shop (Lowest rates 8.5-10.5%)' },
      { value: 'business_working_capital', label: 'Business Loan', description: 'For registered business turnover' },
      { value: 'gold_asset_loan', label: 'Gold Loan', description: 'Quick liquidity against physical gold' },
    ],
    defaultValue: 'unsecured_personal'
  },
  {
    id: 'requestedAmount',
    category: 'loan_basics',
    title: 'How much money are you looking to borrow?',
    subtitle: 'We will compare what you want against what you can safely repay.',
    inputType: 'currency_slider',
    min: 50000,
    max: 5000000,
    step: 50000,
    defaultValue: 500000
  },
  {
    id: 'age',
    category: 'loan_basics',
    title: 'What is your current age?',
    subtitle: 'Banks cap maximum tenure if the borrower is close to retirement (typically age 58-60).',
    inputType: 'number_stepper',
    min: 21,
    max: 65,
    defaultValue: 30
  },
  {
    id: 'incomeType',
    category: 'income_obligations',
    title: 'How do you earn your primary income?',
    subtitle: 'Underwriting models differ between corporate salaried, business owners, and gig workers.',
    inputType: 'choice_pill',
    options: [
      { value: 'salaried_corporate', label: 'Salaried (Private / MNC / Govt)', description: 'Bank credit every month with salary slips' },
      { value: 'self_employed_business', label: 'Business Owner / Trader', description: 'Sole proprietorship, partnership, or private firm' },
      { value: 'self_employed_professional', label: 'Doctor / CA / Architect', description: 'Licensed professional practice' },
      { value: 'gig_freelance', label: 'Gig / Freelancer / Informal', description: 'Platform earnings, variable contract invoices' },
    ],
    defaultValue: 'salaried_corporate'
  },
  {
    id: 'netMonthlyIncome',
    category: 'income_obligations',
    title: 'What is your net in-hand monthly income?',
    subtitle: 'Actual amount credited into your bank account after all taxes and deductions.',
    inputType: 'currency_slider',
    min: 15000,
    max: 1000000,
    step: 5000,
    defaultValue: 75000
  },
  {
    id: 'existingMonthlyEMI',
    category: 'income_obligations',
    title: 'Total existing monthly EMIs currently paying?',
    subtitle: 'Include home loans, car loans, two-wheelers, consumer durables, and BNPL dues.',
    inputType: 'currency_slider',
    min: 0,
    max: 500000,
    step: 1000,
    defaultValue: 0
  },
  {
    id: 'householdExpenses',
    category: 'income_obligations',
    title: 'Essential monthly household living expenses?',
    subtitle: 'Rent, groceries, utility bills, school fees, and medical essentials.',
    inputType: 'currency_slider',
    min: 10000,
    max: 500000,
    step: 2500,
    defaultValue: 30000
  },
  {
    id: 'creditScoreBand',
    category: 'income_obligations',
    title: 'What is your approximate CIBIL / Experian credit score?',
    subtitle: 'If you are unsure, select Unknown. We never penalize unknowns as zero.',
    inputType: 'choice_pill',
    options: [
      { value: '750_plus', label: '750+ (Excellent)', badge: 'Lowest Rates' },
      { value: '700_749', label: '700 – 749 (Good)', badge: 'Competitive' },
      { value: '650_699', label: '650 – 699 (Fair / Average)', badge: 'Sub-prime NBFC' },
      { value: 'below_650', label: 'Below 650 (Poor)', badge: 'High Risk' },
      { value: 'unknown', label: 'I do not know / No score yet', badge: 'Widened Band' },
    ],
    defaultValue: 'unknown'
  },
  {
    id: 'jobStability',
    category: 'income_obligations',
    title: 'How stable is your current employment or business?',
    subtitle: 'Lenders check vintage: longer continuous tenure grants superior rate pricing.',
    inputType: 'choice_pill',
    options: [
      { value: 'stable_2yr_plus', label: 'Over 2 years in current role / business', description: 'Established stability' },
      { value: 'recent_switch_6m_1yr', label: 'Switched job in past 6–12 months', description: 'Passed probation' },
      { value: 'new_employment_sub_6m', label: 'Under 6 months in current job', description: 'Still in probation' },
      { value: 'frequent_switches', label: 'Frequent job changes or irregular contracts', description: 'Variable cash flow' },
    ],
    defaultValue: 'stable_2yr_plus'
  }
];

/**
 * Adaptive questions triggered based on answers to previous questions.
 */
export const ADAPTIVE_QUESTIONS: QuizQuestion[] = [
  // Triggered for salaried with high requested loans:
  {
    id: 'variablePayPercent',
    category: 'adaptive_deep_dive',
    isAdaptive: true,
    title: 'What percentage of your annual pay is variable or bonus?',
    subtitle: 'Lenders discount variable income by 50% when computing your borrowing capacity.',
    inputType: 'choice_pill',
    options: [
      { value: '0', label: '0% – 100% Fixed Salary', description: 'Guaranteed monthly paycheck' },
      { value: '15', label: '10% – 20% Annual Bonus', description: 'Standard corporate structure' },
      { value: '35', label: '30%+ High Variable / Sales Incentives', description: 'Income fluctuates heavily' },
    ],
    defaultValue: '0'
  },
  // Triggered for self-employed / business owners (like Ravi):
  {
    id: 'hasCollateralProperty',
    category: 'adaptive_deep_dive',
    isAdaptive: true,
    title: 'Do you own any residential or commercial property that could be pledged?',
    subtitle: 'For business financing above ₹10 Lakhs, a Loan Against Property saves you 5%–7% in interest.',
    inputType: 'choice_pill',
    options: [
      { value: 'true', label: 'Yes, own clear-title property', description: 'Can unlock LAP at 8.75%–10.25%' },
      { value: 'false', label: 'No property available', description: 'Must rely on unsecured business lines' },
    ],
    defaultValue: 'false'
  },
  // Triggered for informal or high-debt profiles (like Anita):
  {
    id: 'recentDelinquencyOrBounce',
    category: 'adaptive_deep_dive',
    isAdaptive: true,
    title: 'Have you had any EMI bounce or delayed payment in the last 6 months?',
    subtitle: 'An active bounce will cause instant algorithmic rejection at prime banks.',
    inputType: 'choice_pill',
    options: [
      { value: 'false', label: 'Clean Record – Zero bounces', description: 'All EMIs paid on time' },
      { value: 'true', label: 'Yes, 1 or more bounces', description: 'Missed or delayed due date' },
    ],
    defaultValue: 'false'
  },
  {
    id: 'emergencySavingsMonths',
    category: 'adaptive_deep_dive',
    isAdaptive: true,
    title: 'How many months of emergency savings do you have?',
    subtitle: 'Liquid funds in savings accounts or fixed deposits to handle surprises.',
    inputType: 'choice_pill',
    options: [
      { value: '0', label: 'Less than 1 month', description: 'Living month-to-month' },
      { value: '3', label: '2 – 4 months', description: 'Moderate safety cushion' },
      { value: '6', label: '6+ months of expenses', description: 'Strong financial buffer' },
    ],
    defaultValue: '3'
  }
];

/**
 * Determines which adaptive questions should be asked next based on current profile.
 */
export function getNextAdaptiveQuestions(profile: Partial<BorrowerProfile>): QuizQuestion[] {
  const result: QuizQuestion[] = [];

  if (profile.incomeType === 'salaried_corporate' && profile.variablePayPercent === undefined) {
    const q = ADAPTIVE_QUESTIONS.find(item => item.id === 'variablePayPercent');
    if (q) result.push(q);
  }

  if (
    (profile.incomeType === 'self_employed_business' || (profile.requestedAmount && profile.requestedAmount >= 1000000)) &&
    profile.hasCollateralProperty === undefined
  ) {
    const q = ADAPTIVE_QUESTIONS.find(item => item.id === 'hasCollateralProperty');
    if (q) result.push(q);
  }

  const isDebtBurdenHigh = profile.netMonthlyIncome && profile.existingMonthlyEMI 
    ? (profile.existingMonthlyEMI / profile.netMonthlyIncome) >= 0.35 
    : false;

  if (
    (profile.incomeType === 'gig_freelance' || isDebtBurdenHigh || profile.creditScoreBand === 'unknown' || profile.creditScoreBand === 'below_650') &&
    profile.recentDelinquencyOrBounce === undefined
  ) {
    const q = ADAPTIVE_QUESTIONS.find(item => item.id === 'recentDelinquencyOrBounce');
    if (q) result.push(q);
  }

  if (profile.emergencySavingsMonths === undefined) {
    const q = ADAPTIVE_QUESTIONS.find(item => item.id === 'emergencySavingsMonths');
    if (q) result.push(q);
  }

  return result;
}

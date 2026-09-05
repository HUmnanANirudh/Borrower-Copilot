import { BorrowerProfile, QuizQuestion } from './types';

/**
 * 1. UNIVERSAL INTAKE QUESTIONS (Phase 1)
 * Purpose, Amount, Age
 * (Loan type is purposefully NOT asked blindly; it is inferred later!)
 */
export const UNIVERSAL_QUESTIONS: QuizQuestion[] = [
  {
    id: 'loanPurpose',
    title: 'What will you use this money for?',
    subtitle: 'Lenders and risk models evaluate productive investments differently from lifestyle consumption.',
    inputType: 'choice_pill',
    options: [
      { value: 'wedding_personal', label: 'Wedding or Family Event', description: 'One-off personal consumption' },
      { value: 'home_renovation', label: 'Home Renovation or Repair', description: 'Interiors, structural work, or upgrades' },
      { value: 'business_expansion', label: 'Business Growth / Stock', description: 'Inventory, equipment, or working capital' },
      { value: 'debt_consolidation', label: 'Consolidating Existing Debts', description: 'Paying off high-cost apps or cards' },
      { value: 'asset_vehicle', label: 'Vehicle or Machinery Purchase', description: 'Delivery scooter, car, or tools' },
      { value: 'medical_emergency', label: 'Medical / Urgent Need', description: 'Unplanned medical expenses' },
    ],
    defaultValue: 'wedding_personal',
    targetOutputs: ['verdict', 'rate'],
    shouldAsk: () => true,
    informationScore: () => 10
  },
  {
    id: 'requestedAmount',
    title: 'How much money are you looking to borrow?',
    subtitle: 'We will contrast your target amount against your cash-flow safe repayment ceiling.',
    inputType: 'currency_slider',
    min: 50000,
    max: 5000000,
    step: 50000,
    defaultValue: 500000,
    targetOutputs: ['amount', 'emi', 'verdict'],
    shouldAsk: () => true,
    informationScore: () => 10
  },
  {
    id: 'age',
    title: 'What is your current age?',
    subtitle: 'Banks cap loan tenure if the term approaches retirement (age 58–60).',
    inputType: 'number_stepper',
    min: 21,
    max: 65,
    defaultValue: 30,
    targetOutputs: ['amount', 'emi'],
    shouldAsk: () => true,
    informationScore: () => 9
  }
];

/**
 * 2. FINANCIAL BASELINE QUESTIONS (Phase 2)
 * Income signal, take-home pay, ongoing obligations, living costs, bureau status
 */
export const BASELINE_FINANCIAL_QUESTIONS: QuizQuestion[] = [
  {
    id: 'primaryIncomeSignal',
    title: 'What is your primary income stream?',
    subtitle: 'This is an initial routing signal to determine underwriting risk rules.',
    inputType: 'choice_pill',
    options: [
      { value: 'salaried_corporate', label: 'Salaried (MNC / Corporate / Govt)', description: 'Consistent monthly payslips and PF' },
      { value: 'self_employed_business', label: 'Business Owner / Kirana / Trader', description: 'Sole proprietorship, shop, or firm' },
      { value: 'self_employed_professional', label: 'Doctor / CA / Architect', description: 'Independent licensed practice' },
      { value: 'gig_freelance', label: 'Gig Platform / Informal / Freelancer', description: 'Delivery rider, driver, home business' },
    ],
    defaultValue: 'salaried_corporate',
    targetOutputs: ['verdict', 'rate', 'confidence'],
    shouldAsk: () => true,
    informationScore: () => 10
  },
  {
    id: 'netMonthlyIncome',
    title: 'What is your net monthly take-home income?',
    subtitle: 'Actual cash credited into your bank account after all deductions and taxes.',
    inputType: 'currency_slider',
    min: 15000,
    max: 1000000,
    step: 5000,
    defaultValue: 75000,
    targetOutputs: ['amount', 'emi', 'verdict'],
    shouldAsk: () => true,
    informationScore: () => 10
  },
  {
    id: 'existingMonthlyEMI',
    title: 'Total existing monthly EMIs you currently pay?',
    subtitle: 'Include vehicle loans, personal loans, consumer durables, and app installments.',
    inputType: 'currency_slider',
    min: 0,
    max: 500000,
    step: 1000,
    defaultValue: 0,
    targetOutputs: ['emi', 'verdict', 'amount'],
    shouldAsk: () => true,
    informationScore: () => 10
  },
  {
    id: 'householdLivingExpenses',
    title: 'Essential monthly living expenses for the household?',
    subtitle: 'Rent, groceries, utilities, school fees, and dependent medical needs.',
    inputType: 'currency_slider',
    min: 10000,
    max: 500000,
    step: 2500,
    defaultValue: 30000,
    targetOutputs: ['emi', 'verdict'],
    shouldAsk: () => true,
    informationScore: () => 10
  },
  {
    id: 'creditScoreStatus',
    title: 'What is your approximate credit bureau score?',
    subtitle: 'If unsure, pick Unknown. We never penalize unknowns as zero or 300.',
    inputType: 'choice_pill',
    options: [
      { value: '750_plus', label: '750+ (Prime Tier)', badge: 'Lowest Rates' },
      { value: '700_749', label: '700 – 749 (Good Tier)', badge: 'Competitive' },
      { value: '650_699', label: '650 – 699 (Fair / Sub-prime)', badge: 'NBFC Pricing' },
      { value: 'below_650', label: 'Below 650 (High Risk)', badge: 'Punitive' },
      { value: 'unknown', label: 'I do not know / No formal bureau file', badge: 'Honest Widened Band' },
    ],
    defaultValue: 'unknown',
    targetOutputs: ['rate', 'confidence'],
    shouldAsk: () => true,
    informationScore: () => 9
  }
];

/**
 * 3. INFORMATION-VALUE DYNAMIC QUESTION POOL (Phase 3)
 * Every question in this pool:
 * - Has explicit criteria for when it is relevant (`shouldAsk`)
 * - Has a dynamic Information Score based on how much it reduces uncertainty in outputs
 * - Stops asking when uncertainty is resolved or information score is 0
 */
export const DYNAMIC_QUESTION_POOL: QuizQuestion[] = [
  // 1. COLLATERAL PROPERTY CHECK (High value for business / high ticket)
  {
    id: 'hasUnencumberedCollateral',
    title: 'Do you or your family own clear-title, unencumbered property?',
    subtitle: 'Pledging a residential or commercial premises unlocks Loan Against Property (LAP) at 9%–10.5% instead of 16%+.',
    inputType: 'choice_pill',
    options: [
      { value: 'true', label: 'Yes, own clear property (shop / house / plot)', description: 'Can unlock LAP at half the rate' },
      { value: 'false', label: 'No property available', description: 'Must rely strictly on unsecured cash flow' },
    ],
    defaultValue: 'false',
    targetOutputs: ['rate', 'amount', 'verdict'],
    shouldAsk: (profile) => {
      // Ask if high ticket (>= ₹10L) OR self-employed business OR business expansion
      return (
        (profile.requestedAmount !== undefined && profile.requestedAmount >= 800000) ||
        profile.primaryIncomeSignal === 'self_employed_business' ||
        profile.loanPurpose === 'business_expansion'
      );
    },
    informationScore: (profile) => {
      // Immense value for someone requesting ₹10L+ with business background (Ravi)
      if (profile.requestedAmount && profile.requestedAmount >= 1000000) return 10;
      return 7;
    }
  },

  // 1b. COLLATERAL ESTIMATED VALUE
  {
    id: 'collateralEstimatedValue',
    title: 'What is the approximate market value of this property?',
    subtitle: 'Lenders cap Secured LAP at 50%–65% Loan-to-Value (LTV) of unencumbered market price.',
    inputType: 'currency_slider',
    min: 500000,
    max: 20000000,
    step: 250000,
    defaultValue: 4000000,
    targetOutputs: ['amount', 'verdict'],
    shouldAsk: (profile) => profile.hasUnencumberedCollateral === true,
    informationScore: (profile) => profile.hasUnencumberedCollateral ? 9 : 0
  },

  // 2. CO-APPLICANT / SPOUSE INCOME
  {
    id: 'coApplicantIncome',
    title: 'Does your spouse or a family co-applicant have regular income?',
    subtitle: 'Adding verifiable co-applicant income expands household cash flow and lowers debt risk.',
    inputType: 'currency_slider',
    min: 0,
    max: 500000,
    step: 2000,
    defaultValue: 0,
    targetOutputs: ['amount', 'emi', 'verdict'],
    shouldAsk: (profile) => {
      // Ask if self-employed or if requested amount is high relative to primary income
      const requested = profile.requestedAmount || 0;
      const income = profile.netMonthlyIncome || 1;
      return (requested / income) > 8 || profile.primaryIncomeSignal === 'self_employed_business';
    },
    informationScore: () => 8
  },

  // 3. BUSINESS OPERATING VINTAGE & ITR
  {
    id: 'businessVintageYears',
    title: 'How many continuous years has your business or shop been active?',
    subtitle: '10+ years operating vintage proves cash-flow resilience and offsets missing bureau records.',
    inputType: 'number_stepper',
    min: 1,
    max: 40,
    defaultValue: 5,
    targetOutputs: ['confidence', 'rate', 'amount'],
    shouldAsk: (profile) => profile.primaryIncomeSignal === 'self_employed_business',
    informationScore: (profile) => profile.primaryIncomeSignal === 'self_employed_business' ? 9 : 0
  },

  // 4. HIGH COST APP DEBT CHECK (Critical for informal / overleveraged)
  {
    id: 'hasHighCostAppLoans',
    title: 'Are any of your current loans from instant apps or private lenders at 30%+?',
    subtitle: 'Predatory digital apps drain cash flow with weekly or high-frequency interest.',
    inputType: 'choice_pill',
    options: [
      { value: 'false', label: 'No – Only standard bank / NBFC loans', description: 'Normal interest rates' },
      { value: 'true', label: 'Yes – Servicing instant app loans at 30%+', description: 'Draining monthly budget' },
    ],
    defaultValue: 'false',
    targetOutputs: ['verdict', 'rate', 'confidence'],
    shouldAsk: (profile) => {
      // Ask if gig worker OR existing EMI is high relative to income OR debt consolidation purpose
      const income = profile.netMonthlyIncome || 1;
      const emi = profile.existingMonthlyEMI || 0;
      return (
        profile.primaryIncomeSignal === 'gig_freelance' ||
        profile.loanPurpose === 'debt_consolidation' ||
        (emi / income) >= 0.25
      );
    },
    informationScore: () => 10
  },

  // 5. RECENT DELINQUENCY / BOUNCE CHECK
  {
    id: 'recentDelinquencyOrBounce',
    title: 'Have you had any missed due dates or bounced EMIs in the past 6 months?',
    subtitle: 'Active bounces cause instant automated rejection at tier-1 banks and signal credit distress.',
    inputType: 'choice_pill',
    options: [
      { value: 'false', label: 'Clean Record – Zero bounces', description: 'All repayments on time' },
      { value: 'true', label: 'Yes, 1 or more bounces', description: 'Missed payment occurred' },
    ],
    defaultValue: 'false',
    targetOutputs: ['verdict', 'confidence', 'rate'],
    shouldAsk: (profile) => {
      // Relevant if credit score is unknown/poor, or high debt ratio
      return (
        profile.creditScoreStatus === 'unknown' ||
        profile.creditScoreStatus === 'below_650' ||
        profile.hasHighCostAppLoans === true ||
        profile.primaryIncomeSignal === 'gig_freelance'
      );
    },
    informationScore: (profile) => {
      if (profile.hasHighCostAppLoans || profile.creditScoreStatus === 'unknown') return 10;
      return 6;
    }
  },

  // 6. VARIABLE SALARY PORTION (For Corporate Salaried)
  {
    id: 'variablePayPortionPercent',
    title: 'What percentage of your annual compensation is variable or bonus?',
    subtitle: 'Lenders haircut annual bonus components by 50% when calculating fixed monthly EMI limits.',
    inputType: 'choice_pill',
    options: [
      { value: '0', label: '0% – 100% Fixed Base Salary', description: 'Stable monthly paycheck' },
      { value: '15', label: '10% – 20% Annual Variable Bonus', description: 'Standard corporate bonus' },
      { value: '35', label: '30%+ High Variable / Sales Incentives', description: 'Earnings fluctuate' },
    ],
    defaultValue: '0',
    targetOutputs: ['amount', 'emi'],
    shouldAsk: (profile) => profile.primaryIncomeSignal === 'salaried_corporate',
    informationScore: (profile) => profile.primaryIncomeSignal === 'salaried_corporate' ? 7 : 0
  },

  // 7. EMERGENCY SAVINGS BUFFER
  {
    id: 'emergencySavingsMonths',
    title: 'How many months of essential expenses do you have in liquid savings?',
    subtitle: 'Having a 3+ month buffer prevents unexpected emergencies from causing loan default.',
    inputType: 'choice_pill',
    options: [
      { value: '0', label: 'Zero / Under 1 Month', description: 'Living paycheck to paycheck' },
      { value: '3', label: '2 to 4 Months Buffer', description: 'Moderate safety cushion' },
      { value: '6', label: '6+ Months Reserve', description: 'Excellent safety cushion' },
    ],
    defaultValue: '3',
    targetOutputs: ['verdict', 'confidence'],
    shouldAsk: (profile) => {
      // Ask if high debt or informal or low cash flow
      const income = profile.netMonthlyIncome || 1;
      const emi = profile.existingMonthlyEMI || 0;
      return (emi / income) >= 0.20 || profile.primaryIncomeSignal === 'gig_freelance';
    },
    informationScore: () => 7
  }
];

/**
 * Deterministic Information-Value Selection Engine:
 * Evaluates the current borrower profile state, filters candidate questions,
 * scores them by information value, and returns the next prioritized question list.
 */
export function getPrioritizedQuestions(profile: Partial<BorrowerProfile>): QuizQuestion[] {
  // 1. Always start with Universal Questions (Phase 1)
  const universal = UNIVERSAL_QUESTIONS;

  // 2. Always include Baseline Financial Questions (Phase 2)
  const baseline = BASELINE_FINANCIAL_QUESTIONS;

  // 3. Evaluate Dynamic Pool (Phase 3)
  const dynamic = DYNAMIC_QUESTION_POOL.filter(q => q.shouldAsk(profile));

  // Sort dynamic questions by their information value score (highest first)
  dynamic.sort((a, b) => b.informationScore(profile) - a.informationScore(profile));

  return [...universal, ...baseline, ...dynamic];
}

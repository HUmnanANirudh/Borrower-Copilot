import { BorrowerProfile, QuizQuestion } from './types';
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
    whyWeAsk: 'Knowing your bureau score tier narrows the fair rate band from ±250 bps down to ±75 bps.',
    canSkip: true,
    inputType: 'choice_pill',
    options: [
      { value: '750_plus', label: '750 and above', description: 'Excellent credit standing' },
      { value: '700_749', label: '700 to 749', description: 'Good credit standing' },
      { value: '650_699', label: '650 to 699', description: 'Average credit standing' },
      { value: 'below_650', label: 'Below 650', description: 'Needs improvement' },
      { value: 'unknown', label: 'I do not know my score', description: 'Never checked or first time borrower' },
    ],
    defaultValue: 'unknown',
    targetOutputs: ['rate', 'confidence'],
    shouldAsk: () => true,
    informationScore: () => 9
  }
];
export const DYNAMIC_QUESTION_POOL: QuizQuestion[] = [
  {
    id: 'hasUnencumberedCollateral',
    title: 'Do you or your family own clear-title, unencumbered property?',
    subtitle: 'Pledging a residential or commercial premises unlocks Loan Against Property (LAP) at 9%–10.5% instead of 16%+.',
    whyWeAsk: 'Pledging property can route your request to a Secured LAP at 9.0%–10.5% instead of a 16%+ unsecured loan.',
    canSkip: true,
    inputType: 'choice_pill',
    options: [
      { value: 'true', label: 'Yes, own clear property (shop / house / plot)', description: 'Can unlock LAP at half the rate' },
      { value: 'false', label: 'No property available', description: 'Must rely strictly on unsecured cash flow' },
    ],
    defaultValue: 'false',
    targetOutputs: ['rate', 'amount', 'verdict'],
    shouldAsk: (profile) => {
      return (
        (profile.requestedAmount !== undefined && profile.requestedAmount >= 800000) ||
        profile.primaryIncomeSignal === 'self_employed_business' ||
        profile.loanPurpose === 'business_expansion'
      );
    },
    informationScore: (profile) => {
      if (profile.requestedAmount && profile.requestedAmount >= 1000000) return 10;
      return 7;
    }
  },
  {
    id: 'collateralEstimatedValue',
    title: 'What is the approximate market value of this property?',
    subtitle: 'Lenders cap Secured LAP at 50%–65% Loan-to-Value (LTV) of unencumbered market price.',
    whyWeAsk: 'Property valuation sets the 50%–65% Loan-to-Value (LTV) regulatory ceiling for secured lending.',
    canSkip: true,
    inputType: 'currency_slider',
    min: 500000,
    max: 20000000,
    step: 250000,
    defaultValue: 4000000,
    targetOutputs: ['amount', 'verdict'],
    shouldAsk: (profile) => profile.hasUnencumberedCollateral === true,
    informationScore: (profile) => profile.hasUnencumberedCollateral ? 9 : 0
  },
  {
    id: 'coApplicantIncome',
    title: 'Does your spouse or a family co-applicant have regular income?',
    subtitle: 'Adding verifiable co-applicant income expands household cash flow and lowers debt risk.',
    whyWeAsk: 'Adding verifiable family income expands household debt servicing capacity and lowers default risk.',
    canSkip: true,
    inputType: 'currency_slider',
    min: 0,
    max: 500000,
    step: 2000,
    defaultValue: 0,
    targetOutputs: ['amount', 'emi', 'verdict'],
    shouldAsk: (profile) => {
      const requested = profile.requestedAmount || 0;
      const income = profile.netMonthlyIncome || 1;
      return (requested / income) > 8 || profile.primaryIncomeSignal === 'self_employed_business';
    },
    informationScore: () => 8
  },
  {
    id: 'businessVintageYears',
    title: 'How many continuous years has your business or shop been active?',
    subtitle: '10+ years operating vintage proves cash-flow resilience and offsets missing bureau records.',
    whyWeAsk: 'A 10+ year operating history demonstrates cash-flow resilience and helps offset missing bureau credit files.',
    canSkip: true,
    inputType: 'number_stepper',
    min: 1,
    max: 40,
    defaultValue: 5,
    targetOutputs: ['confidence', 'rate', 'amount'],
    shouldAsk: (profile) => profile.primaryIncomeSignal === 'self_employed_business',
    informationScore: (profile) => profile.primaryIncomeSignal === 'self_employed_business' ? 9 : 0
  },
  {
    id: 'hasHighCostAppLoans',
    title: 'Are any of your current loans from instant apps or private lenders at 30%+?',
    subtitle: 'Predatory digital apps drain cash flow with weekly or high-frequency interest.',
    whyWeAsk: 'Active high-cost loans (30%+) drain cash flow; knowing this determines whether consolidating debt first is your best move.',
    inputType: 'choice_pill',
    options: [
      { value: 'false', label: 'No – Only standard bank / NBFC loans', description: 'Normal interest rates' },
      { value: 'true', label: 'Yes – Servicing instant app loans at 30%+', description: 'Draining monthly budget' },
    ],
    defaultValue: 'false',
    targetOutputs: ['verdict', 'rate', 'confidence'],
    shouldAsk: (profile) => {
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
  {
    id: 'recentDelinquencyOrBounce',
    title: 'Have you had any missed due dates or bounced EMIs in the past 6 months?',
    subtitle: 'Active bounces cause instant automated rejection at tier-1 banks and signal credit distress.',
    whyWeAsk: 'Recent missed payments trigger strict bank rejection policies, changing which lenders are realistic.',
    canSkip: true,
    inputType: 'choice_pill',
    options: [
      { value: 'false', label: 'Clean Record – Zero bounces', description: 'All repayments on time' },
      { value: 'true', label: 'Yes, 1 or more bounces', description: 'Missed payment occurred' },
    ],
    defaultValue: 'false',
    targetOutputs: ['verdict', 'confidence', 'rate'],
    shouldAsk: (profile) => {
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
  {
    id: 'variablePayPortionPercent',
    title: 'What percentage of your annual compensation is variable or bonus?',
    subtitle: 'Lenders haircut annual bonus components by 50% when calculating fixed monthly EMI limits.',
    whyWeAsk: 'Banks discount annual bonus pay by 50% when calculating your fixed monthly EMI limit.',
    canSkip: true,
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
  {
    id: 'emergencySavingsMonths',
    title: 'How many months of essential expenses do you have in liquid savings?',
    subtitle: 'Having a 3+ month buffer prevents unexpected emergencies from causing loan default.',
    whyWeAsk: 'Having 3+ months of emergency reserves determines whether taking on new debt is safe during emergencies.',
    canSkip: true,
    inputType: 'choice_pill',
    options: [
      { value: '0', label: 'Zero / Under 1 Month', description: 'Living paycheck to paycheck' },
      { value: '3', label: '2 to 4 Months Buffer', description: 'Moderate safety cushion' },
      { value: '6', label: '6+ Months Reserve', description: 'Excellent safety cushion' },
    ],
    defaultValue: '3',
    targetOutputs: ['verdict', 'confidence'],
    shouldAsk: (profile) => {
      const income = profile.netMonthlyIncome || 1;
      const emi = profile.existingMonthlyEMI || 0;
      return (emi / income) >= 0.20 || profile.primaryIncomeSignal === 'gig_freelance';
    },
    informationScore: () => 7
  }
];
export function getContextTransition(questionId: string, profile: Partial<BorrowerProfile>): string | null {
  if (questionId === 'hasUnencumberedCollateral' && profile.primaryIncomeSignal === 'self_employed_business') {
    return "Because you're self-employed and mentioned a substantial loan amount, we check if unencumbered property can unlock a lower-rate secured loan.";
  }
  if (questionId === 'hasHighCostAppLoans' && (profile.primaryIncomeSignal === 'gig_freelance' || profile.loanPurpose === 'debt_consolidation')) {
    return "Because you have existing obligations, we check your high-cost debt exposure to protect against debt spiral risk.";
  }
  if (questionId === 'recentDelinquencyOrBounce' && profile.hasHighCostAppLoans) {
    return "Because you are servicing digital loan apps, we verify repayment stability before assessing new borrowing.";
  }
  if (questionId === 'variablePayPortionPercent' && profile.primaryIncomeSignal === 'salaried_corporate') {
    return "Because corporate compensation often includes variable bonus components, we check your guaranteed monthly base.";
  }
  return null;
}

export function getPrioritizedQuestions(profile: Partial<BorrowerProfile>): QuizQuestion[] {
  const universal = UNIVERSAL_QUESTIONS;

  const baseline = BASELINE_FINANCIAL_QUESTIONS;

  const dynamic = DYNAMIC_QUESTION_POOL.filter(q => q.shouldAsk(profile));

  dynamic.sort((a, b) => b.informationScore(profile) - a.informationScore(profile));

  return [...universal, ...baseline, ...dynamic];
}

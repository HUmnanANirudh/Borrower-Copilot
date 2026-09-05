// ==========================================
// Borrower Copilot Core Domain Types
// ==========================================

export type LoanPurpose = 
  | 'personal'
  | 'business_expansion'
  | 'debt_consolidation'
  | 'medical_emergency'
  | 'home_renovation'
  | 'education'
  | 'other';

export type LoanType = 
  | 'unsecured_personal'
  | 'secured_property_lap'
  | 'business_working_capital'
  | 'gold_asset_loan';

export type IncomeType = 
  | 'salaried_corporate'
  | 'salaried_informal'
  | 'self_employed_professional'
  | 'self_employed_business'
  | 'gig_freelance';

export type CreditScoreBand = 
  | '750_plus'       // Excellent
  | '700_749'        // Good
  | '650_699'        // Fair / Average
  | 'below_650'      // Poor
  | 'unknown';       // Unknown bureau history (never zero!)

export type JobStability = 
  | 'stable_2yr_plus'
  | 'recent_switch_6m_1yr'
  | 'frequent_switches'
  | 'new_employment_sub_6m';

export interface BorrowerProfile {
  // 10 Must-have initial inputs
  loanPurpose: LoanPurpose;
  loanType: LoanType;
  requestedAmount: number;
  age: number;
  incomeType: IncomeType;
  netMonthlyIncome: number;
  existingMonthlyEMI: number;
  householdExpenses: number;
  creditScoreBand: CreditScoreBand;
  jobStability: JobStability;

  // Adaptive / Contextual inputs
  variablePayPercent?: number;       // Salaried: % of monthly income that is bonus/variable
  businessVintageYears?: number;     // Self-employed: years in current business
  itrDeclaredNetMonthly?: number;    // Self-employed: actual declared taxable income
  hasCollateralProperty?: boolean;   // Business/LAP: owns shop/house to pledge
  collateralValue?: number;          // Estimated collateral worth
  hasInformalHighCostDebt?: boolean; // Informal: moneylender/payday app borrowing
  recentDelinquencyOrBounce?: boolean; // Has bounced an EMI in last 6 months
  emergencySavingsMonths?: number;   // Months of living expenses saved
}

export type Verdict = 'BORROW' | 'BORROW LESS' | 'DON\'T BORROW YET';
export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface TenureOption {
  tenureMonths: number;
  emi: number;
  totalInterest: number;
  totalRepayment: number;
}

export interface StressScenario {
  type: 'income_shock' | 'rate_hike';
  title: string;
  description: string;
  originalFOIR: number;
  stressedFOIR: number;
  isBreached: boolean;
  explanation: string;
}

export interface Assessment {
  // Output 1: Verdict
  verdict: Verdict;
  verdictReason: string;

  // Output 2: Maximum Amount
  lenderSanctionRange: [number, number]; // e.g. [800000, 1000000]
  borrowerSafeRange: [number, number];   // e.g. [650000, 750000]
  amountExplanation: string;

  // Output 3: Fair Interest Rate & APR
  fairRateRange: [number, number];       // e.g. [11.0, 12.5]
  expectedLenderQuoteRange: [number, number]; // e.g. [13.5, 16.0]
  effectiveAPRRange: [number, number];   // e.g. [12.2, 13.8] (includes fees + GST)
  processingFeePercent: number;          // Standard 1.5% - 2.5%
  rateExplanation: string;

  // Output 4: EMI Ceiling & Tenure
  recommendedMaxEMI: number;             // Hard ceiling e.g. 22000
  tenureMatrix: TenureOption[];          // 24m, 36m, 48m, 60m
  stressScenario: StressScenario;

  // Confidence & Meta
  confidence: ConfidenceLevel;
  confidenceReasons: string[];
  productRoutingRecommendation?: string; // e.g. "Redirect to Secured LAP"

  // Negotiation Card Guidance
  negotiationPoints: string[];
  doNotCrossRules: string[];
}

// ==========================================
// Quiz Question System Types
// ==========================================

export type QuestionInputType = 
  | 'choice_pill'
  | 'currency_slider'
  | 'number_stepper'
  | 'boolean_toggle';

export interface QuestionOption {
  value: string;
  label: string;
  description?: string;
  badge?: string;
}

export interface QuizQuestion {
  id: keyof BorrowerProfile | string;
  title: string;
  subtitle?: string;
  explanation?: string;
  inputType: QuestionInputType;
  options?: QuestionOption[];
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: any;
  category: 'loan_basics' | 'income_obligations' | 'adaptive_deep_dive';
  isAdaptive?: boolean;
}

// ==========================================
// Stateless URL Share Payload
// ==========================================

export interface SharedCardPayload {
  v: Verdict;
  r: number;             // Requested amount
  p: LoanPurpose;
  ls: [number, number];  // Lender sanction min/max
  bs: [number, number];  // Borrower safe min/max
  fr: [number, number];  // Fair rate min/max
  apr: [number, number]; // Effective APR min/max
  emi: number;           // Recommended max EMI
  conf: ConfidenceLevel;
  wh: string;            // Why / rationale
  rt?: string;           // Routing hint
  ts: number;            // Timestamp
}

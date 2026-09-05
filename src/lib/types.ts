// ==========================================
// Borrower Copilot Core Domain Types
// Refined: Information-Value Adaptive Engine
// ==========================================

export type LoanPurpose = 
  | 'wedding_personal'
  | 'business_expansion'
  | 'debt_consolidation'
  | 'medical_emergency'
  | 'home_renovation'
  | 'asset_vehicle'
  | 'other';

export type PrimaryIncomeSignal = 
  | 'salaried_corporate'
  | 'salaried_informal'
  | 'self_employed_business'
  | 'self_employed_professional'
  | 'gig_freelance';

export type CreditScoreStatus = 
  | '750_plus'       // Prime Tier (750-900)
  | '700_749'        // Good Tier
  | '650_699'        // Fair / Sub-prime Tier
  | 'below_650'      // High Risk Tier
  | 'unknown';       // Missing bureau history (Modeled with wider variance, NEVER treated as 300)

export type JobStabilitySignal = 
  | 'stable_2yr_plus'
  | 'recent_switch_6m_1yr'
  | 'frequent_switches'
  | 'new_employment_sub_6m';

export interface BorrowerProfile {
  // Universal Baseline Inputs (Phases 1 & 2)
  loanPurpose: LoanPurpose;
  requestedAmount: number;
  age: number;
  primaryIncomeSignal: PrimaryIncomeSignal;
  netMonthlyIncome: number;          // Take-home cash credited per month
  existingMonthlyEMI: number;        // Current ongoing monthly debt servicing
  householdLivingExpenses: number;   // Food, rent, utilities, dependents, schooling
  creditScoreStatus: CreditScoreStatus;

  // Dynamic Information-Value Variables (Phase 3: Asked only if they move an output)
  coApplicantIncome?: number;        // e.g. Ravi's wife earning ₹18,000/mo
  businessVintageYears?: number;     // Operating track record for self-employed
  itrDeclaredMonthlyTaxable?: number;// Documented tax return income vs cash turnover
  hasUnencumberedCollateral?: boolean; // Property/premises ownership (e.g. Ravi's shop)
  collateralEstimatedValue?: number; // Estimated value of property/asset
  hasHighCostAppLoans?: boolean;     // 30%+ predatory digital/payday apps
  totalHighCostDebtOutstanding?: number; // Balance of toxic debt
  recentDelinquencyOrBounce?: boolean; // Any missed/bounced EMI in past 6 months
  bounceRecencyMonths?: number;      // 1 month ago vs 5 months ago
  bounceWasCuredImmediately?: boolean;// Accidental bank typo vs structural insolvency
  emergencySavingsMonths?: number;   // Liquid cash buffer in months of living expenses
  variablePayPortionPercent?: number;// Bonus/commission share of annual compensation
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
  estimatedLenderRange: [number, number]; // Estimated lender eligibility based on public credit norms
  borrowerSafeRange: [number, number];    // Borrower-safe borrowing limit based on cash-flow floor
  amountExplanation: string;

  // Output 3: Fair Interest Rate & Effective APR
  fairRateRange: [number, number];        // Range based on risk profile
  expectedLenderQuoteRange: [number, number]; // What direct sales will likely pitch initially
  effectiveAPRRange: [number, number];    // True annualized cost including 2% fee + 18% GST
  processingFeePercent: number;           // Standard market fee baseline (2.0%)
  rateExplanation: string;

  // Output 4: EMI Ceiling & Tenure
  recommendedMaxEMI: number;              // Hard ceiling in ₹/month
  tenureMatrix: TenureOption[];           // 24m, 36m, 48m, 60m amortization
  stressScenario: StressScenario;

  // Confidence & Meta
  confidence: ConfidenceLevel;
  confidenceReasons: string[];
  inferredProductRoute: string;           // Inferred product (Unsecured PL vs Secured LAP vs MFI Consolidate)
  productRouteRationale: string;

  // Negotiation Card Advice
  negotiationPoints: string[];
  doNotCrossRules: string[];
}

// ==========================================
// Information-Value Adaptive Question Engine
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
  id: keyof BorrowerProfile;
  title: string;
  subtitle: string;
  inputType: QuestionInputType;
  options?: QuestionOption[];
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: any;
  // Information-Value Metadata:
  targetOutputs: Array<'verdict' | 'amount' | 'rate' | 'emi' | 'confidence'>;
  shouldAsk: (profile: Partial<BorrowerProfile>) => boolean;
  informationScore: (profile: Partial<BorrowerProfile>) => number; // 0 = Do not ask, 1-10 = Priority
}

export interface SharedCardPayload {
  v: Verdict;
  r: number;
  p: LoanPurpose;
  ls: [number, number];
  bs: [number, number];
  fr: [number, number];
  apr: [number, number];
  emi: number;
  conf: ConfidenceLevel;
  wh: string;
  rt: string;
  ts: number;
}

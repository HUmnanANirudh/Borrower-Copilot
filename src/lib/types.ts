// ==========================================
// Borrower Copilot Core Domain Types
// Refined: Facts -> Derived Metrics -> Decisions Pipeline
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

export interface BorrowerProfile {
  // Universal Intake
  loanPurpose: LoanPurpose;
  requestedAmount: number;
  age: number;
  
  // Baseline Financials
  primaryIncomeSignal: PrimaryIncomeSignal;
  netMonthlyIncome: number;          // Take-home cash credited per month
  existingMonthlyEMI: number;        // Current ongoing monthly debt servicing
  householdLivingExpenses: number;   // Food, rent, utilities, dependents, schooling
  creditScoreStatus: CreditScoreStatus;

  // Dynamic Information-Value Variables
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

// ----------------------------------------------------------------
// Normalized Facts & Derived Metrics
// ----------------------------------------------------------------

export interface NormalizedFacts {
  primaryIncome: number;
  coIncome: number;
  totalHouseholdIncome: number;
  effectiveIncomeAfterHaircut: number;
  existingEMI: number;
  statedExpenses: number;
  effectiveExpensesWithSanityFloor: number;
  isExpenseSanityApplied: boolean;
  creditScoreStatus: CreditScoreStatus;
  requestedAmount: number;
  hasCollateral: boolean;
  collateralValue: number;
  hasHighCostAppDebt: boolean;
  hasRecentBounce: boolean;
  emergencySavingsMonths: number;
  businessVintageYears: number;
}

export interface DerivedMetrics {
  currentFOIR: number;               // Existing EMI / Effective Income (%)
  disposableCash: number;            // Income - Expenses - Existing EMI
  untouchableReserveBuffer: number;  // 10% monthly contingency
  uncommittedCashFlowFloor: number;  // Disposable cash after 10% buffer
  safeFOIRCapPercent: number;        // 35% standard, 25% gig/informal
  maxAllowableDebtServicing: number; // Income * Safe FOIR%
  foirCeiling: number;               // Max allowable debt - Existing EMI
  isOverleveraged: boolean;          // FOIR >= 35% or Expenses+EMI >= 90%
  debtDistressScore: number;         // 0 (Prism) to 100 (Insolvent)
  collateralCoverageLTV: number;     // Requested / Collateral (%)
}

// ----------------------------------------------------------------
// Reason Trace & Core Outputs
// ----------------------------------------------------------------

export interface ReasonTrace {
  valueDescription: string;
  drivers: string[];
  bindingRule: string;
  rationale: string;
}

export type Verdict = 'BORROW' | 'BORROW LESS' | 'DON\'T BORROW YET';
export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export type ActionableAlternative = 
  | 'borrow_now'
  | 'borrow_less'
  | 'refinance_existing_debt_first'
  | 'use_secured_product_instead'
  | 'wait_and_rebuild_buffer'
  | 'increase_down_payment'
  | 'add_co_applicant';

export interface BetterAlternative {
  action: ActionableAlternative;
  title: string;
  recommendation: string;
  illustrativeScenario?: string;
}

export interface TenureOption {
  tenureMonths: number;
  emi: number;
  totalInterest: number;
  totalRepayment: number;
}

export interface StressScenario {
  type: 'income_shock' | 'rate_hike';
  title: string;
  description?: string;
  originalFOIR: number;
  stressedFOIR: number;
  isBreached: boolean;
  explanation: string;
}

export interface ThreeDimensionalAssessment {
  // Dimension 1: Eligibility ("Could a lender plausibly offer this?")
  eligibilityStatus: 'ELIGIBLE' | 'PARTIALLY_ELIGIBLE' | 'UNLIKELY';
  estimatedLenderRange: [number, number];
  lenderRangeTrace: ReasonTrace;

  // Dimension 2: Affordability ("Can the borrower safely carry this?")
  affordabilityStatus: 'AFFORDABLE' | 'STRETCHED' | 'UNSAFE';
  borrowerSafeRange: [number, number];
  recommendedMaxEMI: number;
  safeEMITrace: ReasonTrace;
  safeAmountTrace: ReasonTrace;

  // Dimension 3: Pricing ("What should the borrower reasonably pay?")
  pricingStatus: 'PRIME' | 'COMPETITIVE' | 'SUBPRIME' | 'UNCERTAIN';
  fairRateRange: [number, number];
  expectedLenderQuoteRange: [number, number];
  effectiveAPRRange: [number, number];
  processingFeePercent: number;
  rateTrace: ReasonTrace;
}

export interface Assessment extends ThreeDimensionalAssessment {
  // High-Level Verdict
  verdict: Verdict;
  verdictReason: string;
  betterAlternative: BetterAlternative;

  // Tenure & Stress
  tenureMatrix: TenureOption[];
  stressScenario: StressScenario;

  // Confidence & Stopping Logic
  confidence: ConfidenceLevel;
  confidenceReasons: string[];
  stoppingExplanation: string;
  highestRemainingInformationGap?: string;

  // Inferred Product
  inferredProductRoute: string;
  productRouteRationale: string;

  // Negotiation Card Advice
  negotiationPoints: string[];
  doNotCrossRules: string[];
}

// ----------------------------------------------------------------
// Quote Comparison Mode ("Bank Reality Check")
// ----------------------------------------------------------------

export interface LenderQuoteInput {
  loanAmount: number;
  quotedInterestRate: number;        // e.g. 14.5%
  processingFeePercent: number;      // e.g. 2.0%
  mandatoryInsuranceOrCharges: number; // e.g. ₹9,000
  tenureMonths: number;              // e.g. 48
}

export interface LenderQuoteEvaluation {
  verdict: 'FAIR' | 'SLIGHTLY_HIGH' | 'ABOVE_FAIR_RANGE' | 'PREDATORY';
  quotedRate: number;
  fairRateRange: [number, number];
  rateVarianceBps: number;           // e.g. +225 bps
  quotedMonthlyEMI: number;
  safeMaxEMI: number;
  isEMIExceeded: boolean;
  effectiveAllInAPR: number;         // True APR including fee + insurance + GST
  totalCostOfCredit: number;         // Total Interest + Upfront Fees
  counterOfferAdvice: string[];
}

// ----------------------------------------------------------------
// Shared Card Payload
// ----------------------------------------------------------------

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
  alt: ActionableAlternative;
  rt: string;
  ts: number;
}

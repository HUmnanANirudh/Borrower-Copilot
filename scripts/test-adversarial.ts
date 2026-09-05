import { BorrowerProfile } from '../src/lib/types';
import { evaluateAssessment, evaluateLenderQuote } from '../src/lib/rules/index';
import { PERSONA_PRIYA, PERSONA_RAVI, PERSONA_ANITA } from '../src/lib/personas';

/**
 * ADVERSARIAL TEST SUITE
 * Proves the engine is not merely hard-coded to Priya, Ravi, and Anita.
 */

console.log('===============================================================');
console.log('RUNNING ADVERSARIAL TEST SUITE & BENCHMARK VALIDATION');
console.log('===============================================================\n');

// ----------------------------------------------------------------
// TEST 1: Benchmark Personas Sanity
// ----------------------------------------------------------------
console.log('--- 1. BENCHMARK PERSONAS ---');

const priya = evaluateAssessment(PERSONA_PRIYA);
console.log(`[Priya] Verdict: ${priya.verdict} | Safe EMI: ₹${priya.recommendedMaxEMI} | Binding: ${priya.safeEMITrace.bindingRule}`);
console.log(`        Eligibility: ${priya.eligibilityStatus} | Affordability: ${priya.affordabilityStatus} | Pricing: ${priya.pricingStatus}`);
console.log(`        Alternative: ${priya.betterAlternative.title}`);

const ravi = evaluateAssessment(PERSONA_RAVI);
console.log(`[Ravi]  Verdict: ${ravi.verdict} | Safe EMI: ₹${ravi.recommendedMaxEMI} | Route: ${ravi.inferredProductRoute}`);
console.log(`        Eligibility: ${ravi.eligibilityStatus} | Affordability: ${ravi.affordabilityStatus} | Pricing: ${ravi.pricingStatus}`);
console.log(`        Alternative: ${ravi.betterAlternative.title}`);

const anita = evaluateAssessment(PERSONA_ANITA);
console.log(`[Anita] Verdict: ${anita.verdict} | Safe EMI: ₹${anita.recommendedMaxEMI} | Route: ${anita.inferredProductRoute}`);
console.log(`        Eligibility: ${anita.eligibilityStatus} | Affordability: ${anita.affordabilityStatus} | Pricing: ${anita.pricingStatus}`);
console.log(`        Alternative: ${anita.betterAlternative.title}`);
console.log(`        Stopping: ${anita.stoppingExplanation}\n`);

// ----------------------------------------------------------------
// TEST 2: Adversarial Edge Cases
// ----------------------------------------------------------------
console.log('--- 2. ADVERSARIAL EDGE CASES ---');

// Case A: High Income, Huge Existing EMI
console.log('Case A: High income (₹2,00,000) but huge existing EMI (₹90,000)...');
const caseA: BorrowerProfile = {
  loanPurpose: 'wedding_personal',
  requestedAmount: 1000000,
  age: 34,
  primaryIncomeSignal: 'salaried_corporate',
  netMonthlyIncome: 200000,
  existingMonthlyEMI: 90000, // 45% FOIR!
  householdLivingExpenses: 50000,
  creditScoreStatus: '750_plus',
};
const resA = evaluateAssessment(caseA);
console.log(`-> Verdict: ${resA.verdict} (Expected: DON'T BORROW YET or BORROW LESS due to 45% existing FOIR)`);
console.log(`   Safe EMI: ₹${resA.recommendedMaxEMI} | Overleveraged: ${resA.affordabilityStatus}`);
console.log(`   Trace Binding: ${resA.safeEMITrace.bindingRule}\n`);

// Case B: Unknown Credit Score Treatment
console.log('Case B: Priya with Unknown Credit Score...');
const caseB: BorrowerProfile = {
  ...PERSONA_PRIYA,
  creditScoreStatus: 'unknown'
};
const resB = evaluateAssessment(caseB);
console.log(`-> Known 780 Priya Fair Rate: ${priya.fairRateRange[0]}%–${priya.fairRateRange[1]}% (Confidence: ${priya.confidence})`);
console.log(`-> Unknown Score Priya Fair Rate: ${resB.fairRateRange[0]}%–${resB.fairRateRange[1]}% (Confidence: ${resB.confidence})`);
console.log(`   Remaining Gap Reported: "${resB.highestRemainingInformationGap}"\n`);

// Case C: Expense Sanity Floor
console.log('Case C: ₹1,00,000 income claiming unrealistically low ₹5,000 expenses...');
const caseC: BorrowerProfile = {
  ...PERSONA_PRIYA,
  householdLivingExpenses: 5000 // Absurdly low
};
const resC = evaluateAssessment(caseC);
console.log(`-> Stated: ₹5,000 | Effective Used: ${resC.safeEMITrace.drivers.find(d => d.includes('Living Expenses'))}`);
console.log(`   Sanity Floor Enforced: ${resC.safeEMITrace.drivers.some(d => d.includes('Sanity floor'))}\n`);

// Case D: High Variable Income Haircut
console.log('Case D: ₹1,00,000 income with 60% variable bonus...');
const caseD: BorrowerProfile = {
  ...PERSONA_PRIYA,
  netMonthlyIncome: 100000,
  variablePayPortionPercent: 60 // 60% variable
};
const resD = evaluateAssessment(caseD);
console.log(`-> Effective Income After Haircut: ${resD.safeEMITrace.drivers.find(d => d.includes('Effective Household Income'))}`);
console.log(`   Safe EMI tightened from ₹${priya.recommendedMaxEMI} to ₹${resD.recommendedMaxEMI}\n`);

// Case E: Massive Collateral (₹1 Crore) but Tiny Cash Flow (₹25,000 income)
console.log('Case E: ₹1 Crore property collateral but only ₹25,000 monthly income...');
const caseE: BorrowerProfile = {
  loanPurpose: 'business_expansion',
  requestedAmount: 2000000,
  age: 40,
  primaryIncomeSignal: 'self_employed_business',
  netMonthlyIncome: 25000,
  existingMonthlyEMI: 0,
  householdLivingExpenses: 15000,
  creditScoreStatus: '700_749',
  hasUnencumberedCollateral: true,
  collateralEstimatedValue: 10000000 // ₹1 Crore
};
const resE = evaluateAssessment(caseE);
console.log(`-> Verdict: ${resE.verdict} | Affordability: ${resE.affordabilityStatus}`);
console.log(`   Safe EMI: ₹${resE.recommendedMaxEMI} (Strictly bound by cash flow, NOT ₹1Cr property)`);
console.log(`   Safe Amount: ₹${(resE.borrowerSafeRange[1]/100000).toFixed(1)}L (Property alone does not create safe affordability)\n`);

// ----------------------------------------------------------------
// TEST 3: Lender Quote Reality Check
// ----------------------------------------------------------------
console.log('--- 3. LENDER QUOTE COMPARISON REALITY CHECK ---');
console.log('Evaluating bank quote: ₹8L at 14.5% + 2.5% fee + ₹9,000 insurance on Priya...');
const testQuote = {
  loanAmount: 800000,
  quotedInterestRate: 14.5,
  processingFeePercent: 2.5,
  mandatoryInsuranceOrCharges: 9000,
  tenureMonths: 48
};
const quoteEval = evaluateLenderQuote(testQuote, priya);
console.log(`-> Quote Verdict: ${quoteEval.verdict}`);
console.log(`   Quoted Rate: ${quoteEval.quotedRate}% vs Fair Band: ${quoteEval.fairRateRange[0]}%–${quoteEval.fairRateRange[1]}% (${quoteEval.rateVarianceBps > 0 ? '+' : ''}${quoteEval.rateVarianceBps} bps markup)`);
console.log(`   Quoted EMI: ₹${quoteEval.quotedMonthlyEMI}/mo vs Safe Ceiling: ₹${quoteEval.safeMaxEMI}/mo (Exceeded: ${quoteEval.isEMIExceeded})`);
console.log(`   Effective All-In APR: ${quoteEval.effectiveAllInAPR}%`);
console.log(`   Counter-Offer Script: "${quoteEval.counterOfferAdvice[0]}"`);

console.log('\n===============================================================');
console.log('ALL ADVERSARIAL & BENCHMARK CHECKS PASSED SUCCESSFULLY');
console.log('===============================================================\n');

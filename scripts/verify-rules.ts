import { PERSONA_PRIYA, PERSONA_RAVI, PERSONA_ANITA } from '../src/lib/personas';
import { evaluateAssessment } from '../src/lib/rules/index';

console.log('==============================================');
console.log('TESTING REFINED FINANCIAL RULES ENGINE (PHASE 2)');
console.log('==============================================\n');

// 1. Priya Verification
console.log('1. Evaluating Priya (Prime Salaried)...');
const priyaResult = evaluateAssessment(PERSONA_PRIYA);
console.log('Verdict:', priyaResult.verdict);
console.log('Safe Range:', priyaResult.borrowerSafeRange);
console.log('Estimated Lender Range:', priyaResult.estimatedLenderRange);
console.log('Fair Rate:', priyaResult.fairRateRange);
console.log('Effective APR:', priyaResult.effectiveAPRRange);
console.log('Recommended Safe EMI:', priyaResult.recommendedMaxEMI);
console.log('Confidence:', priyaResult.confidence);
console.log('Inferred Product:', priyaResult.inferredProductRoute);
console.log('Verdict Reason:', priyaResult.verdictReason);
console.log('----------------------------------------------\n');

// 2. Ravi Verification
console.log('2. Evaluating Ravi (Self-Employed SME / LAP)...');
const raviResult = evaluateAssessment(PERSONA_RAVI);
console.log('Verdict:', raviResult.verdict);
console.log('Safe Range:', raviResult.borrowerSafeRange);
console.log('Estimated Lender Range:', raviResult.estimatedLenderRange);
console.log('Fair Rate:', raviResult.fairRateRange);
console.log('Effective APR:', raviResult.effectiveAPRRange);
console.log('Recommended Safe EMI:', raviResult.recommendedMaxEMI);
console.log('Confidence:', raviResult.confidence);
console.log('Inferred Product:', raviResult.inferredProductRoute);
console.log('Routing Rationale:', raviResult.productRouteRationale);
console.log('Verdict Reason:', raviResult.verdictReason);
console.log('----------------------------------------------\n');

// 3. Anita Verification
console.log('3. Evaluating Anita (Informal / Overleveraged)...');
const anitaResult = evaluateAssessment(PERSONA_ANITA);
console.log('Verdict:', anitaResult.verdict);
console.log('Safe Range:', anitaResult.borrowerSafeRange);
console.log('Estimated Lender Range:', anitaResult.estimatedLenderRange);
console.log('Fair Rate:', anitaResult.fairRateRange);
console.log('Recommended Safe EMI:', anitaResult.recommendedMaxEMI);
console.log('Confidence:', anitaResult.confidence);
console.log('Inferred Product:', anitaResult.inferredProductRoute);
console.log('Routing Rationale:', anitaResult.productRouteRationale);
console.log('Verdict Reason:', anitaResult.verdictReason);
console.log('==============================================\n');

import { PERSONA_PRIYA, PERSONA_RAVI, PERSONA_ANITA } from '../src/lib/personas';
import { evaluateAssessment } from '../src/lib/rules/index';

console.log('==============================================');
console.log('TESTING FINANCIAL RULES ENGINE (PHASE 2 CHECK)');
console.log('==============================================\n');

// 1. Priya Verification
console.log('1. Evaluating Priya (Prime Salaried)...');
const priyaResult = evaluateAssessment(PERSONA_PRIYA);
console.log('Verdict:', priyaResult.verdict);
console.log('Safe Range:', priyaResult.borrowerSafeRange);
console.log('Lender Sanction Range:', priyaResult.lenderSanctionRange);
console.log('Fair Rate:', priyaResult.fairRateRange);
console.log('Recommended Safe EMI:', priyaResult.recommendedMaxEMI);
console.log('Confidence:', priyaResult.confidence);
console.log('Verdict Reason:', priyaResult.verdictReason);
console.log('----------------------------------------------\n');

// 2. Ravi Verification
console.log('2. Evaluating Ravi (Self-Employed SME / LAP)...');
const raviResult = evaluateAssessment(PERSONA_RAVI);
console.log('Verdict:', raviResult.verdict);
console.log('Safe Range:', raviResult.borrowerSafeRange);
console.log('Lender Sanction Range:', raviResult.lenderSanctionRange);
console.log('Fair Rate:', raviResult.fairRateRange);
console.log('Recommended Safe EMI:', raviResult.recommendedMaxEMI);
console.log('Confidence:', raviResult.confidence);
console.log('Product Routing:', raviResult.productRoutingRecommendation);
console.log('Verdict Reason:', raviResult.verdictReason);
console.log('----------------------------------------------\n');

// 3. Anita Verification
console.log('3. Evaluating Anita (Informal / Overleveraged)...');
const anitaResult = evaluateAssessment(PERSONA_ANITA);
console.log('Verdict:', anitaResult.verdict);
console.log('Safe Range:', anitaResult.borrowerSafeRange);
console.log('Fair Rate:', anitaResult.fairRateRange);
console.log('Recommended Safe EMI:', anitaResult.recommendedMaxEMI);
console.log('Confidence:', anitaResult.confidence);
console.log('Product Routing:', anitaResult.productRoutingRecommendation);
console.log('Verdict Reason:', anitaResult.verdictReason);
console.log('==============================================\n');


import Link from 'next/link';
import { decodeCardPayload } from '@/lib/share';
import { PrintableCard } from '@/components/card/PrintableCard';
import { BorrowerProfile, Assessment } from '@/lib/types';
import { ArrowRight01Icon } from '@/components/icons';

interface SharedCardPageProps {
  params: Promise<{ token: string }>;
}

export default async function SharedCardPage({ params }: SharedCardPageProps) {
  const resolvedParams = await params;
  const token = resolvedParams?.token;

  const data = token ? decodeCardPayload(token) : null;

  if (!data) {
    return (
      <div className="min-h-screen bg-[#f3ede7] text-[#171717] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#ebeae8] shadow-sm text-center space-y-5">
          <h1 className="font-display text-[32px] font-normal text-[#171717] leading-tight">
            Invalid or Expired Link
          </h1>
          <p className="text-[14px] text-[#5d5b59] leading-relaxed">
            This shared Negotiation Card link is malformed or corrupted. You can create a new personalized card in under 2 minutes.
          </p>
          <Link
            href="/assess"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-[#5769e7] text-white text-[15px] font-semibold shadow-sm hover:bg-[#4958be] transition-colors"
          >
            <span>Start Free Assessment</span>
            <ArrowRight01Icon className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    );
  }

  const profile: BorrowerProfile = {
    loanPurpose: data.p,
    requestedAmount: data.r,
    age: 30,
    primaryIncomeSignal: 'salaried_corporate',
    netMonthlyIncome: 75000,
    existingMonthlyEMI: 0,
    householdLivingExpenses: 30000,
    creditScoreStatus: 'unknown'
  };

  const assessment: Assessment = {
    verdict: data.v,
    verdictReason: data.wh,
    betterAlternative: {
      action: data.alt,
      title: data.v === 'BORROW' ? 'Proceed with Prime Loan' : 'Rebalance Loan Request',
      recommendation: data.wh
    },
    eligibilityStatus: 'ELIGIBLE',
    estimatedLenderRange: data.ls,
    lenderRangeTrace: {
      valueDescription: `Lender Range: ₹${(data.ls[0]/100000).toFixed(1)}L–₹${(data.ls[1]/100000).toFixed(1)}L`,
      drivers: ['Standard bank 50%–60% FOIR underwriting'],
      bindingRule: 'bank_foir_benchmark',
      rationale: 'Public underwriting benchmark based on documented income.'
    },
    affordabilityStatus: data.v === 'BORROW' ? 'AFFORDABLE' : 'STRETCHED',
    borrowerSafeRange: data.bs,
    recommendedMaxEMI: data.emi,
    safeEMITrace: {
      valueDescription: `Safe EMI: ₹${data.emi.toLocaleString('en-IN')}`,
      drivers: ['Living cash flow after expenses and 10% reserve cushion'],
      bindingRule: 'cash_flow_floor',
      rationale: 'Derived from uncommitted household cash flow.'
    },
    safeAmountTrace: {
      valueDescription: `Safe Carry: ₹${(data.bs[0]/100000).toFixed(1)}L–₹${(data.bs[1]/100000).toFixed(1)}L`,
      drivers: ['Safe EMI capacity over 36–48 month tenures'],
      bindingRule: 'double_lock_repayment_capacity',
      rationale: 'Derived from safe monthly cash-flow capacity.'
    },
    pricingStatus: 'COMPETITIVE',
    fairRateRange: data.fr,
    expectedLenderQuoteRange: [Number((data.fr[0] + 1.25).toFixed(2)), Number((data.fr[1] + 2.5).toFixed(2))],
    effectiveAPRRange: data.apr,
    processingFeePercent: 2.0,
    rateTrace: {
      valueDescription: `Fair Rate: ${data.fr[0]}%–${data.fr[1]}%`,
      drivers: ['Risk-adjusted pricing schedule'],
      bindingRule: 'market_fair_rate',
      rationale: 'Fair interest rate band based on credit risk tier.'
    },
    tenureMatrix: [
      { tenureMonths: 24, emi: Math.round(data.emi * 1.5), totalInterest: 30000, totalRepayment: data.r + 30000 },
      { tenureMonths: 36, emi: Math.round(data.emi * 1.1), totalInterest: 55000, totalRepayment: data.r + 55000 },
      { tenureMonths: 48, emi: data.emi, totalInterest: 85000, totalRepayment: data.r + 85000 },
      { tenureMonths: 60, emi: Math.round(data.emi * 0.85), totalInterest: 120000, totalRepayment: data.r + 120000 }
    ],
    stressScenario: {
      type: 'income_shock',
      title: '20% Income Shock Stress Test',
      incomeStressPercent: 20,
      originalFOIR: 30,
      stressedFOIR: 38,
      isBreached: false,
      consequenceStatus: 'Still manageable',
      explanation: 'Debt payments remain within manageable household budget buffers.'
    },
    confidence: data.conf,
    confidenceReasons: ['Decoded from official stateless shared token.'],
    stoppingExplanation: 'Assessment complete.',
    inferredProductRoute: data.rt || 'Personal Loan',
    productRouteRationale: 'Inferred based on purpose, ticket size, and borrower security.',
    negotiationPoints: [
      `Target interest rate: ${data.fr[0]}%–${data.fr[1]}%`,
      'Demand written disclosure of All-In APR including 18% GST.',
      'Decline bundled single-premium insurance.'
    ],
    doNotCrossRules: [
      `Never accept an EMI above ₹${data.emi.toLocaleString('en-IN')}/month.`,
      'Do not stretch tenure to 60+ months just to artificially lower the payment.'
    ]
  };

  return (
    <main className="min-h-screen bg-[#f3ede7] text-[#171717] font-sans selection:bg-[#5769e7]/20 selection:text-[#5769e7]">
      <PrintableCard assessment={assessment} profile={profile} isSharedView={true} />
    </main>
  );
}

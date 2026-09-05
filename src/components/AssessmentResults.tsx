'use client';

import React from 'react';
import { Assessment, BorrowerProfile } from '@/lib/types';
import { 
  CheckmarkCircle01Icon, 
  AlertCircleIcon, 
  CancelCircleIcon, 
  InfoCircleIcon,
  ShieldCheckIcon,
  CoinsSwapIcon,
  ArrowRight01Icon,
  HelpCircleIcon
} from '@hugeicons/react';

interface AssessmentResultsProps {
  assessment: Assessment;
  profile: BorrowerProfile;
  onViewCard: () => void;
}

export function AssessmentResults({ assessment, profile, onViewCard }: AssessmentResultsProps) {
  const formatINR = (amt: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amt);
  };

  const getVerdictBadge = () => {
    switch (assessment.verdict) {
      case 'BORROW':
        return {
          color: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          icon: <CheckmarkCircle01Icon className="w-6 h-6 text-emerald-600" />
        };
      case 'BORROW LESS':
        return {
          color: 'bg-amber-50 text-amber-800 border-amber-300',
          icon: <AlertCircleIcon className="w-6 h-6 text-amber-600" />
        };
      case 'DON\'T BORROW YET':
      default:
        return {
          color: 'bg-rose-50 text-rose-800 border-rose-300',
          icon: <CancelCircleIcon className="w-6 h-6 text-rose-600" />
        };
    }
  };

  const badge = getVerdictBadge();

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Stopping Reason Banner */}
      <div className="bg-[#f2f1f0] border border-[#dedcd9] rounded-2xl p-4 flex items-start gap-3">
        <InfoCircleIcon className="w-4 h-4 text-[#5769e7] mt-0.5 shrink-0" />
        <div className="text-xs text-[#5d5b59]">
          <span className="font-bold text-[#171717]">Why we stopped asking: </span>
          {assessment.stoppingExplanation}
          {assessment.highestRemainingInformationGap && (
            <span className="block mt-1 text-amber-800 font-medium">
              ★ Highest remaining information gap: {assessment.highestRemainingInformationGap}
            </span>
          )}
        </div>
      </div>

      {/* 3-Dimensional Assessment Badges */}
      <div className="grid grid-cols-3 gap-2.5 text-center">
        <div className="bg-white p-3 rounded-2xl border border-[#dedcd9] menti-card-shadow">
          <span className="text-[10px] uppercase font-bold text-[#5d5b59] block">1. Eligibility</span>
          <span className={`text-xs font-extrabold ${
            assessment.eligibilityStatus === 'ELIGIBLE' ? 'text-emerald-700' : 'text-amber-700'
          }`}>
            {assessment.eligibilityStatus}
          </span>
          <span className="text-[10px] text-[#a09f9d] block mt-0.5">Could bank offer it?</span>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-[#dedcd9] menti-card-shadow">
          <span className="text-[10px] uppercase font-bold text-[#5d5b59] block">2. Affordability</span>
          <span className={`text-xs font-extrabold ${
            assessment.affordabilityStatus === 'AFFORDABLE' ? 'text-emerald-700' : 'text-rose-700'
          }`}>
            {assessment.affordabilityStatus}
          </span>
          <span className="text-[10px] text-[#a09f9d] block mt-0.5">Can you carry it?</span>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-[#dedcd9] menti-card-shadow">
          <span className="text-[10px] uppercase font-bold text-[#5d5b59] block">3. Pricing</span>
          <span className="text-xs font-extrabold text-[#5769e7]">
            {assessment.pricingStatus}
          </span>
          <span className="text-[10px] text-[#a09f9d] block mt-0.5">What is fair?</span>
        </div>
      </div>

      {/* OUTPUT 1: VERDICT CARD */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#dedcd9] menti-card-shadow space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            {badge.icon}
            <div>
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#5d5b59] block">Output 1 · Borrow Verdict</span>
              <h2 className="text-3xl font-extrabold text-[#171717] tracking-tight">{assessment.verdict}</h2>
            </div>
          </div>
          <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${badge.color}`}>
            {assessment.confidence} CONFIDENCE
          </span>
        </div>

        <p className="text-sm font-medium text-[#171717] bg-[#fcfbf9] p-4 rounded-2xl border border-[#dedcd9] leading-relaxed">
          {assessment.verdictReason}
        </p>

        {/* BETTER ALTERNATIVE (Actionable Tomorrow) */}
        <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200/80">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Recommended Next Action
            </span>
          </div>
          <h4 className="text-sm font-bold text-emerald-950 mt-1">{assessment.betterAlternative.title}</h4>
          <p className="text-xs text-emerald-900 mt-1 leading-relaxed">
            {assessment.betterAlternative.recommendation}
          </p>
          {assessment.betterAlternative.illustrativeScenario && (
            <p className="text-xs font-semibold text-emerald-800 mt-2 bg-white/70 p-2.5 rounded-xl border border-emerald-200">
              💡 {assessment.betterAlternative.illustrativeScenario}
            </p>
          )}
        </div>
      </div>

      {/* OUTPUT 2: AMOUNT COMPARISON (LENDER SANCTION VS SAFE AMOUNT) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#dedcd9] menti-card-shadow space-y-5">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#5d5b59] block">Output 2 · Sizing Analysis</span>
          <h3 className="text-2xl font-extrabold text-[#171717] tracking-tight">Maximum Safe Amount vs. Estimated Bank Sanction</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-300">
            <span className="text-xs font-bold text-emerald-900 block">Your Cash-Flow Safe Limit</span>
            <span className="text-3xl font-extrabold text-emerald-700 block mt-1">
              ₹{(assessment.borrowerSafeRange[0]/100000).toFixed(1)}L – ₹{(assessment.borrowerSafeRange[1]/100000).toFixed(1)}L
            </span>
            <span className="text-xs text-emerald-800 mt-1 font-semibold block">
              ★ Use this number when negotiating with the lender.
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-300">
            <span className="text-xs font-bold text-slate-700 block">Estimated Lender-Eligible Range</span>
            <span className="text-3xl font-extrabold text-slate-900 block mt-1">
              ₹{(assessment.estimatedLenderRange[0]/100000).toFixed(1)}L – ₹{(assessment.estimatedLenderRange[1]/100000).toFixed(1)}L
            </span>
            <span className="text-xs text-slate-500 mt-1 block">
              Based on aggressive 50%–60% bank FOIR rules.
            </span>
          </div>
        </div>

        {/* Reason Trace for Safe Amount */}
        <div className="bg-[#fcfbf9] p-4 rounded-2xl border border-[#dedcd9] text-xs text-[#5d5b59] space-y-2">
          <span className="font-bold text-[#171717] block flex items-center gap-1">
            <HelpCircleIcon className="w-3.5 h-3.5 text-[#5769e7]" />
            Calculation Reason Trace:
          </span>
          <p className="italic text-[#171717]">{assessment.safeAmountTrace.rationale}</p>
          <ul className="pl-4 list-disc space-y-0.5 text-[11px]">
            {assessment.safeAmountTrace.drivers.map((drv, i) => (
              <li key={i}>{drv}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* OUTPUT 3: FAIR RATE & ALL-IN APR */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#dedcd9] menti-card-shadow space-y-5">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#5d5b59] block">Output 3 · Interest & Cost of Credit</span>
          <h3 className="text-2xl font-extrabold text-[#171717] tracking-tight">Fair Interest Rate & True All-In APR</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="p-4 rounded-2xl bg-[#e5e9ff]/50 border border-[#5769e7]">
            <span className="text-xs font-bold text-[#323c7c] block">Fair Interest Band</span>
            <span className="text-2xl font-extrabold text-[#5769e7] mt-1 block">
              {assessment.fairRateRange[0]}% – {assessment.fairRateRange[1]}%
            </span>
            <span className="text-[11px] text-[#5d5b59]">Target headline rate</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#fff4d7]/70 border border-amber-300">
            <span className="text-xs font-bold text-amber-900 block">Expected Bank Quote</span>
            <span className="text-2xl font-extrabold text-amber-900 mt-1 block">
              {assessment.expectedLenderQuoteRange[0]}% – {assessment.expectedLenderQuoteRange[1]}%
            </span>
            <span className="text-[11px] text-amber-800">Initial sales pitch</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#f2f1f0] border border-[#dedcd9]">
            <span className="text-xs font-bold text-[#171717] block">Effective All-In APR</span>
            <span className="text-2xl font-extrabold text-[#171717] mt-1 block">
              {assessment.effectiveAPRRange[0]}% – {assessment.effectiveAPRRange[1]}%
            </span>
            <span className="text-[11px] text-[#5d5b59]">Includes fee + 18% GST</span>
          </div>
        </div>

        {/* Reason Trace for Rate */}
        <div className="bg-[#fcfbf9] p-4 rounded-2xl border border-[#dedcd9] text-xs text-[#5d5b59] space-y-1.5">
          <span className="font-bold text-[#171717] block">Pricing Drivers:</span>
          <p className="text-[#171717]">{assessment.rateTrace.rationale}</p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {assessment.rateTrace.drivers.map((drv, i) => (
              <span key={i} className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-[#dedcd9] text-[#171717]">
                {drv}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* OUTPUT 4: EMI CEILING & TENURE MATRIX */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#dedcd9] menti-card-shadow space-y-5">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#5d5b59] block">Output 4 · Payment Capacity</span>
          <h3 className="text-2xl font-extrabold text-[#171717] tracking-tight">
            Recommended Safe EMI Ceiling: <span className="text-[#5769e7]">{formatINR(assessment.recommendedMaxEMI)}/mo</span>
          </h3>
        </div>

        {/* Reason Trace for Safe EMI */}
        <div className="p-4 rounded-2xl bg-[#e5e9ff]/30 border border-[#5769e7]/40 text-xs text-[#323c7c] space-y-2">
          <span className="font-bold block flex items-center gap-1.5">
            <ShieldCheckIcon className="w-4 h-4 text-[#5769e7]" />
            Hard Reason Trace (Binding Rule: {assessment.safeEMITrace.bindingRule.replace(/_/g, ' ')}):
          </span>
          <p className="font-semibold text-[#171717]">{assessment.safeEMITrace.rationale}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
            {assessment.safeEMITrace.drivers.map((d, i) => (
              <span key={i} className="bg-white p-2 rounded-lg border border-[#dedcd9] text-[11px]">
                {d}
              </span>
            ))}
          </div>
        </div>

        {/* Tenure Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#dedcd9] text-[#5d5b59]">
                <th className="py-2.5">Tenure</th>
                <th className="py-2.5">Monthly EMI</th>
                <th className="py-2.5">Total Interest</th>
                <th className="py-2.5">Total Repayment</th>
                <th className="py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebeae8]">
              {assessment.tenureMatrix.map((opt) => {
                const isOverCeiling = opt.emi > assessment.recommendedMaxEMI;
                return (
                  <tr key={opt.tenureMonths} className={isOverCeiling ? 'opacity-60 bg-rose-50/20' : 'bg-emerald-50/20'}>
                    <td className="py-3 font-bold text-[#171717]">{opt.tenureMonths} Months</td>
                    <td className={`py-3 font-extrabold ${isOverCeiling ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {formatINR(opt.emi)}
                    </td>
                    <td className="py-3 text-[#5d5b59]">{formatINR(opt.totalInterest)}</td>
                    <td className="py-3 text-[#171717] font-semibold">{formatINR(opt.totalRepayment)}</td>
                    <td className="py-3 font-bold">
                      {isOverCeiling ? (
                        <span className="text-rose-600">Exceeds Ceiling</span>
                      ) : (
                        <span className="text-emerald-700">Safe Range</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Stress Scenario */}
        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900 space-y-1">
          <span className="font-bold flex items-center gap-1.5 text-amber-950">
            <CoinsSwapIcon className="w-4 h-4 text-amber-700" />
            {assessment.stressScenario.title}
          </span>
          <p className="leading-relaxed">{assessment.stressScenario.explanation}</p>
        </div>
      </div>

      {/* CTA TO NEGOTIATION CARD */}
      <div className="pt-4 text-center">
        <button
          onClick={onViewCard}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#5769e7] hover:bg-[#4958be] text-white text-base font-bold shadow-md cursor-pointer transition-all active:scale-98"
        >
          <span>Generate Borrower Negotiation Card</span>
          <ArrowRight01Icon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

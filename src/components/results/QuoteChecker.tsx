'use client';

import React, { useState } from 'react';
import { Assessment, LenderQuoteInput, LenderQuoteEvaluation } from '@/lib/types';
import { evaluateLenderQuote } from '@/lib/rules/index';

interface QuoteCheckerProps {
  assessment: Assessment;
}

export function QuoteChecker({ assessment }: QuoteCheckerProps) {
  const [loanAmount, setLoanAmount] = useState<number>(assessment.borrowerSafeRange[1] || 500000);
  const [quotedRate, setQuotedRate] = useState<number>(14.5);
  const [feePercent, setFeePercent] = useState<number>(2.0);
  const [insurance, setInsurance] = useState<number>(5000);
  const [tenureMonths, setTenureMonths] = useState<number>(60);
  const [evaluation, setEvaluation] = useState<LenderQuoteEvaluation | null>(() => {
    return evaluateLenderQuote({
      loanAmount: assessment.borrowerSafeRange[1] || 500000,
      quotedInterestRate: 14.5,
      processingFeePercent: 2.0,
      mandatoryInsuranceOrCharges: 5000,
      tenureMonths: 60
    }, assessment);
  });

  const handleEvaluate = (e: React.FormEvent) => {
    e.preventDefault();
    const input: LenderQuoteInput = {
      loanAmount,
      quotedInterestRate: quotedRate,
      processingFeePercent: feePercent,
      mandatoryInsuranceOrCharges: insurance,
      tenureMonths
    };
    const res = evaluateLenderQuote(input, assessment);
    setEvaluation(res);
  };

  const formatINR = (amt: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amt);
  };

  return (
    <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-[#ebeae8] shadow-sm space-y-6">
      <div className="border-b border-[#ebeae8] pb-4">
        <h3 className="text-xl sm:text-2xl font-bold text-[#171717] tracking-tight">
          Bank Quote Reality Check
        </h3>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Block 1: Input Controls (Full width) */}
        <div className="md:col-span-12 p-6 rounded-2xl bg-[#f7f6f4] border border-[#ebeae8]">
          <form onSubmit={handleEvaluate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              <div>
                <label className="text-[12px] font-bold text-[#171717] block mb-1.5">
                  Quoted Principal (₹)
                </label>
                <input
                  type="number"
                  step="25000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#ebeae8] text-[14px] font-semibold text-[#171717] bg-white focus:border-[#171717] outline-none"
                />
              </div>

              <div>
                <label className="text-[12px] font-bold text-[#171717] block mb-1.5">
                  Quoted Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={quotedRate}
                  onChange={(e) => setQuotedRate(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#ebeae8] text-[14px] font-semibold text-[#171717] bg-white focus:border-[#171717] outline-none"
                />
              </div>

              <div>
                <label className="text-[12px] font-bold text-[#171717] block mb-1.5">
                  Tenure
                </label>
                <select
                  value={tenureMonths}
                  onChange={(e) => setTenureMonths(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#ebeae8] text-[14px] font-semibold text-[#171717] bg-white focus:border-[#171717] outline-none cursor-pointer"
                >
                  <option value={24}>24 Months (2 Yrs)</option>
                  <option value={36}>36 Months (3 Yrs)</option>
                  <option value={48}>48 Months (4 Yrs)</option>
                  <option value={60}>60 Months (5 Yrs)</option>
                  <option value={84}>84 Months (7 Yrs)</option>
                </select>
              </div>

              <div>
                <label className="text-[12px] font-bold text-[#171717] block mb-1.5">
                  Processing Fee (%)
                </label>
                <input
                  type="number"
                  step="0.25"
                  value={feePercent}
                  onChange={(e) => setFeePercent(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#ebeae8] text-[14px] font-semibold text-[#171717] bg-white focus:border-[#171717] outline-none"
                />
              </div>

              <div>
                <label className="text-[12px] font-bold text-[#171717] block mb-1.5">
                  Insurance / Fees (₹)
                </label>
                <input
                  type="number"
                  step="500"
                  value={insurance}
                  onChange={(e) => setInsurance(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#ebeae8] text-[14px] font-semibold text-[#171717] bg-white focus:border-[#171717] outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#171717] hover:bg-[#333333] text-white text-[13px] font-bold cursor-pointer transition-all"
              >
                Recalculate Reality Check
              </button>
            </div>
          </form>
        </div>

        {/* Bento Results Display (Strict clean palette matching landing page) */}
        {evaluation && (
          <>
            {/* Bento Block 2: Verdict */}
            <div className="md:col-span-6 p-6 rounded-2xl bg-[#f7f6f4] border border-[#ebeae8] flex flex-col justify-between">
              <div>
                <span className="text-[11px] uppercase font-bold tracking-wider text-[#5d5b59] block mb-1">
                  Quote Verdict
                </span>
                <span className="text-2xl sm:text-3xl font-bold text-[#171717] tracking-tight block">
                  {evaluation.verdict.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="pt-4 border-t border-[#ebeae8] mt-4 flex items-center justify-between text-xs text-[#5d5b59] font-medium">
                <span>Fair Band: {evaluation.fairRateRange[0]}% – {evaluation.fairRateRange[1]}%</span>
                <span>{evaluation.rateVarianceBps > 0 ? `+${evaluation.rateVarianceBps} bps` : `${evaluation.rateVarianceBps} bps`} vs Midpoint</span>
              </div>
            </div>

            {/* Bento Block 3: True All-In APR */}
            <div className="md:col-span-6 p-6 rounded-2xl bg-[#f7f6f4] border border-[#ebeae8] flex flex-col justify-between">
              <div>
                <span className="text-[11px] uppercase font-bold tracking-wider text-[#5d5b59] block mb-1">
                  True All-In APR
                </span>
                <span className="text-2xl sm:text-3xl font-bold text-[#171717] tracking-tight block">
                  {evaluation.effectiveAllInAPR}%
                </span>
              </div>
              <div className="pt-4 border-t border-[#ebeae8] mt-4 flex items-center justify-between text-xs text-[#5d5b59]">
                <span>Quoted Headline: {evaluation.quotedRate}%</span>
                <span className="font-semibold text-[#171717]">
                  +{((evaluation.effectiveAllInAPR - evaluation.quotedRate)).toFixed(2)}% fee load
                </span>
              </div>
            </div>

            {/* Bento Block 4: Monthly Payment Impact */}
            <div className="md:col-span-6 p-6 rounded-2xl bg-[#f7f6f4] border border-[#ebeae8]">
              <span className="text-[11px] uppercase font-bold tracking-wider text-[#5d5b59] block mb-1">
                Quoted Monthly Commitment
              </span>
              <span className="text-2xl font-bold text-[#171717] block">
                {formatINR(evaluation.quotedMonthlyEMI)} / month
              </span>
              <div className="pt-3 mt-3 border-t border-[#ebeae8] flex items-center justify-between text-xs text-[#5d5b59]">
                <span>Safe Monthly Ceiling:</span>
                <span className="font-semibold text-[#171717]">{formatINR(evaluation.safeMaxEMI)} / month</span>
              </div>
            </div>

            {/* Bento Block 5: Total Outflow */}
            <div className="md:col-span-6 p-6 rounded-2xl bg-[#f7f6f4] border border-[#ebeae8]">
              <span className="text-[11px] uppercase font-bold tracking-wider text-[#5d5b59] block mb-1">
                Total Outflow Over Tenure
              </span>
              <span className="text-2xl font-bold text-[#171717] block">
                {formatINR(evaluation.totalCostOfCredit)}
              </span>
              <div className="pt-3 mt-3 border-t border-[#ebeae8] flex items-center justify-between text-xs text-[#5d5b59]">
                <span>Principal: {formatINR(loanAmount)}</span>
                <span>Interest + Fees: {formatINR(evaluation.totalCostOfCredit - loanAmount)}</span>
              </div>
            </div>

            {/* Bento Block 6: Counter-Offer Script */}
            {evaluation.counterOfferAdvice.length > 0 && (
              <div className="md:col-span-12 p-6 rounded-2xl bg-[#f7f6f4] border border-[#ebeae8] space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#5d5b59] block">
                  Counter-Offer Strategy
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {evaluation.counterOfferAdvice.map((advice, i) => (
                    <div 
                      key={i} 
                      className="p-4 rounded-xl bg-white border border-[#ebeae8] text-xs text-[#171717] leading-relaxed font-medium"
                    >
                      {advice}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

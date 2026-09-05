'use client';

import React, { useState } from 'react';
import { Assessment, LenderQuoteInput, LenderQuoteEvaluation } from '@/lib/types';
import { evaluateLenderQuote } from '@/lib/rules/index';
import { CalculatorIcon, AlertCircleIcon, CheckmarkCircle01Icon } from '@/components/icons';

interface QuoteCheckerProps {
  assessment: Assessment;
}

export function QuoteChecker({ assessment }: QuoteCheckerProps) {
  const [loanAmount, setLoanAmount] = useState<number>(assessment.borrowerSafeRange[1] || 500000);
  const [quotedRate, setQuotedRate] = useState<number>(14.5);
  const [feePercent, setFeePercent] = useState<number>(2.0);
  const [insurance, setInsurance] = useState<number>(5000);
  const [tenureMonths, setTenureMonths] = useState<number>(48);
  const [evaluation, setEvaluation] = useState<LenderQuoteEvaluation | null>(null);

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
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ebeae8] shadow-sm space-y-6">
      <div className="flex items-center gap-2.5 border-b border-[#ebeae8] pb-4">
        <div className="w-9 h-9 rounded-full bg-[#e5e9ff] text-[#5769e7] flex items-center justify-center">
          <CalculatorIcon className="w-5 h-5" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-[#171717] tracking-tight">
            Bank Quote Reality Check
          </h3>
          <p className="text-xs text-[#5d5b59]">
            Compare an actual quote received from a sales rep against your fair rate and safe EMI.
          </p>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleEvaluate} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-[12px] font-semibold text-[#171717] block mb-1">
            Quoted Principal (₹)
          </label>
          <input
            type="number"
            step="25000"
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#ebeae8] text-sm font-semibold text-[#171717] bg-[#fcfbf9] focus:border-[#5769e7] outline-none"
          />
        </div>

        <div>
          <label className="text-[12px] font-semibold text-[#171717] block mb-1">
            Quoted Interest Rate (%)
          </label>
          <input
            type="number"
            step="0.25"
            value={quotedRate}
            onChange={(e) => setQuotedRate(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#ebeae8] text-sm font-semibold text-[#171717] bg-[#fcfbf9] focus:border-[#5769e7] outline-none"
          />
        </div>

        <div>
          <label className="text-[12px] font-semibold text-[#171717] block mb-1">
            Tenure (Months)
          </label>
          <select
            value={tenureMonths}
            onChange={(e) => setTenureMonths(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#ebeae8] text-sm font-semibold text-[#171717] bg-[#fcfbf9] focus:border-[#5769e7] outline-none"
          >
            <option value={24}>24 Months (2 Years)</option>
            <option value={36}>36 Months (3 Years)</option>
            <option value={48}>48 Months (4 Years)</option>
            <option value={60}>60 Months (5 Years)</option>
          </select>
        </div>

        <div>
          <label className="text-[12px] font-semibold text-[#171717] block mb-1">
            Processing Fee (%)
          </label>
          <input
            type="number"
            step="0.25"
            value={feePercent}
            onChange={(e) => setFeePercent(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#ebeae8] text-sm font-semibold text-[#171717] bg-[#fcfbf9] focus:border-[#5769e7] outline-none"
          />
        </div>

        <div>
          <label className="text-[12px] font-semibold text-[#171717] block mb-1">
            Insurance / Other Fees (₹)
          </label>
          <input
            type="number"
            step="500"
            value={insurance}
            onChange={(e) => setInsurance(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#ebeae8] text-sm font-semibold text-[#171717] bg-[#fcfbf9] focus:border-[#5769e7] outline-none"
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-[#5769e7] hover:bg-[#4958be] text-white text-xs sm:text-sm font-bold shadow-xs cursor-pointer transition-all"
          >
            Check Quote
          </button>
        </div>
      </form>

      {/* Evaluation Results */}
      {evaluation && (
        <div className="pt-4 border-t border-[#ebeae8] space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#fcfbf9] border border-[#ebeae8]">
            <div>
              <span className="text-xs text-[#747371] block">Quote Verdict</span>
              <span className={`text-base font-black ${
                evaluation.verdict === 'FAIR' ? 'text-emerald-700' : 'text-amber-800'
              }`}>
                {evaluation.verdict.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="text-right">
              <span className="text-xs text-[#747371] block">Estimated All-In APR</span>
              <span className="font-display text-[24px] font-normal leading-[0.9] tracking-[-0.02em] text-[#171717]">
                {evaluation.effectiveAllInAPR}%
              </span>
            </div>
          </div>

          {evaluation.isEMIExceeded && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-xs text-rose-900 flex items-start gap-2">
              <AlertCircleIcon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                <strong>Warning:</strong> Quoted monthly EMI ({formatINR(evaluation.quotedMonthlyEMI)}/mo) exceeds your safe ceiling ({formatINR(evaluation.safeMaxEMI)}/mo) by {formatINR(evaluation.quotedMonthlyEMI - evaluation.safeMaxEMI)}/mo.
              </span>
            </div>
          )}

          {/* Counter-Offer Advice */}
          {evaluation.counterOfferAdvice.length > 0 && (
            <div className="space-y-2">
              <span className="text-[12px] font-semibold text-[#171717] block">What to tell the lender:</span>
              <div className="space-y-1.5">
                {evaluation.counterOfferAdvice.map((advice, i) => (
                  <p key={i} className="text-xs text-[#5d5b59] bg-[#fcfbf9] p-2.5 rounded-xl border border-[#ebeae8]">
                    💬 {advice}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

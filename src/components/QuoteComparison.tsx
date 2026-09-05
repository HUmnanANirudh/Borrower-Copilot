'use client';

import React, { useState } from 'react';
import { Assessment, LenderQuoteInput, LenderQuoteEvaluation } from '@/lib/types';
import { evaluateLenderQuote } from '@/lib/rules/index';
import { 
  CalculatorIcon, 
  AlertCircleIcon, 
  CheckmarkCircle01Icon, 
  ArrowRight01Icon, 
  CoinsSwapIcon 
} from './icons';

interface QuoteComparisonModalProps {
  assessment: Assessment;
  onClose?: () => void;
}

export function QuoteComparisonSection({ assessment }: QuoteComparisonModalProps) {
  const [loanAmount, setLoanAmount] = useState<number>(800000);
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
    <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-[#dedcd9] menti-card-shadow mt-8">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-full bg-[#e5e9ff] text-[#5769e7] flex items-center justify-center">
          <CalculatorIcon className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-[#171717] tracking-tight">
            Bank Quote Reality Check
          </h3>
          <p className="text-xs text-[#5d5b59]">
            Did a bank agent already quote you a loan? Enter their pitch below to unmask their true APR and markup.
          </p>
        </div>
      </div>

      <form onSubmit={handleEvaluate} className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <div>
          <label className="text-xs font-bold text-[#171717] block mb-1.5">
            Quoted Principal (₹)
          </label>
          <input
            type="number"
            step="25000"
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#dedcd9] text-sm font-semibold text-[#171717] bg-[#fcfbf9] focus:border-[#5769e7] outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-[#171717] block mb-1.5">
            Quoted Interest Rate (%)
          </label>
          <input
            type="number"
            step="0.25"
            value={quotedRate}
            onChange={(e) => setQuotedRate(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#dedcd9] text-sm font-semibold text-[#171717] bg-[#fcfbf9] focus:border-[#5769e7] outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-[#171717] block mb-1.5">
            Tenure (Months)
          </label>
          <select
            value={tenureMonths}
            onChange={(e) => setTenureMonths(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#dedcd9] text-sm font-semibold text-[#171717] bg-[#fcfbf9] focus:border-[#5769e7] outline-none"
          >
            <option value={24}>24 Months (2 Years)</option>
            <option value={36}>36 Months (3 Years)</option>
            <option value={48}>48 Months (4 Years)</option>
            <option value={60}>60 Months (5 Years)</option>
            <option value={84}>84 Months (7 Years - LAP)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-[#171717] block mb-1.5">
            Processing Fee (%)
          </label>
          <input
            type="number"
            step="0.25"
            value={feePercent}
            onChange={(e) => setFeePercent(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#dedcd9] text-sm font-semibold text-[#171717] bg-[#fcfbf9] focus:border-[#5769e7] outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-[#171717] block mb-1.5">
            Insurance / Documentation (₹)
          </label>
          <input
            type="number"
            step="1000"
            value={insurance}
            onChange={(e) => setInsurance(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#dedcd9] text-sm font-semibold text-[#171717] bg-[#fcfbf9] focus:border-[#5769e7] outline-none"
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-[#5769e7] hover:bg-[#4958be] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Analyze Bank Quote</span>
            <ArrowRight01Icon className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Evaluation Results Card */}
      {evaluation && (
        <div className="mt-6 p-5 rounded-2xl bg-[#fcfbf9] border border-[#dedcd9] space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border ${
                evaluation.verdict === 'FAIR'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : evaluation.verdict === 'SLIGHTLY_HIGH'
                  ? 'bg-amber-50 text-amber-700 border-amber-300'
                  : 'bg-rose-50 text-rose-700 border-rose-300'
              }`}>
                Quote Verdict: {evaluation.verdict.replace(/_/g, ' ')}
              </span>
              <span className="text-xs font-bold text-[#5d5b59]">
                ({evaluation.rateVarianceBps > 0 ? `+${evaluation.rateVarianceBps} bps markup` : 'Fairly priced'})
              </span>
            </div>

            <div className="text-right">
              <span className="text-xs text-[#5d5b59] block font-medium">True All-In Effective APR</span>
              <span className="text-lg font-extrabold text-[#171717]">{evaluation.effectiveAllInAPR}%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-white p-3 rounded-xl border border-[#dedcd9]">
              <span className="text-[#5d5b59] block">Quoted Monthly EMI</span>
              <span className={`text-sm font-bold ${evaluation.isEMIExceeded ? 'text-rose-600' : 'text-[#171717]'}`}>
                {formatINR(evaluation.quotedMonthlyEMI)}
              </span>
              {evaluation.isEMIExceeded && (
                <span className="text-[10px] text-rose-600 font-semibold block mt-0.5">Exceeds safe ceiling!</span>
              )}
            </div>

            <div className="bg-white p-3 rounded-xl border border-[#dedcd9]">
              <span className="text-[#5d5b59] block">Your Safe EMI Ceiling</span>
              <span className="text-sm font-bold text-emerald-700">{formatINR(evaluation.safeMaxEMI)}</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-[#dedcd9]">
              <span className="text-[#5d5b59] block">Your Fair Rate Band</span>
              <span className="text-sm font-bold text-[#171717]">{evaluation.fairRateRange[0]}%–{evaluation.fairRateRange[1]}%</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-[#dedcd9]">
              <span className="text-[#5d5b59] block">Total Cost of Credit</span>
              <span className="text-sm font-bold text-[#171717]">{formatINR(evaluation.totalCostOfCredit)}</span>
            </div>
          </div>

          {/* Actionable Counter Advice */}
          <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200/80 space-y-1.5">
            <h5 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <AlertCircleIcon className="w-4 h-4 text-amber-700" />
              Counter-Offer Script for this Quote:
            </h5>
            <ul className="text-xs text-amber-900/90 space-y-1 pl-5 list-disc">
              {evaluation.counterOfferAdvice.map((adv, i) => (
                <li key={i}>{adv}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

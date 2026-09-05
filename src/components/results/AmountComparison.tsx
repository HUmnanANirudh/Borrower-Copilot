import React from 'react';
import { Assessment, BorrowerProfile } from '@/lib/types';
import { ShieldCheckIcon, InfoCircleIcon } from '@/components/icons';

interface AmountComparisonProps {
  assessment: Assessment;
  profile: BorrowerProfile;
}

export function AmountComparison({ assessment, profile }: AmountComparisonProps) {
  const formatLakhs = (amt: number) => `₹${(amt / 100000).toFixed(1)} Lakhs`;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ebeae8] shadow-sm space-y-6">
      <div>
        <span className="text-xs uppercase font-extrabold tracking-wider text-[#5769e7] block mb-1">
          Loan Sizing Analysis
        </span>
        <h2 className="font-display text-[32px] font-normal leading-[0.9] tracking-[-0.02em] text-[#171717] tracking-tight">
          Safe Carrying Capacity vs. Lender Estimate
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Borrower Safe Carry Limit */}
        <div className="p-6 rounded-2xl bg-emerald-50/80 border-2 border-emerald-300 relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-950">
              What you should carry
            </span>
            <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-emerald-600 text-white shadow-2xs">
              Use this number
            </span>
          </div>

          <span className="font-display text-[40px] font-normal leading-[0.9] tracking-[-0.02em] text-emerald-800 block my-2">
            {formatLakhs(assessment.borrowerSafeRange[0])} – {formatLakhs(assessment.borrowerSafeRange[1])}
          </span>

          <p className="text-xs text-emerald-900 leading-relaxed font-medium">
            Strictly bounded by your uncommitted living cash flow over a safe 36–48 month repayment horizon.
          </p>
        </div>

        {/* What a Lender May Offer */}
        <div className="p-6 rounded-2xl bg-[#f7f6f4] border border-[#ebeae8]">
          <span className="text-xs font-bold uppercase tracking-wider text-[#5d5b59] block mb-2">
            What a lender may offer
          </span>

          <span className="font-display text-[40px] font-normal leading-[0.9] tracking-[-0.02em] text-[#171717] block my-2">
            {formatLakhs(assessment.estimatedLenderRange[0])} – {formatLakhs(assessment.estimatedLenderRange[1])}
          </span>

          <p className="text-xs text-[#747371] leading-relaxed">
            Based on aggressive bank 50%–60% FOIR limits and long 60-month tenures designed to maximize interest margin.
          </p>
        </div>
      </div>

      {/* Why Explanation */}
      <div className="p-4 rounded-2xl bg-[#fcfbf9] border border-[#ebeae8] space-y-1.5">
        <h4 className="text-xs font-bold text-[#171717] flex items-center gap-1.5">
          <ShieldCheckIcon className="w-4 h-4 text-[#5769e7]" aria-hidden="true" />
          Why is your safe range different?
        </h4>
        <p className="text-xs text-[#5d5b59] leading-relaxed">
          {assessment.safeAmountTrace.rationale}
        </p>
      </div>

      {/* Honest Underwriting Disclaimer */}
      <p className="text-[11px] text-[#747371] flex items-start gap-1.5 leading-normal">
        <InfoCircleIcon className="w-3.5 h-3.5 text-[#747371] mt-0.5 shrink-0" aria-hidden="true" />
        <span>
          Based on stated profile, public product constraints, and documented assumptions. Actual lender underwriting may differ.
        </span>
      </p>
    </div>
  );
}

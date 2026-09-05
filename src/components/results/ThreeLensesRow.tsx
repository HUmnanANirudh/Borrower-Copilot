import React from 'react';
import { Assessment } from '@/lib/types';

interface ThreeLensesRowProps {
  assessment: Assessment;
}

export function ThreeLensesRow({ assessment }: ThreeLensesRowProps) {
  const formatLakhs = (amt: number) => `₹${(amt / 100000).toFixed(1)}L`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* 1. Eligibility */}
      <div className="bg-white p-5 rounded-3xl border border-[#ebeae8] shadow-sm text-center space-y-1">
        <span className="text-[10px] uppercase font-bold tracking-wider text-[#747371] block">
          1. Eligibility
        </span>
        <span className={`text-[12px] font-semibold block ${
          assessment.eligibilityStatus === 'ELIGIBLE' ? 'text-emerald-700' : 'text-amber-700'
        }`}>
          {assessment.eligibilityStatus === 'ELIGIBLE' ? 'LIKELY' : assessment.eligibilityStatus}
        </span>
        <span className="font-display text-[28px] font-normal text-[#171717] block leading-[0.9] tracking-[-0.02em]">
          {formatLakhs(assessment.estimatedLenderRange[0])} – {formatLakhs(assessment.estimatedLenderRange[1])}
        </span>
        <span className="text-[12px] text-[#747371] block mt-1">What bank may offer</span>
      </div>

      {/* 2. Affordability */}
      <div className="bg-white p-5 rounded-3xl border border-[#ebeae8] shadow-sm text-center space-y-1 ring-2 ring-emerald-500/20 bg-emerald-50/30">
        <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 block">
          2. Affordability
        </span>
        <span className="text-[12px] font-semibold text-emerald-700 block">
          {assessment.affordabilityStatus === 'AFFORDABLE' ? 'SAFE' : assessment.affordabilityStatus}
        </span>
        <span className="font-display text-[28px] font-normal text-emerald-700 block leading-[0.9] tracking-[-0.02em]">
          {formatLakhs(assessment.borrowerSafeRange[0])} – {formatLakhs(assessment.borrowerSafeRange[1])}
        </span>
        <span className="text-[12px] text-emerald-800 font-medium block mt-1">What you should carry</span>
      </div>

      {/* 3. Pricing */}
      <div className="bg-white p-5 rounded-3xl border border-[#ebeae8] shadow-sm text-center space-y-1">
        <span className="text-[10px] uppercase font-bold tracking-wider text-[#747371] block">
          3. Pricing
        </span>
        <span className="text-[12px] font-semibold text-[#5769e7] block">
          {assessment.pricingStatus}
        </span>
        <span className="font-display text-[28px] font-normal text-[#171717] block leading-[0.9] tracking-[-0.02em]">
          {assessment.fairRateRange[0]}% – {assessment.fairRateRange[1]}%
        </span>
        <span className="text-[12px] text-[#747371] block mt-1">Fair market band</span>
      </div>
    </div>
  );
}

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
      <div className="bg-white p-5 rounded-3xl border border-[#dedcd9] menti-card-shadow text-center space-y-1">
        <span className="text-[10px] uppercase font-bold tracking-wider text-[#747371] block">
          1. Eligibility
        </span>
        <span className={`text-sm font-extrabold block ${
          assessment.eligibilityStatus === 'ELIGIBLE' ? 'text-emerald-700' : 'text-amber-700'
        }`}>
          {assessment.eligibilityStatus === 'ELIGIBLE' ? 'LIKELY' : assessment.eligibilityStatus}
        </span>
        <span className="text-xl font-black text-[#171717] block">
          {formatLakhs(assessment.estimatedLenderRange[0])} – {formatLakhs(assessment.estimatedLenderRange[1])}
        </span>
        <span className="text-[11px] text-[#747371] block">What bank may offer</span>
      </div>

      {/* 2. Affordability */}
      <div className="bg-white p-5 rounded-3xl border border-[#dedcd9] menti-card-shadow text-center space-y-1 ring-2 ring-emerald-500/20">
        <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 block">
          2. Affordability
        </span>
        <span className="text-sm font-extrabold text-emerald-700 block">
          {assessment.affordabilityStatus === 'AFFORDABLE' ? 'SAFE' : assessment.affordabilityStatus}
        </span>
        <span className="text-xl font-black text-emerald-700 block">
          {formatLakhs(assessment.borrowerSafeRange[0])} – {formatLakhs(assessment.borrowerSafeRange[1])}
        </span>
        <span className="text-[11px] text-emerald-800 font-medium block">What you should carry</span>
      </div>

      {/* 3. Pricing */}
      <div className="bg-white p-5 rounded-3xl border border-[#dedcd9] menti-card-shadow text-center space-y-1">
        <span className="text-[10px] uppercase font-bold tracking-wider text-[#747371] block">
          3. Pricing
        </span>
        <span className="text-sm font-extrabold text-[#5769e7] block">
          {assessment.pricingStatus}
        </span>
        <span className="text-xl font-black text-[#171717] block">
          {assessment.fairRateRange[0]}% – {assessment.fairRateRange[1]}%
        </span>
        <span className="text-[11px] text-[#747371] block">Fair market band</span>
      </div>
    </div>
  );
}

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
      <div className="bg-white p-6 rounded-3xl border border-[#ebeae8] shadow-sm flex flex-col justify-between">
        <div>
          <span className="text-[14px] font-semibold text-[#5d5b59] block">
            Eligibility
          </span>
          <span className="text-2xl font-bold text-[#171717] block mt-1">
            {formatLakhs(assessment.estimatedLenderRange[0])} – {formatLakhs(assessment.estimatedLenderRange[1])}
          </span>
        </div>
        <span className="text-[13px] text-[#747371] block mt-3">What banks may offer</span>
      </div>

      {/* 2. Affordability */}
      <div className="bg-[#f0f3ff] p-6 rounded-3xl border border-[#d5daf7] shadow-sm flex flex-col justify-between">
        <div>
          <span className="text-[14px] font-semibold text-[#323c7c] block">
            Affordability
          </span>
          <span className="text-2xl font-bold text-[#323c7c] block mt-1">
            {formatLakhs(assessment.borrowerSafeRange[0])} – {formatLakhs(assessment.borrowerSafeRange[1])}
          </span>
        </div>
        <span className="text-[13px] text-[#323c7c] block mt-3 font-medium">What you can safely carry</span>
      </div>

      {/* 3. Pricing */}
      <div className="bg-white p-6 rounded-3xl border border-[#ebeae8] shadow-sm flex flex-col justify-between">
        <div>
          <span className="text-[14px] font-semibold text-[#5d5b59] block">
            Pricing
          </span>
          <span className="text-2xl font-bold text-[#171717] block mt-1">
            {assessment.fairRateRange[0]}% – {assessment.fairRateRange[1]}%
          </span>
        </div>
        <span className="text-[13px] text-[#747371] block mt-3">Fair market band</span>
      </div>
    </div>
  );
}

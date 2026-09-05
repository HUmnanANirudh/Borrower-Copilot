import React from 'react';
import { Assessment } from '@/lib/types';

interface FairRateAPRCardProps {
  assessment: Assessment;
}

export function FairRateAPRCard({ assessment }: FairRateAPRCardProps) {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ebeae8] shadow-sm space-y-6">
      <div>
        <span className="text-xs uppercase font-extrabold tracking-wider text-[#5769e7] block mb-1">
          Cost of Credit & Truth in Lending
        </span>
        <h2 className="font-display text-[32px] font-normal leading-[0.9] tracking-[-0.02em] text-[#171717] tracking-tight">
          Fair Interest Rate vs. Estimated All-In APR
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        {/* Fair Rate Band */}
        <div className="p-5 rounded-2xl bg-[#e5e9ff]/50 border border-[#5769e7]/40 space-y-1">
          <span className="text-[10px] font-bold uppercase text-[#323c7c] block">
            Fair Rate for Profile
          </span>
          <span className="font-display text-[32px] font-normal leading-[0.9] tracking-[-0.02em] text-[#5769e7] block">
            {assessment.fairRateRange[0]}% – {assessment.fairRateRange[1]}%
          </span>
          <span className="text-[11px] text-[#5d5b59]">Target headline rate</span>
        </div>

        {/* Expected Initial Sales Quote */}
        <div className="p-5 rounded-2xl bg-[#fff4d7]/70 border border-amber-300 space-y-1">
          <span className="text-[10px] font-bold uppercase text-amber-900 block">
            Expected Initial Pitch
          </span>
          <span className="font-display text-[32px] font-normal leading-[0.9] tracking-[-0.02em] text-amber-900 block">
            {assessment.expectedLenderQuoteRange[0]}% – {assessment.expectedLenderQuoteRange[1]}%
          </span>
          <span className="text-[11px] text-amber-800">Before counter-offer</span>
        </div>

        {/* Estimated All-In APR */}
        <div className="p-5 rounded-2xl bg-[#f2f1f0] border border-[#ebeae8] space-y-1">
          <span className="text-[10px] font-bold uppercase text-[#171717] block">
            Estimated All-In APR
          </span>
          <span className="font-display text-[32px] font-normal leading-[0.9] tracking-[-0.02em] text-[#171717] block">
            {assessment.effectiveAPRRange[0]}% – {assessment.effectiveAPRRange[1]}%
          </span>
          <span className="text-[11px] text-[#747371]">Includes 2% fee + 18% GST</span>
        </div>
      </div>

      {/* Fee Assumptions Note */}
      <div className="p-4 rounded-2xl bg-[#fcfbf9] border border-[#ebeae8] text-xs text-[#5d5b59] space-y-1.5">
        <h4 className="font-bold text-[#171717]">Documented Fee Assumptions:</h4>
        <p className="leading-relaxed">
          {assessment.rateTrace.rationale}
        </p>
        <p className="text-[11px] text-[#747371] pt-1">
          ★ Baseline assumption: 2.0% processing fee + 18% statutory GST deducted upfront at disbursement over a 36-month tenure.
        </p>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Assessment, BorrowerProfile } from '@/lib/types';

interface ReasonTraceAccordionProps {
  assessment: Assessment;
  profile: BorrowerProfile;
}

export function ReasonTraceAccordion({ assessment, profile }: ReasonTraceAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formatINR = (amt: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amt);
  };

  const primaryIncome = profile.netMonthlyIncome || 0;
  const coIncome = profile.coApplicantIncome || 0;
  const totalIncome = primaryIncome + coIncome;
  const existingEMI = profile.existingMonthlyEMI || 0;
  const expenses = profile.householdLivingExpenses || 0;
  const buffer10 = Math.round(totalIncome * 0.10);
  const cashFlowCeiling = Math.max(0, totalIncome - expenses - existingEMI - buffer10);
  const foirLimit = Math.round((totalIncome * 0.35) - existingEMI);

  return (
    <div className="w-full bg-white rounded-3xl border border-[#ebeae8] shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 sm:p-8 flex items-center justify-between text-left hover:bg-[#f7f6f4] cursor-pointer transition-colors"
      >
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#5d5b59] block">
            Underwriting Audit
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-[#171717] tracking-tight">
            Deterministic Reason Trace & Binding Rules
          </h3>
          <span className="text-xs text-[#747371] block mt-1">
            Binding constraint: {assessment.safeEMITrace.bindingRule.replace(/_/g, ' ')}
          </span>
        </div>
        <span className="text-xs font-semibold text-[#171717] px-3.5 py-1.5 rounded-full bg-[#f7f6f4] border border-[#ebeae8]">
          {isOpen ? 'Hide Audit' : 'Inspect Audit'}
        </span>
      </button>

      {isOpen && (
        <div className="p-6 sm:p-8 pt-0 border-t border-[#ebeae8] space-y-6">
          <p className="text-xs text-[#5d5b59] leading-relaxed pt-4">
            {assessment.safeEMITrace.rationale}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#f7f6f4] border border-[#ebeae8]">
              <span className="text-[11px] text-[#747371] block">Total Household Income</span>
              <span className="text-base font-bold text-[#171717] block mt-0.5">{formatINR(totalIncome)}</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#f7f6f4] border border-[#ebeae8]">
              <span className="text-[11px] text-[#747371] block">10% Emergency Cushion</span>
              <span className="text-base font-bold text-[#171717] block mt-0.5">{formatINR(buffer10)}</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#f7f6f4] border border-[#ebeae8]">
              <span className="text-[11px] text-[#747371] block">Uncommitted Cash Floor</span>
              <span className="text-base font-bold text-[#171717] block mt-0.5">{formatINR(cashFlowCeiling)}</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#f7f6f4] border border-[#ebeae8]">
              <span className="text-[11px] text-[#747371] block">Safe 35% FOIR Ceiling</span>
              <span className="text-base font-bold text-[#171717] block mt-0.5">{formatINR(foirLimit)}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#f7f6f4] border border-[#ebeae8] text-xs space-y-1">
            <span className="font-bold text-[#171717] block">Underwriting Formula</span>
            <span className="font-mono text-[#5d5b59] block">
              Safe Max EMI = MIN(Uncommitted Cash Flow, 35% FOIR Capacity) = {formatINR(assessment.recommendedMaxEMI)}/month
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

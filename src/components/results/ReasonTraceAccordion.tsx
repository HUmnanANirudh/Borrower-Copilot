'use client';

import React, { useState } from 'react';
import { Assessment, BorrowerProfile } from '@/lib/types';
import { ShieldCheckIcon } from '@/components/icons';

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
    <div className="bg-white rounded-3xl border border-[#ebeae8] shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 sm:p-7 flex items-center justify-between text-left hover:bg-[#fcfbf9] cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <ShieldCheckIcon className="w-5 h-5 text-[#5769e7]" aria-hidden="true" />
          <div>
            <h3 className="text-lg font-bold text-[#171717] tracking-tight">
              How we reached this (Deterministic Reason Trace)
            </h3>
            <p className="text-xs text-[#747371] mt-0.5">
              Binding rule: <span className="font-semibold text-[#171717]">{assessment.safeEMITrace.bindingRule.replace(/_/g, ' ')}</span>
            </p>
          </div>
        </div>
        <span className="text-xs font-bold text-[#5769e7] px-3 py-1 rounded-full bg-[#e5e9ff]">
          {isOpen ? 'Hide calculation' : 'View calculation'}
        </span>
      </button>

      {isOpen && (
        <div className="p-6 sm:p-7 pt-0 border-t border-[#ebeae8] space-y-5 bg-[#fcfbf9]">
          <p className="text-xs text-[#5d5b59] font-medium leading-relaxed italic">
            {assessment.safeEMITrace.rationale}
          </p>

          {/* Mathematical Trace Chain Table */}
          <div className="bg-white rounded-2xl border border-[#ebeae8] divide-y divide-[#ebeae8] text-xs">
            <div className="p-3 flex justify-between">
              <span className="text-[#5d5b59]">Total Household Net Income</span>
              <span className="font-bold text-[#171717]">{formatINR(totalIncome)}/mo</span>
            </div>
            <div className="p-3 flex justify-between">
              <span className="text-[#5d5b59]">Existing Ongoing EMIs</span>
              <span className="font-bold text-[#171717]">- {formatINR(existingEMI)}</span>
            </div>
            <div className="p-3 flex justify-between">
              <span className="text-[#5d5b59]">Essential Household Living Expenses</span>
              <span className="font-bold text-[#171717]">- {formatINR(expenses)}</span>
            </div>
            <div className="p-3 flex justify-between">
              <span className="text-[#5d5b59]">Untouchable 10% Emergency Reserve Buffer</span>
              <span className="font-bold text-amber-700">- {formatINR(buffer10)}</span>
            </div>
            <div className="p-3 flex justify-between bg-[#f7f6f4]">
              <span className="font-bold text-[#171717]">Uncommitted Cash-Flow Ceiling (Lock 1)</span>
              <span className="font-extrabold text-[#171717]">{formatINR(cashFlowCeiling)}</span>
            </div>
            <div className="p-3 flex justify-between bg-[#f7f6f4]">
              <span className="font-bold text-[#171717]">Safe 35% FOIR Debt Room (Lock 2)</span>
              <span className="font-extrabold text-[#171717]">{formatINR(foirLimit)}</span>
            </div>
            <div className="p-3.5 flex justify-between bg-[#e5e9ff]/50">
              <span className="font-black text-[#323c7c]">Final Recommended Safe EMI Ceiling (min of Lock 1 & 2)</span>
              <span className="font-black text-[#5769e7] text-sm">{formatINR(assessment.recommendedMaxEMI)}/mo</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#747371] uppercase tracking-wider block">
              Drivers considered in this run:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {assessment.safeEMITrace.drivers.map((driver, i) => (
                <span key={i} className="text-[10px] px-2.5 py-1 rounded-full bg-white border border-[#ebeae8] text-[#171717]">
                  {driver}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

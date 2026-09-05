import React from 'react';
import { Assessment } from '@/lib/types';
import { CoinsSwapIcon } from '@/components/icons';

interface StressTestCardProps {
  assessment: Assessment;
}

export function StressTestCard({ assessment }: StressTestCardProps) {
  const { stressScenario } = assessment;

  const getStatusBadge = () => {
    switch (stressScenario.consequenceStatus) {
      case 'Still manageable':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Uncomfortable':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Unsafe':
      default:
        return 'bg-rose-100 text-rose-900 border-rose-300';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ebeae8] shadow-sm space-y-5">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
          <CoinsSwapIcon className="w-4 h-4" aria-hidden="true" />
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800 block">
            Resilience Simulation
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-[#171717] tracking-tight">
            What happens if things go wrong?
          </h3>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="p-4 rounded-2xl bg-[#fcfbf9] border border-[#ebeae8]">
          <span className="text-[10px] font-bold uppercase text-[#747371] block">
            Normal Situation
          </span>
          <span className="text-lg font-black text-[#171717] block mt-1">
            {stressScenario.originalFOIR}% of income
          </span>
          <span className="text-[11px] text-[#5d5b59]">
            Dedicated to debt repayments
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
          <span className="text-[10px] font-bold uppercase text-amber-900 block">
            After {stressScenario.incomeStressPercent}% Income Drop
          </span>
          <span className="text-lg font-black text-amber-950 block mt-1">
            {stressScenario.originalFOIR}% → {stressScenario.stressedFOIR}%
          </span>
          <span className="text-[11px] text-amber-900">
            Increased debt burden
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#f2f1f0] border border-[#ebeae8] flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase text-[#5d5b59] block">
            Consequence Status
          </span>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-black border mt-1 text-center ${getStatusBadge()}`}>
            {stressScenario.consequenceStatus}
          </span>
          <span className="text-[10px] text-[#747371] mt-1 text-center">
            {stressScenario.isBreached ? 'Breaches 50% crisis limit' : 'Within survival buffer'}
          </span>
        </div>
      </div>

      <p className="text-xs text-[#5d5b59] bg-[#fcfbf9] p-4 rounded-2xl border border-[#ebeae8] leading-relaxed">
        {stressScenario.explanation}
      </p>
    </div>
  );
}

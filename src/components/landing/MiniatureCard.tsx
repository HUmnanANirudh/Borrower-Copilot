import React from 'react';
import { ShieldCheckIcon, CheckmarkCircle01Icon, ArrowRight01Icon } from '@/components/icons';

export function MiniatureCard() {
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl p-6 sm:p-7 border-2 border-[#171717] menti-card-shadow text-left transition-all hover:translate-y-[-2px] duration-300">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-[#dedcd9] pb-4 mb-4">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-[#5769e7]">
            <ShieldCheckIcon className="w-3.5 h-3.5 text-[#5769e7]" aria-hidden="true" />
            <span>Borrower Copilot</span>
          </div>
          <h4 className="text-base font-black text-[#171717] tracking-tight uppercase mt-0.5">
            Borrower Negotiation Card
          </h4>
          <span className="text-[11px] text-[#747371]">Self-reported borrower assessment</span>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-50 text-amber-900 border border-amber-300">
          BORROW LESS
        </span>
      </div>

      {/* Primary Figures Grid */}
      <div className="space-y-3">
        <div className="flex items-baseline justify-between p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
          <div>
            <span className="text-[11px] font-extrabold text-emerald-950 uppercase block">What you should carry</span>
            <span className="text-xs text-emerald-800">Your cash-flow safe ceiling</span>
          </div>
          <span className="text-lg font-black text-emerald-700">₹6.5L – ₹7.5L</span>
        </div>

        <div className="flex items-baseline justify-between p-2.5 rounded-xl bg-[#f7f6f4] border border-[#dedcd9]">
          <div>
            <span className="text-[11px] font-bold text-[#5d5b59] uppercase block">What a lender may offer</span>
            <span className="text-xs text-[#747371]">Aggressive 55% bank FOIR</span>
          </div>
          <span className="text-base font-extrabold text-[#171717]">₹8.0L – ₹10.0L</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <div className="p-2.5 rounded-xl bg-[#e5e9ff]/50 border border-[#5769e7]/40">
            <span className="text-[10px] font-bold uppercase text-[#323c7c] block">Fair Rate Band</span>
            <span className="text-base font-extrabold text-[#5769e7] block mt-0.5">11.0% – 12.5%</span>
            <span className="text-[10px] text-[#5d5b59]">All-in APR: ~13.4%</span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#f2f1f0] border border-[#dedcd9]">
            <span className="text-[10px] font-bold uppercase text-[#5d5b59] block">Safe EMI Ceiling</span>
            <span className="text-base font-extrabold text-[#171717] block mt-0.5">₹22,000 / mo</span>
            <span className="text-[10px] text-emerald-700 font-semibold">10% buffer retained</span>
          </div>
        </div>
      </div>

      {/* Confidence & Action Footer */}
      <div className="mt-5 pt-3.5 border-t border-[#dedcd9] flex items-center justify-between">
        <div className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-800">
          <CheckmarkCircle01Icon className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
          <span>High Confidence · 12 data points</span>
        </div>
        <div className="text-[11px] font-bold text-[#5769e7] inline-flex items-center gap-1">
          <span>Official card format</span>
          <ArrowRight01Icon className="w-3 h-3" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

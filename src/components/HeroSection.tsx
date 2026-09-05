'use client';

import React from 'react';
import { ArrowRight01Icon, CheckmarkCircle01Icon, SecurityCheckIcon, CoinsSwapIcon } from '@hugeicons/react';

interface HeroSectionProps {
  onStartQuiz: () => void;
}

export function HeroSection({ onStartQuiz }: HeroSectionProps) {
  return (
    <section aria-labelledby="hero-title" className="w-full pt-10 pb-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f2f1f0] border border-[#dedcd9] text-xs font-semibold text-[#171717] shadow-2xs">
          <SecurityCheckIcon className="w-4 h-4 text-[#5769e7]" aria-hidden="true" />
          <span>Independent Borrower Protection Engine</span>
        </div>

        {/* Poster Editorial Headline */}
        <h1 id="hero-title" className="text-4xl sm:text-6xl font-extrabold text-[#171717] tracking-tight leading-[1.05] sm:leading-[1.02]">
          Know what to say before the bank quotes your loan.
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-[#5d5b59] max-w-2xl mx-auto leading-relaxed font-normal">
          Banks quote what makes them maximum profit. We calculate your true safe limit, unmask hidden processing fees into all-in APR, and hand you a shareable negotiation card.
        </p>

        {/* CTA Pills */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            type="button"
            onClick={onStartQuiz}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#5769e7] hover:bg-[#4958be] text-white text-base font-semibold shadow-md transition-all cursor-pointer transform active:scale-98 focus:outline-hidden focus-visible:ring-4 focus-visible:ring-[#5769e7]/30"
          >
            <span>Start Safe Affordability Quiz</span>
            <ArrowRight01Icon className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Key Guarantees */}
        <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          <div className="bg-white/80 p-4 rounded-2xl border border-[#dedcd9]/60 menti-card-shadow">
            <div className="w-8 h-8 rounded-full bg-[#e5e9ff] text-[#5769e7] flex items-center justify-center mb-2.5">
              <CheckmarkCircle01Icon className="w-4 h-4" aria-hidden="true" />
            </div>
            <h2 className="text-sm font-bold text-[#171717]">Lender vs Safe Sanction</h2>
            <p className="text-xs text-[#5d5b59] mt-1">Contrasts aggressive bank eligibility (50% FOIR) against your actual cash safety ceiling.</p>
          </div>

          <div className="bg-white/80 p-4 rounded-2xl border border-[#dedcd9]/60 menti-card-shadow">
            <div className="w-8 h-8 rounded-full bg-[#e4f4e7] text-[#52ad6e] flex items-center justify-center mb-2.5">
              <CoinsSwapIcon className="w-4 h-4" aria-hidden="true" />
            </div>
            <h2 className="text-sm font-bold text-[#171717]">True All-In APR</h2>
            <p className="text-xs text-[#5d5b59] mt-1">Calculates processing fees, 18% GST, and hidden loan charges into true effective annualized cost.</p>
          </div>

          <div className="bg-white/80 p-4 rounded-2xl border border-[#dedcd9]/60 menti-card-shadow">
            <div className="w-8 h-8 rounded-full bg-[#fff4d7] text-[#b28615] flex items-center justify-center mb-2.5">
              <SecurityCheckIcon className="w-4 h-4" aria-hidden="true" />
            </div>
            <h2 className="text-sm font-bold text-[#171717]">100% Stateless & Private</h2>
            <p className="text-xs text-[#5d5b59] mt-1">No phone numbers, no CIBIL bureau pull, zero databases. Cards are shared via encrypted URL hashes.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

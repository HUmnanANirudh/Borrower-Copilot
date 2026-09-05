import React from 'react';
import Link from 'next/link';
import { ArrowRight01Icon } from '@/components/icons';

export function FinalCTA() {
  return (
    <section className="w-full py-24 lg:py-32 px-6 lg:px-16 bg-[#5769e7] text-center">
      <div className="max-w-[1280px] mx-auto space-y-8">
        <h2 className="font-display text-[48px] sm:text-[64px] lg:text-[80px] font-medium text-white tracking-[-0.03em] leading-[0.9]">
          Walk into the lender’s office informed.
        </h2>
        <p className="text-[18px] sm:text-[22px] text-[#e5e9ff] max-w-2xl mx-auto leading-[1.5]">
          Get your cash-flow safe borrowing ceiling, fair interest rate band, and a one-page defense card before negotiating your loan.
        </p>
        <div className="pt-6">
          <Link
            href="/assess"
            className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-full bg-white hover:bg-[#f7f6f4] active:bg-[#ebeae8] text-[#101010] text-[18px] font-semibold transition-colors cursor-pointer"
          >
            <span>Start my assessment</span>
            <ArrowRight01Icon className="w-6 h-6" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

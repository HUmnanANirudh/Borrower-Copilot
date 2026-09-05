import React from 'react';
import Link from 'next/link';
import { ArrowRight01Icon } from '@/components/icons';

export function FinalCTA() {
  return (
    <section className="w-full bg-[#5769e7]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16 py-20 lg:py-28 text-center">
        <h2 className="font-display text-[48px] sm:text-[64px] lg:text-[88px] font-normal text-white leading-[0.85] tracking-normal max-w-[900px] mx-auto">
          Walk into the lender&apos;s office informed.
        </h2>
        <p className="text-[16px] sm:text-[18px] text-[#d5daf7] max-w-[520px] mx-auto leading-[1.55] mt-6">
          Get your cash-flow safe borrowing ceiling, fair interest rate band, and a one-page defense card before negotiating your loan.
        </p>
        <div className="mt-8">
          <Link
            href="/assess"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white hover:bg-[#f7f6f4] active:bg-[#ebeae8] text-[#171717] text-[16px] font-semibold transition-colors"
          >
            Start my assessment
            <ArrowRight01Icon className="w-5 h-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import Link from 'next/link';
import { ArrowRight01Icon } from '@/components/icons';

export function FinalCTA() {
  return (
    <section className="w-full py-24 px-4 sm:px-6 bg-[#f3ede7] text-center">
      <div className="max-w-3xl mx-auto space-y-6">
        <h2 className="text-3xl sm:text-5xl font-black text-[#171717] tracking-tight leading-tight">
          Walk into the lender’s office informed.
        </h2>
        <p className="text-base sm:text-lg text-[#5d5b59] max-w-xl mx-auto">
          Get your cash-flow safe borrowing ceiling, fair interest rate band, and a one-page defense card before negotiating your loan.
        </p>
        <div className="pt-2">
          <Link
            href="/assess"
            className="inline-flex items-center justify-center gap-2 px-9 py-4 rounded-full bg-[#5769e7] hover:bg-[#4958be] text-white text-base font-extrabold shadow-md transition-all cursor-pointer transform active:scale-98"
          >
            <span>Start my assessment</span>
            <ArrowRight01Icon className="w-5 h-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

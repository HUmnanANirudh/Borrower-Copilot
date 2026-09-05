import React from 'react';
import Link from 'next/link';
import { ArrowRight01Icon } from '@/components/icons';

export function FinalCTA() {
  return (
    <section className="w-full bg-[#5769e7]">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-16 py-16 lg:py-24 text-center">
        <h2 className="font-display text-[40px] sm:text-[56px] lg:text-[72px] font-normal text-white leading-[0.9] max-w-[700px] mx-auto">
          Walk in informed.
        </h2>
        <p className="text-[15px] sm:text-[17px] text-[#d5daf7] max-w-[440px] mx-auto leading-[1.5] mt-4">
          Your safe ceiling, fair rate, and defense card — free, in 3 minutes.
        </p>
        <div className="mt-6">
          <Link
            href="/assess"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white hover:bg-[#f7f6f4] text-[#171717] text-[15px] font-semibold transition-colors"
          >
            Start assessment
            <ArrowRight01Icon className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

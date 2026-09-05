import React from 'react';
import Link from 'next/link';
import { ArrowRight01Icon, SecurityCheckIcon } from '@/components/icons';
import { MiniatureCard } from './MiniatureCard';

export function HeroSection() {
  return (
    <section aria-labelledby="hero-title" className="w-full py-20 lg:py-32 px-6 lg:px-16 bg-[#f3ede7]">
      <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-20">
        {/* Left Editorial Copy */}
        <div className="w-full lg:w-7/12 text-center lg:text-left flex flex-col items-center lg:items-start gap-8">
          {/* Tag Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f2f1f0] border border-[#dedcd9] text-sm font-semibold text-[#171717]">
            <SecurityCheckIcon className="w-4 h-4 text-[#5769e7]" aria-hidden="true" />
            <span>Independent Borrower Decision Engine</span>
          </div>

          {/* Mentimeter-Style Large Headline */}
          <h1 
            id="hero-title" 
            className="font-display text-[52px] sm:text-[64px] lg:text-[88px] font-medium text-[#101010] tracking-[-0.03em] leading-[0.9]"
            style={{ fontStretch: '85%' }}
          >
            Know what you should borrow before the lender tells you what you can borrow.
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-[22px] text-[#5d5b59] max-w-xl leading-[1.45] font-normal">
            A private, no-login assessment that estimates your safe borrowing limit, fair interest rate and EMI — then arms you with a defensible card to negotiate with.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full sm:w-auto mt-2">
            <Link
              href="/assess"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-[#5769e7] hover:bg-[#4958be] active:bg-[#3f4ba1] text-white text-base font-semibold transition-colors cursor-pointer"
            >
              <span>Start my assessment</span>
              <ArrowRight01Icon className="w-5 h-5" aria-hidden="true" />
            </Link>

            <Link
              href="#how-it-works"
              className="text-base font-semibold text-[#171717] hover:bg-[#ebeae8] bg-[#f2f1f0] transition-colors py-4 px-7 rounded-full inline-flex items-center justify-center w-full sm:w-auto"
            >
              See how it works ↓
            </Link>
          </div>

          {/* Micro-assurances */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-sm font-medium text-[#747371] mt-2">
            <span className="flex items-center gap-1.5"><span className="text-[#52ad6e]">✓</span> No login required</span>
            <span className="flex items-center gap-1.5"><span className="text-[#52ad6e]">✓</span> Zero credit bureau pull</span>
          </div>
        </div>

        {/* Right Hero Visual: Miniature Card */}
        <div className="w-full lg:w-5/12 flex justify-center">
          <div className="relative w-full max-w-md" style={{ perspective: '1000px' }}>
            {/* We apply Mentimeter's specific shadow classes here */}
            <div className="transform rotate-y-[-5deg] rotate-x-[5deg] menti-card-shadow bg-white rounded-[20px] overflow-hidden border-[8.8px] border-black">
              <MiniatureCard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

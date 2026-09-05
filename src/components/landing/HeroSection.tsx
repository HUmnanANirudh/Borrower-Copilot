import React from 'react';
import Link from 'next/link';
import { ArrowRight01Icon, SecurityCheckIcon } from '@/components/icons';
import { MiniatureCard } from './MiniatureCard';

export function HeroSection() {
  return (
    <section aria-labelledby="hero-title" className="w-full pt-12 pb-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-14">
        {/* Left Editorial Copy */}
        <div className="w-full lg:w-7/12 text-center lg:text-left space-y-6">
          {/* Tag Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f2f1f0] border border-[#dedcd9] text-xs font-semibold text-[#171717] shadow-2xs">
            <SecurityCheckIcon className="w-3.5 h-3.5 text-[#5769e7]" aria-hidden="true" />
            <span>Independent Borrower Decision Engine</span>
          </div>

          {/* Mentimeter-Style Large Headline */}
          <h1 
            id="hero-title" 
            className="text-4xl sm:text-6xl font-black text-[#171717] tracking-tight leading-[1.04] sm:leading-[1.02]"
          >
            Know what you should borrow before the lender tells you what you can borrow.
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-[#5d5b59] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
            A private, no-login assessment that estimates your safe borrowing limit, fair interest rate and EMI — then arms you with a defensible card to negotiate with.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link
              href="/assess"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#5769e7] hover:bg-[#4958be] text-white text-base font-extrabold shadow-md transition-all cursor-pointer transform active:scale-98"
            >
              <span>Start my assessment</span>
              <ArrowRight01Icon className="w-5 h-5" aria-hidden="true" />
            </Link>

            <Link
              href="#how-it-works"
              className="text-sm font-semibold text-[#5d5b59] hover:text-[#171717] transition-colors py-2 px-3"
            >
              See how it works ↓
            </Link>
          </div>

          {/* Micro-assurances */}
          <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-xs font-medium text-[#747371]">
            <span>✓ No login required</span>
            <span>✓ Zero credit bureau pull</span>
            <span>✓ Runs in your browser</span>
          </div>
        </div>

        {/* Right Hero Visual: Miniature Card */}
        <div className="w-full lg:w-5/12 flex justify-center">
          <MiniatureCard />
        </div>
      </div>
    </section>
  );
}

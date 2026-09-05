import React from 'react';
import Link from 'next/link';
import { ArrowRight01Icon } from '@/components/icons';
import { MiniatureCard } from './MiniatureCard';

export function HeroSection() {
  return (
    <section aria-labelledby="hero-title" className="w-full bg-[#f3ede7]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16 pt-12 lg:pt-20 pb-16 lg:pb-28">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-16">

          {/* Left: Copy + CTA */}
          <div className="w-full lg:w-7/12 flex flex-col gap-6 lg:gap-8">
            <h1
              id="hero-title"
              className="font-display text-[48px] sm:text-[64px] lg:text-[88px] font-normal text-[#171717] leading-[0.85] tracking-normal"
            >
              Know what you should borrow before the lender tells you what you can.
            </h1>

            <p className="text-[16px] sm:text-[18px] text-[#5d5b59] max-w-[520px] leading-[1.55]">
              A private, no-login assessment that estimates your safe borrowing limit, fair interest rate and EMI — then arms you with a defensible card to negotiate with.
            </p>

            {/* CTA Buttons — Mentimeter style: large pill primary + secondary pill */}
            <div className="flex flex-col sm:flex-row items-start gap-3 pt-2">
              <Link
                href="/assess"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#5769e7] hover:bg-[#4958be] active:bg-[#3f4ba1] text-white text-[16px] font-semibold transition-colors"
              >
                Start my assessment
                <ArrowRight01Icon className="w-5 h-5" aria-hidden="true" />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-[#f2f1f0] hover:bg-[#ebeae8] text-[#171717] text-[16px] font-semibold transition-colors"
              >
                See how it works
              </Link>
            </div>

            {/* Micro-assurances */}
            <p className="text-[14px] text-[#5d5b59] flex flex-wrap gap-x-4 gap-y-1">
              <span>✓ No login required</span>
              <span>✓ Zero credit bureau pull</span>
              <span>✓ Runs in your browser</span>
            </p>
          </div>

          {/* Right: Hero Visual */}
          <div className="w-full lg:w-5/12 flex justify-center lg:justify-end">
            <div className="w-full max-w-[420px] rounded-[20px] border-[3px] border-black bg-white menti-card-shadow overflow-hidden">
              <MiniatureCard />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

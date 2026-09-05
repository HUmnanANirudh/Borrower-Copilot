import React from 'react';
import Link from 'next/link';
import { ArrowRight01Icon } from '@/components/icons';

function PhoneMockup() {
  return (
    <div className="relative mx-auto border-[#171717] bg-[#171717] border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
      <div className="h-[32px] w-[3px] bg-[#171717] absolute -start-[17px] top-[72px] rounded-s-lg" />
      <div className="h-[46px] w-[3px] bg-[#171717] absolute -start-[17px] top-[124px] rounded-s-lg" />
      <div className="h-[46px] w-[3px] bg-[#171717] absolute -start-[17px] top-[178px] rounded-s-lg" />
      <div className="h-[64px] w-[3px] bg-[#171717] absolute -end-[17px] top-[142px] rounded-e-lg" />
      <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white">
        {/* In-phone UI */}
        <div className="h-full flex flex-col text-[#171717]">
          {/* Status bar */}
          <div className="h-11 bg-white border-b border-[#f0eee9] flex items-end justify-center pb-1">
            <span className="text-[11px] font-semibold text-[#171717] tracking-tight">BorrowIQ</span>
          </div>

          {/* Card preview content */}
          <div className="flex-1 bg-white px-4 pt-3 pb-4 flex flex-col gap-3 overflow-hidden">
            <div className="text-[10px] font-semibold text-[#747371] uppercase tracking-wider">Your Assessment</div>

            {/* Amount card */}
            <div className="bg-[#f7f6f4] rounded-xl p-3.5 border border-[#ebeae8]">
              <div className="text-[10px] text-[#5d5b59] mb-1">Safe borrowing ceiling</div>
              <div className="text-[28px] font-display font-medium text-[#171717] leading-none">₹18.5L</div>
              <div className="text-[10px] text-[#52ad6e] font-medium mt-1 flex items-center gap-1">
                <span>●</span> Within safe FOIR range
              </div>
            </div>

            {/* Rate card */}
            <div className="bg-[#f7f6f4] rounded-xl p-3.5 border border-[#ebeae8]">
              <div className="text-[10px] text-[#5d5b59] mb-1">Fair interest rate</div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[22px] font-display font-medium text-[#171717] leading-none">8.5%</span>
                <span className="text-[10px] text-[#5d5b59]">– 10.2%</span>
              </div>
              <div className="mt-2 h-1.5 bg-[#e5e3de] rounded-full overflow-hidden">
                <div className="h-full w-3/5 bg-[#5769e7] rounded-full" />
              </div>
            </div>

            {/* EMI card */}
            <div className="bg-[#f7f6f4] rounded-xl p-3.5 border border-[#ebeae8]">
              <div className="text-[10px] text-[#5d5b59] mb-1">Estimated EMI</div>
              <div className="text-[22px] font-display font-medium text-[#171717] leading-none">₹22,400<span className="text-[10px] text-[#5d5b59] ml-1">/mo</span></div>
            </div>

            {/* Verdict pill */}
            <div className="flex items-center gap-2 bg-[#f0faf2] border border-[#d2edd7] rounded-full px-3 py-2 mt-auto">
              <div className="w-2 h-2 rounded-full bg-[#52ad6e]" />
              <span className="text-[10px] font-semibold text-[#253e2d]">Safe to proceed · High confidence</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section aria-labelledby="hero-title" className="w-full bg-[#f3ede7]">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-16 pt-10 lg:pt-20 pb-12 lg:pb-24">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">

          {/* Left: Copy */}
          <div className="w-full lg:w-1/2 flex flex-col gap-5 text-center lg:text-left items-center lg:items-start">
            <h1
              id="hero-title"
              className="font-display text-[44px] sm:text-[56px] lg:text-[80px] font-normal text-[#171717] leading-[0.88]"
            >
              Know your loan before the lender prices it.
            </h1>

            <p className="text-[15px] sm:text-[17px] text-[#5d5b59] max-w-[440px] leading-[1.5]">
              Free, private assessment. No login, no credit bureau pull. Get your safe borrowing limit, fair rate, and a negotiation card in 3 minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Link
                href="/assess"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#5769e7] hover:bg-[#4958be] text-white text-[15px] font-semibold transition-colors"
              >
                Start assessment
                <ArrowRight01Icon className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Right: Phone Mockup */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

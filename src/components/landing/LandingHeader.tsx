import React from 'react';
import Link from 'next/link';
import { ShieldCheckIcon, ArrowRight01Icon } from '@/components/icons';

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#f3ede7]/90 border-b border-[#dedcd9]/70 transition-all">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <Link 
          href="/"
          className="flex items-center gap-3 text-left group focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#5769e7] rounded-lg p-1"
          aria-label="Borrower Copilot Home"
        >
          <div className="w-9 h-9 rounded-full bg-[#5769e7] flex items-center justify-center text-white shadow-sm shrink-0 group-hover:scale-105 transition-transform">
            <ShieldCheckIcon className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-[#171717] tracking-tight">Borrower Copilot</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#e5e9ff] text-[#5769e7]">
                India
              </span>
            </div>
            <p className="text-[11px] text-[#5d5b59] hidden sm:block">Know your loan before the lender prices it.</p>
          </div>
        </Link>

        {/* Center / Right Links */}
        <nav className="flex items-center gap-5 sm:gap-7">
          <Link 
            href="#how-it-works"
            className="text-xs font-semibold text-[#5d5b59] hover:text-[#171717] transition-colors hidden md:inline"
          >
            How it works
          </Link>
          <Link 
            href="#methodology"
            className="text-xs font-semibold text-[#5d5b59] hover:text-[#171717] transition-colors hidden md:inline"
          >
            Methodology
          </Link>
          <Link 
            href="#privacy"
            className="text-xs font-semibold text-[#5d5b59] hover:text-[#171717] transition-colors hidden sm:inline"
          >
            Privacy
          </Link>

          {/* Primary CTA */}
          <Link
            href="/assess"
            className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-full bg-[#5769e7] hover:bg-[#4958be] text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer transform active:scale-98"
          >
            <span>Start assessment</span>
            <ArrowRight01Icon className="w-4 h-4" aria-hidden="true" />
          </Link>
        </nav>
      </div>
    </header>
  );
}

import React from 'react';
import Link from 'next/link';
import { ShieldCheckIcon, ArrowRight01Icon } from '@/components/icons';

export function LandingHeader() {
  return (
    <header className="w-full bg-[#f3ede7]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16 h-20 flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <Link 
          href="/"
          className="flex items-center gap-3 text-left group focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#5769e7] rounded-lg p-1"
          aria-label="Borrower Copilot Home"
        >
          <div className="w-10 h-10 rounded-full bg-[#5769e7] flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
            <ShieldCheckIcon className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-medium text-[22px] text-[#101010] tracking-tight">Borrower Copilot</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#e5e9ff] text-[#5769e7]">
                India
              </span>
            </div>
          </div>
        </Link>

        {/* Center / Right Links */}
        <nav className="flex items-center gap-5 sm:gap-7">
          <Link 
            href="#how-it-works"
            className="text-[15px] font-semibold text-[#171717] hover:text-[#5769e7] transition-colors hidden md:inline"
          >
            How it works
          </Link>
          <Link 
            href="#methodology"
            className="text-[15px] font-semibold text-[#171717] hover:text-[#5769e7] transition-colors hidden md:inline"
          >
            Methodology
          </Link>
          <Link 
            href="#privacy"
            className="text-[15px] font-semibold text-[#171717] hover:text-[#5769e7] transition-colors hidden sm:inline"
          >
            Privacy
          </Link>

          {/* Primary CTA */}
          <Link
            href="/assess"
            className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full bg-[#5769e7] hover:bg-[#4958be] active:bg-[#3f4ba1] text-white text-[15px] font-semibold transition-colors cursor-pointer"
          >
            <span>Start assessment</span>
            <ArrowRight01Icon className="w-4 h-4" aria-hidden="true" />
          </Link>
        </nav>
      </div>
    </header>
  );
}

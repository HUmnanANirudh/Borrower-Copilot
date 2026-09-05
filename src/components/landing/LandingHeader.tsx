import React from 'react';
import Link from 'next/link';
import { ShieldCheckIcon, ArrowRight01Icon } from '@/components/icons';

export function LandingHeader() {
  return (
    <header className="w-full bg-transparent">
      <nav className="max-w-[1280px] mx-auto px-6 lg:px-16 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
          aria-label="Borrower Copilot Home"
        >
          <div className="w-8 h-8 rounded-full bg-[#5769e7] flex items-center justify-center text-white shrink-0">
            <ShieldCheckIcon className="w-4 h-4" aria-hidden="true" />
          </div>
          <span className="font-display text-[20px] text-[#171717] tracking-tight">
            Borrower Copilot
          </span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          <Link
            href="#how-it-works"
            className="hidden md:inline-flex items-center px-4 py-2 text-[16px] font-semibold text-[#171717] hover:bg-[#f2f1f0] rounded-lg transition-colors"
          >
            How it works
          </Link>
          <Link
            href="#methodology"
            className="hidden md:inline-flex items-center px-4 py-2 text-[16px] font-semibold text-[#171717] hover:bg-[#f2f1f0] rounded-lg transition-colors"
          >
            Methodology
          </Link>
          <Link
            href="#privacy"
            className="hidden sm:inline-flex items-center px-4 py-2 text-[16px] font-semibold text-[#171717] hover:bg-[#f2f1f0] rounded-lg transition-colors"
          >
            Privacy
          </Link>

          {/* CTA */}
          <Link
            href="/assess"
            className="ml-2 inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#5769e7] hover:bg-[#4958be] active:bg-[#3f4ba1] text-white text-[14px] font-semibold transition-colors"
          >
            Start assessment
            <ArrowRight01Icon className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
      </nav>
    </header>
  );
}

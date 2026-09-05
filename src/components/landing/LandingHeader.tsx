import React from 'react';
import Link from 'next/link';
import { ArrowRight01Icon } from '@/components/icons';

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-[#ebeae8]">
      <nav className="max-w-[1280px] mx-auto px-5 lg:px-16 h-14 flex items-center justify-between">
        <Link href="/" className="font-display text-[20px] text-[#171717] tracking-tight">
          BorrowIQ
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          <Link href="#how-it-works" className="px-3 py-1.5 text-[14px] font-medium text-[#5d5b59] hover:text-[#171717] transition-colors">
            How it works
          </Link>
          <Link href="#methodology" className="px-3 py-1.5 text-[14px] font-medium text-[#5d5b59] hover:text-[#171717] transition-colors">
            Methodology
          </Link>
          <Link href="#privacy" className="px-3 py-1.5 text-[14px] font-medium text-[#5d5b59] hover:text-[#171717] transition-colors">
            Privacy
          </Link>
        </div>

        {/* CTA — always visible */}
        <Link
          href="/assess"
          className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#5769e7] hover:bg-[#4958be] text-white text-[13px] font-semibold transition-colors"
        >
          <span className="hidden sm:inline">Start</span> Assessment
          <ArrowRight01Icon className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </nav>
    </header>
  );
}

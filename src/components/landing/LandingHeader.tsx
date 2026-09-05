import React from 'react';
import Link from 'next/link';
import { ArrowRight01Icon } from '@/components/icons';
import Avatar from 'boring-avatars';

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-[#ebeae8]">
      <nav className="max-w-[1280px] mx-auto px-5 lg:px-16 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-[20px] text-[#171717] tracking-tight">
          <Avatar size={26} name="BorrowIQ" variant="pixel" colors={["#5769e7", "#171717", "#f3ede7", "#52ad6e", "#d5daf7"]} />
          BorrowIQ
        </Link>

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

import React from 'react';
import Link from 'next/link';

export function LandingFooter() {
  return (
    <footer className="w-full bg-[#f3ede7]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16 py-10 flex flex-col md:flex-row items-center justify-between gap-6 text-[14px] text-[#5d5b59]">
        <span className="font-display text-[16px] text-[#171717]">
          Borrower Copilot
        </span>

        <div className="flex items-center gap-6">
          <Link href="#how-it-works" className="hover:text-[#171717] transition-colors">
            How it works
          </Link>
          <Link href="#methodology" className="hover:text-[#171717] transition-colors">
            Methodology
          </Link>
          <Link href="#privacy" className="hover:text-[#171717] transition-colors">
            Privacy
          </Link>
        </div>

        <span>© 2026 Borrower Copilot · Stateless &amp; Private</span>
      </div>
    </footer>
  );
}

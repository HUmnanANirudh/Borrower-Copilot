import React from 'react';
import Link from 'next/link';

export function LandingFooter() {
  return (
    <footer className="w-full py-12 px-6 lg:px-16 bg-[#101010] text-[#c5c3c1] text-[14px]">
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="font-display font-medium text-white text-[18px]">Borrower Copilot</span>
          <span className="mx-3 text-[#5d5b59]">·</span>
          <span>Independent Loan Decision Engine for India</span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="#how-it-works" className="hover:text-white transition-colors">
            How it works
          </Link>
          <Link href="#methodology" className="hover:text-white transition-colors">
            Methodology
          </Link>
          <Link href="#privacy" className="hover:text-white transition-colors">
            Privacy
          </Link>
        </div>

        <div>
          <span>© 2026 Borrower Copilot · Stateless & Private</span>
        </div>
      </div>
    </footer>
  );
}

import React from 'react';
import Link from 'next/link';

export function LandingFooter() {
  return (
    <footer className="w-full py-10 px-4 sm:px-6 bg-[#f3ede7] border-t border-[#dedcd9] text-xs text-[#747371]">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-extrabold text-[#171717]">Borrower Copilot</span>
          <span className="mx-2">·</span>
          <span>Independent Loan Decision Engine for India</span>
        </div>

        <div className="flex items-center gap-5">
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

        <div>
          <span>© 2026 Borrower Copilot · Stateless & Private</span>
        </div>
      </div>
    </footer>
  );
}

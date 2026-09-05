'use client';

import React from 'react';
import { ShieldCheckIcon, RotateLeftIcon } from './icons';

interface HeaderProps {
  onReset?: () => void;
  showReset?: boolean;
}

export function Header({ onReset, showReset }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#f3ede7]/85 border-b border-[#dedcd9]/60 transition-all">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <button 
          type="button"
          onClick={onReset}
          className="flex items-center gap-2.5 text-left cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#5769e7] rounded-lg p-1"
          aria-label="Borrower Copilot Home"
        >
          <div className="w-8 h-8 rounded-full bg-[#5769e7] flex items-center justify-center text-white shadow-sm shrink-0">
            <ShieldCheckIcon className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-base text-[#171717] tracking-tight">Borrower Copilot</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#e5e9ff] text-[#5769e7]">
                India
              </span>
            </div>
            <p className="text-[11px] text-[#5d5b59] hidden sm:block">Deterministic Loan Decision Engine & Negotiation Card</p>
          </div>
        </button>

        <div className="flex items-center gap-3">
          {showReset && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#171717] bg-[#f2f1f0] hover:bg-[#ebeae8] transition-colors cursor-pointer border border-[#dedcd9]/60 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#5769e7]"
            >
              <RotateLeftIcon className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Start Over</span>
            </button>
          )}
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-200/60 hidden md:inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true"></span>
            Zero Bureau Pull
          </span>
        </div>
      </div>
    </header>
  );
}

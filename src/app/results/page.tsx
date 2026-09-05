'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { BorrowerProfile, Assessment } from '@/lib/types';
import { evaluateAssessment } from '@/lib/rules/index';
import { ResultsHero } from '@/components/results/ResultsHero';
import { ThreeLensesRow } from '@/components/results/ThreeLensesRow';
import { AmountComparison } from '@/components/results/AmountComparison';
import { EMITenureTable } from '@/components/results/EMITenureTable';
import { StressTestCard } from '@/components/results/StressTestCard';
import { FairRateAPRCard } from '@/components/results/FairRateAPRCard';
import { ReasonTraceAccordion } from '@/components/results/ReasonTraceAccordion';
import { QuoteChecker } from '@/components/results/QuoteChecker';
import { ShieldCheckIcon, ArrowLeft01Icon, ArrowRight01Icon } from '@/components/icons';

export default function ResultsPage() {
  const [profile, setProfile] = useState<BorrowerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('borrower_profile');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setProfile(parsed);
        } catch {
          setProfile(null);
        }
      }
      setLoading(false);
    }
  }, []);

  const assessment: Assessment | null = useMemo(() => {
    if (!profile) return null;
    return evaluateAssessment(profile);
  }, [profile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3ede7] flex items-center justify-center text-xs text-[#747371]">
        Loading your assessment...
      </div>
    );
  }

  // Graceful fallback if opened directly without an active quiz session
  if (!profile || !assessment) {
    return (
      <div className="min-h-screen bg-[#f3ede7] text-[#171717] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#dedcd9] menti-card-shadow text-center space-y-5">
          <div className="w-12 h-12 rounded-full bg-[#e5e9ff] text-[#5769e7] flex items-center justify-center mx-auto">
            <ShieldCheckIcon className="w-6 h-6" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-black text-[#171717]">
            No Active Assessment Found
          </h1>
          <p className="text-xs text-[#5d5b59] leading-relaxed">
            Your assessment runs locally in your browser. If you refreshed or opened a new tab, please complete the 2-minute quiz to generate your numbers.
          </p>
          <Link
            href="/assess"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-[#5769e7] text-white text-xs sm:text-sm font-extrabold shadow-sm hover:bg-[#4958be] transition-colors"
          >
            <span>Start 2-Minute Assessment</span>
            <ArrowRight01Icon className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f3ede7] text-[#171717] font-sans selection:bg-[#5769e7]/20 selection:text-[#5769e7]">
      {/* Sticky Sub-Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#f3ede7]/90 border-b border-[#dedcd9] transition-all">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5d5b59] hover:text-[#171717]"
          >
            <ArrowLeft01Icon className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Home</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/assess"
              className="text-xs font-semibold text-[#5d5b59] hover:text-[#171717] px-2.5 py-1 rounded-full border border-[#dedcd9] bg-white"
            >
              Edit Answers
            </Link>

            <Link
              href="/card"
              className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-bold bg-[#5769e7] text-white hover:bg-[#4958be] transition-all"
            >
              <span>Negotiation Card</span>
              <ArrowRight01Icon className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Results Body */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 space-y-7">
        <ResultsHero assessment={assessment} profile={profile} />
        <ThreeLensesRow assessment={assessment} />
        <AmountComparison assessment={assessment} profile={profile} />
        <EMITenureTable assessment={assessment} />
        <StressTestCard assessment={assessment} />
        <FairRateAPRCard assessment={assessment} />
        <ReasonTraceAccordion assessment={assessment} profile={profile} />
        <QuoteChecker assessment={assessment} />

        {/* Bottom Card CTA */}
        <div className="py-8 text-center">
          <Link
            href="/card"
            className="inline-flex items-center justify-center gap-2 px-9 py-4 rounded-full bg-[#5769e7] hover:bg-[#4958be] text-white text-base font-extrabold shadow-md transition-all cursor-pointer transform active:scale-98"
          >
            <span>Take Your Negotiation Card Into The Branch</span>
            <ArrowRight01Icon className="w-5 h-5" aria-hidden="true" />
          </Link>
        </div>
      </main>

      {/* Clean Footer */}
      <footer className="w-full py-6 text-center text-xs text-[#747371] border-t border-[#dedcd9]">
        <span>Borrower Copilot · Self-reported borrower assessment</span>
      </footer>
    </div>
  );
}

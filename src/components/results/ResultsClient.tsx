'use client';

import { useEffect, useState, useMemo } from 'react';
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
import Avatar from 'boring-avatars';
import { ShieldCheckIcon, ArrowRight01Icon } from '@/components/icons';

export function ResultsClient() {
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
  if (!profile || !assessment) {
    return (
      <div className="min-h-screen bg-[#f3ede7] text-[#171717] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#ebeae8] shadow-sm text-center space-y-5">
          <div className="w-12 h-12 rounded-full bg-[#f0f3ff] text-[#5769e7] flex items-center justify-center mx-auto">
            <ShieldCheckIcon className="w-6 h-6" aria-hidden="true" />
          </div>
          <h1 className="font-display text-[32px] font-normal text-[#171717]">
            No Active Assessment Found
          </h1>
          <p className="text-[14px] text-[#5d5b59] leading-relaxed">
            Your assessment runs locally in your browser. If you refreshed or opened a new tab, please complete the 2-minute quiz to generate your numbers.
          </p>
          <Link
            href="/assess"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-[#5769e7] text-white text-[15px] font-semibold shadow-sm hover:bg-[#4958be] transition-colors"
          >
            <span>Start 2-Minute Assessment</span>
            <ArrowRight01Icon className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f3ede7] text-[#171717]">
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/95 border-b border-[#ebeae8] transition-all">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-16 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-[20px] text-[#171717] tracking-tight"
          >
            <Avatar size={26} name="BorrowIQ" variant="pixel" colors={["#5769e7", "#171717", "#f3ede7", "#52ad6e", "#d5daf7"]} />
            BorrowIQ
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/assess"
              className="text-[13px] font-semibold text-[#5d5b59] hover:text-[#171717] px-3 py-1.5 rounded-full border border-[#ebeae8] bg-white transition-colors"
            >
              Edit Answers
            </Link>

            <Link
              href="/card"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-[13px] font-semibold bg-[#5769e7] text-white hover:bg-[#4958be] transition-all"
            >
              <span>Negotiation Card</span>
              <ArrowRight01Icon className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-[860px] mx-auto px-4 py-10 lg:py-16 space-y-7">
        <ResultsHero assessment={assessment} profile={profile} />
        <ThreeLensesRow assessment={assessment} />
        <AmountComparison assessment={assessment} profile={profile} />
        <EMITenureTable assessment={assessment} />
        <StressTestCard assessment={assessment} />
        <FairRateAPRCard assessment={assessment} />
        <ReasonTraceAccordion assessment={assessment} profile={profile} />
        <QuoteChecker assessment={assessment} />
        <div className="py-10 text-center">
          <Link
            href="/card"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#5769e7] hover:bg-[#4958be] text-white text-[16px] font-semibold shadow-sm transition-transform active:scale-95"
          >
            <span>Take Your Negotiation Card Into The Branch</span>
            <ArrowRight01Icon className="w-5 h-5" aria-hidden="true" />
          </Link>
        </div>
      </main>
      <footer className="w-full py-8 text-center text-[12px] font-semibold text-[#a09f9d] border-t border-[#ebeae8] uppercase tracking-wider">
        <span>BorrowIQ · Self-reported borrower assessment</span>
      </footer>
    </div>
  );
}

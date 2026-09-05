'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { BorrowerProfile, Assessment } from '@/lib/types';
import { evaluateAssessment } from '@/lib/rules/index';
import { QuoteChecker } from '@/components/results/QuoteChecker';
import Avatar from 'boring-avatars';

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

  const formatLakhs = (amt: number) => `₹${(amt / 100000).toFixed(1)}L`;
  const formatINR = (amt: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amt);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3ede7] flex items-center justify-center text-xs text-[#747371]">
        Loading assessment...
      </div>
    );
  }

  if (!profile || !assessment) {
    return (
      <div className="min-h-screen bg-[#f3ede7] text-[#171717] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#ebeae8] shadow-sm text-center space-y-5">
          <h1 className="text-2xl font-bold text-[#171717]">
            No Assessment Found
          </h1>
          <p className="text-xs text-[#5d5b59] leading-relaxed">
            Assessments run privately in your browser. Complete the assessment to see your numbers.
          </p>
          <Link
            href="/assess"
            className="inline-flex items-center justify-center w-full py-3.5 rounded-full bg-[#5769e7] text-white text-xs font-semibold shadow-sm hover:bg-[#4958be] transition-colors"
          >
            Start Assessment
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f3ede7] text-[#171717]">
      {/* Header — clean navbar without duplicate card button */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/95 border-b border-[#ebeae8] transition-all">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-16 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-[20px] text-[#171717] tracking-tight"
          >
            <Avatar size={26} name="BorrowIQ" variant="pixel" colors={["#5769e7", "#171717", "#f3ede7", "#52ad6e", "#d5daf7"]} />
            BorrowIQ
          </Link>

          <Link
            href="/assess"
            className="text-xs font-semibold text-[#5d5b59] hover:text-[#171717] px-3.5 py-1.5 rounded-full border border-[#ebeae8] bg-white transition-colors"
          >
            Edit Inputs
          </Link>
        </div>
      </header>

      {/* Main Full-Width Bento Grid Container */}
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-5 lg:px-16 py-8 sm:py-10 space-y-6">
        
        {/* Row 1: Hero Verdict Bento */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Verdict Primary Card (Span 8) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-[#ebeae8] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-[#5d5b59] uppercase tracking-wider">
                  Verdict
                </span>
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#f7f6f4] text-[#171717] border border-[#ebeae8]">
                  {assessment.confidence} Confidence
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold text-[#171717] tracking-tight">
                {assessment.verdict}
              </h1>
              <p className="text-sm sm:text-base font-medium text-[#5d5b59] mt-3 leading-relaxed">
                {assessment.verdictReason}
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-[#ebeae8] flex items-center justify-between text-xs">
              <span className="text-[#747371]">Product Route:</span>
              <span className="font-semibold text-[#171717]">{assessment.inferredProductRoute}</span>
            </div>
          </div>

          {/* Action Recommendation Card (Span 4) — THE ONLY PLACE FOR THE CARD BUTTON */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-[#ebeae8] shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#5d5b59] uppercase tracking-wider block mb-2">
                Action Plan
              </span>
              <h2 className="text-lg font-bold text-[#171717] leading-snug">
                {assessment.betterAlternative.title}
              </h2>
              <p className="text-xs text-[#5d5b59] mt-2 leading-relaxed">
                {assessment.betterAlternative.recommendation}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#ebeae8]">
              <Link
                href="/card"
                className="w-full py-3 px-4 rounded-xl bg-[#5769e7] hover:bg-[#4958be] text-white text-xs font-bold text-center block transition-all"
              >
                Open Negotiation Card
              </Link>
            </div>
          </div>
        </div>

        {/* Row 2: Four Core Metric Bento Tiles (4 columns on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Tile 1: Safe Loan Ceiling */}
          <div className="bg-white rounded-3xl p-6 border border-[#ebeae8] shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#5d5b59] uppercase tracking-wider block mb-1">
                Safe Borrowing Limit
              </span>
              <span className="text-2xl font-bold text-[#171717] block">
                {formatLakhs(assessment.borrowerSafeRange[0])} – {formatLakhs(assessment.borrowerSafeRange[1])}
              </span>
            </div>
            <div className="mt-4 p-3 rounded-xl bg-[#f7f6f4] border border-[#ebeae8] text-xs">
              <span className="block text-[#747371] text-[10px] uppercase font-bold">Lender Estimate</span>
              <span className="font-semibold text-[#171717]">{formatLakhs(assessment.estimatedLenderRange[0])} – {formatLakhs(assessment.estimatedLenderRange[1])}</span>
            </div>
          </div>

          {/* Tile 2: Fair Interest Rate */}
          <div className="bg-white rounded-3xl p-6 border border-[#ebeae8] shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#5d5b59] uppercase tracking-wider block mb-1">
                Fair Interest Rate
              </span>
              <span className="text-2xl font-bold text-[#171717] block">
                {assessment.fairRateRange[0]}% – {assessment.fairRateRange[1]}%
              </span>
            </div>
            <div className="mt-4 p-3 rounded-xl bg-[#f7f6f4] border border-[#ebeae8] text-xs">
              <span className="block text-[#747371] text-[10px] uppercase font-bold">All-In APR</span>
              <span className="font-semibold text-[#171717]">{assessment.effectiveAPRRange[0]}% – {assessment.effectiveAPRRange[1]}%</span>
            </div>
          </div>

          {/* Tile 3: Safe Monthly EMI */}
          <div className="bg-white rounded-3xl p-6 border border-[#ebeae8] shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#5d5b59] uppercase tracking-wider block mb-1">
                Safe Monthly EMI
              </span>
              <span className="text-2xl font-bold text-[#171717] block">
                {formatINR(assessment.recommendedMaxEMI)} <span className="text-xs font-normal text-[#747371]">/mo</span>
              </span>
            </div>
            <div className="mt-4 p-3 rounded-xl bg-[#f7f6f4] border border-[#ebeae8] text-xs">
              <span className="block text-[#747371] text-[10px] uppercase font-bold">Constraint Rule</span>
              <span className="font-semibold text-[#171717]">{assessment.safeEMITrace.bindingRule === 'cash_flow_floor' ? 'Cash-Flow Floor' : 'Safe 35% FOIR'}</span>
            </div>
          </div>

          {/* Tile 4: Stress Resilience */}
          <div className="bg-white rounded-3xl p-6 border border-[#ebeae8] shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#5d5b59] uppercase tracking-wider block mb-1">
                20% Income Shock
              </span>
              <span className="text-2xl font-bold text-[#171717] block">
                {assessment.stressScenario.stressedFOIR}% FOIR
              </span>
            </div>
            <div className="mt-4 p-3 rounded-xl bg-[#f7f6f4] border border-[#ebeae8] text-xs">
              <span className="block text-[#747371] text-[10px] uppercase font-bold">Status</span>
              <span className="font-semibold text-[#171717]">{assessment.stressScenario.consequenceStatus}</span>
            </div>
          </div>
        </div>

        {/* Row 3: Bank Quote Reality Check Bento */}
        <QuoteChecker assessment={assessment} />

      </main>
    </div>
  );
}

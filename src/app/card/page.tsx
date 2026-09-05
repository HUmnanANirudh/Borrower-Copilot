'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { BorrowerProfile, Assessment } from '@/lib/types';
import { evaluateAssessment } from '@/lib/rules/index';
import { PrintableCard } from '@/components/card/PrintableCard';
import { ShieldCheckIcon, ArrowRight01Icon } from '@/components/icons';

export default function CardPage() {
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
        Loading your card...
      </div>
    );
  }

  if (!profile || !assessment) {
    return (
      <div className="min-h-screen bg-[#f3ede7] text-[#171717] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#ebeae8] shadow-sm text-center space-y-5">
          <div className="w-12 h-12 rounded-full bg-[#e5e9ff] text-[#5769e7] flex items-center justify-center mx-auto">
            <ShieldCheckIcon className="w-6 h-6" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-black text-[#171717]">
            No Active Card Found
          </h1>
          <p className="text-xs text-[#5d5b59] leading-relaxed">
            Negotiation Cards are generated from your active browser assessment. Please complete the quiz to create your card.
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
    <main className="min-h-screen bg-[#f3ede7] text-[#171717] font-sans selection:bg-[#5769e7]/20 selection:text-[#5769e7]">
      <PrintableCard assessment={assessment} profile={profile} />
    </main>
  );
}

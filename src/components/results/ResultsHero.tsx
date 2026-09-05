import React from 'react';
import Link from 'next/link';
import { Assessment, BorrowerProfile } from '@/lib/types';
import { 
  CheckmarkCircle01Icon, 
  AlertCircleIcon, 
  CancelCircleIcon, 
  ArrowRight01Icon 
} from '@/components/icons';

interface ResultsHeroProps {
  assessment: Assessment;
  profile: BorrowerProfile;
}

export function ResultsHero({ assessment }: ResultsHeroProps) {
  const getVerdictStyle = () => {
    switch (assessment.verdict) {
      case 'BORROW':
        return {
          badgeBg: 'bg-emerald-100 text-emerald-950 border-emerald-300',
          icon: <CheckmarkCircle01Icon className="w-8 h-8 text-emerald-600" aria-hidden="true" />
        };
      case 'BORROW LESS':
        return {
          badgeBg: 'bg-amber-100 text-amber-950 border-amber-300',
          icon: <AlertCircleIcon className="w-8 h-8 text-amber-600" aria-hidden="true" />
        };
      case 'DON\'T BORROW YET':
      default:
        return {
          badgeBg: 'bg-rose-100 text-rose-950 border-rose-300',
          icon: <CancelCircleIcon className="w-8 h-8 text-rose-600" aria-hidden="true" />
        };
    }
  };

  const style = getVerdictStyle();

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#ebeae8] shadow-sm space-y-6">
      {/* Top Tag & Confidence */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ebeae8] pb-5">
        <div>
          <span className="text-[12px] uppercase font-bold tracking-wider text-[#5769e7] block mb-1">
            Self-Reported Borrower Assessment
          </span>
          <h1 className="font-display text-[48px] sm:text-[64px] font-normal text-[#171717] tracking-tight uppercase leading-[0.9]">
            {assessment.verdict}
          </h1>
        </div>

        <div className="sm:text-right">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase border ${style.badgeBg}`}>
            {assessment.confidence} CONFIDENCE
          </span>
          <p className="text-[12px] text-[#747371] mt-1.5 sm:max-w-[240px]">
            {assessment.confidenceReasons[0] || 'Based on your stated cash flow & commitments.'}
          </p>
        </div>
      </div>

      {/* Core Verdict Rationale */}
      <div className="space-y-4">
        <p className="text-base sm:text-lg font-medium text-[#171717] leading-relaxed">
          {assessment.verdictReason}
        </p>

        {/* Actionable Next Move Recommendation */}
        <div className="p-5 rounded-2xl bg-[#fcfbf9] border border-[#ebeae8] space-y-2">
          <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-[#e5e9ff] text-[#5769e7] inline-block">
            Your Next Move
          </span>
          <h3 className="text-base font-bold text-[#171717]">
            {assessment.betterAlternative.title}
          </h3>
          <p className="text-xs sm:text-sm text-[#5d5b59] leading-relaxed">
            {assessment.betterAlternative.recommendation}
          </p>
          {assessment.betterAlternative.illustrativeScenario && (
            <p className="text-xs font-semibold text-[#323c7c] bg-[#e5e9ff]/50 p-3 rounded-xl border border-[#5769e7]/30 mt-2">
              💡 {assessment.betterAlternative.illustrativeScenario}
            </p>
          )}
        </div>
      </div>

      {/* Direct CTA to Negotiation Card */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#ebeae8]">
        <span className="text-[13px] font-medium text-[#747371]">
          Take these figures into the bank or NBFC branch.
        </span>
        <Link
          href="/card"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#5769e7] hover:bg-[#4958be] text-white text-[15px] font-semibold shadow-sm transition-all cursor-pointer"
        >
          <span>View Negotiation Card</span>
          <ArrowRight01Icon className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

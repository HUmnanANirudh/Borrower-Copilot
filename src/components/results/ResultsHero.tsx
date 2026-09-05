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
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#ebeae8] shadow-sm space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#ebeae8] pb-6">
        <div>
          <h1 className="text-3xl sm:text-5xl font-semibold text-[#171717] tracking-tight mb-2">
            {assessment.verdict}
          </h1>
          <p className="text-[15px] sm:text-[17px] font-medium text-[#5d5b59] leading-relaxed max-w-xl">
            {assessment.verdictReason}
          </p>
        </div>

        <div className="sm:text-right shrink-0">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-bold tracking-wider uppercase border ${style.badgeBg}`}>
            {assessment.confidence} CONFIDENCE
          </span>
        </div>
      </div>

      {/* Actionable Next Move Recommendation */}
      <div className="space-y-3">
        <h3 className="text-[18px] font-semibold text-[#171717]">
          {assessment.betterAlternative.title}
        </h3>
        <p className="text-[15px] text-[#5d5b59] leading-relaxed">
          {assessment.betterAlternative.recommendation}
        </p>
        {assessment.betterAlternative.illustrativeScenario && (
          <p className="text-[14px] font-medium text-[#323c7c] mt-2">
            {assessment.betterAlternative.illustrativeScenario}
          </p>
        )}
      </div>

      {/* Direct CTA */}
      <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#ebeae8]">
        <span className="text-[14px] font-medium text-[#747371]">
          Use this data to negotiate with lenders.
        </span>
        <Link
          href="/card"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-[#5769e7] hover:bg-[#4958be] text-white text-[15px] font-semibold shadow-sm transition-all"
        >
          <span>View Negotiation Card</span>
          <ArrowRight01Icon className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

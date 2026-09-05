'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Assessment, BorrowerProfile } from '@/lib/types';
import { createShareableCardUrl } from '@/lib/share';
import { 
  ShieldCheckIcon, 
  Copy01Icon, 
  PrinterIcon, 
  CheckmarkCircle01Icon, 
  ArrowLeft01Icon,
  InfoCircleIcon 
} from '@/components/icons';

interface PrintableCardProps {
  assessment: Assessment;
  profile: BorrowerProfile;
  isSharedView?: boolean;
}

export function PrintableCard({ assessment, profile, isSharedView = false }: PrintableCardProps) {
  const [copied, setCopied] = useState(false);

  const formatINR = (amt: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amt);
  };

  const formatLakhs = (amt: number) => `₹${(amt / 100000).toFixed(1)}L`;

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const shareUrl = createShareableCardUrl(assessment, profile, window.location.origin);
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const midRate = ((assessment.fairRateRange[0] + assessment.fairRateRange[1]) / 2).toFixed(1);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Top Action Controls (Hidden on Print) */}
      <div className="flex items-center justify-between no-print">
        <Link
          href={isSharedView ? '/' : '/results'}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5d5b59] hover:text-[#171717] px-2 py-1"
        >
          <ArrowLeft01Icon className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{isSharedView ? 'Borrower Copilot Home' : 'Back to Results'}</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-white border border-[#ebeae8] hover:bg-[#f2f1f0] text-[#171717] cursor-pointer shadow-2xs"
          >
            {copied ? (
              <CheckmarkCircle01Icon className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
            ) : (
              <Copy01Icon className="w-3.5 h-3.5" aria-hidden="true" />
            )}
            <span>{copied ? 'Link Copied!' : 'Copy Share Link'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-[#5769e7] text-white hover:bg-[#4958be] cursor-pointer shadow-2xs"
          >
            <PrinterIcon className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Honest Link Disclosure (Hidden on Print) */}
      <div className="p-3 bg-[#fcfbf9] rounded-2xl border border-[#ebeae8] text-[11px] text-[#747371] flex items-center gap-2 no-print">
        <InfoCircleIcon className="w-3.5 h-3.5 text-[#5769e7] shrink-0" aria-hidden="true" />
        <span>
          Shareable links contain an encoded copy of this assessment. Anyone with the link can view it.
        </span>
      </div>

      {/* THE OFFICIAL NEGOTIATION CARD (Single-Sheet Document) */}
      <article className="bg-white rounded-3xl p-6 sm:p-9 border-2 border-[#171717] shadow-sm space-y-6 print:border-black print:shadow-none">
        {/* Card Header */}
        <div className="border-b-2 border-[#171717] pb-4 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#5769e7]">
              <ShieldCheckIcon className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Borrower Copilot · Official Instrument</span>
            </div>
            <h1 className="font-display text-[32px] font-normal leading-tight text-[#171717] tracking-tight uppercase mt-0.5">
              Borrower Negotiation Card
            </h1>
            <p className="text-xs text-[#5d5b59] font-medium mt-0.5">
              Self-Reported Assessment · Inferred Route: {assessment.inferredProductRoute}
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] uppercase font-bold text-[#747371] block">Verdict</span>
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border inline-block mt-0.5 ${
              assessment.verdict === 'BORROW'
                ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
                : assessment.verdict === 'BORROW LESS'
                ? 'bg-amber-100 text-amber-950 border-amber-400'
                : 'bg-rose-100 text-rose-950 border-rose-400'
            }`}>
              {assessment.verdict}
            </span>
          </div>
        </div>

        {/* 4 Core Quantitative Benchmarks */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-300">
            <span className="text-[10px] font-bold uppercase text-emerald-950 block">Safe Amount</span>
            <span className="text-[24px] font-display font-normal text-emerald-800 mt-1 block">
              {formatLakhs(assessment.borrowerSafeRange[0])}–{formatLakhs(assessment.borrowerSafeRange[1])}
            </span>
            <span className="text-[9px] text-emerald-800 font-semibold">Borrower Safe</span>
          </div>

          <div className="p-3 bg-[#f7f6f4] rounded-2xl border border-[#ebeae8]">
            <span className="text-[10px] font-bold uppercase text-[#5d5b59] block">Lender Estimate</span>
            <span className="text-[24px] font-display font-normal text-[#171717] mt-1 block">
              {formatLakhs(assessment.estimatedLenderRange[0])}–{formatLakhs(assessment.estimatedLenderRange[1])}
            </span>
            <span className="text-[9px] text-[#747371]">Max Bank FOIR</span>
          </div>

          <div className="p-3 bg-[#e5e9ff]/50 rounded-2xl border border-[#5769e7]/40">
            <span className="text-[10px] font-bold uppercase text-[#323c7c] block">Fair Rate</span>
            <span className="text-[24px] font-display font-normal text-[#5769e7] mt-1 block">
              {assessment.fairRateRange[0]}%–{assessment.fairRateRange[1]}%
            </span>
            <span className="text-[9px] text-[#5d5b59]">All-In APR ~{assessment.effectiveAPRRange[1]}%</span>
          </div>

          <div className="p-3 bg-[#f2f1f0] rounded-2xl border border-[#ebeae8]">
            <span className="text-[10px] font-bold uppercase text-[#5d5b59] block">Safe EMI Ceiling</span>
            <span className="text-[24px] font-display font-normal text-[#171717] mt-1 block">
              {formatINR(assessment.recommendedMaxEMI)}
            </span>
            <span className="text-[9px] text-emerald-700 font-bold">10% Buffer</span>
          </div>
        </div>

        {/* KILLER FEATURE: The Exact Branch Negotiation Script */}
        <div className="p-4 rounded-2xl bg-[#fcfbf9] border-2 border-[#171717] space-y-2">
          <span className="text-[10px] uppercase font-display font-normal px-2 py-0.5 rounded-full bg-[#171717] text-white inline-block">
            What to say to the lender
          </span>
          <p className="text-xs sm:text-sm font-semibold text-[#171717] leading-relaxed italic">
            “Based on my verified profile, I am targeting an interest rate of {assessment.fairRateRange[0]}%–{assessment.fairRateRange[1]}%. Please disclose the all-inclusive APR in writing including processing fees and GST. I will not accept an agreement where monthly EMI exceeds {formatINR(assessment.recommendedMaxEMI)}/month.”
          </p>
        </div>

        {/* Counter-Offer Negotiation Points */}
        <div className="space-y-2 text-xs">
          <h4 className="font-bold text-[#171717] uppercase tracking-wider text-[11px]">
            What to ask the branch manager:
          </h4>
          <ul className="space-y-1.5 text-[#5d5b59]">
            <li className="flex items-start gap-2">
              <span className="font-bold text-[#5769e7]">1.</span>
              <span><strong>Demand All-In APR Disclosure:</strong> Require written disclosure of all one-time fees, documentation charges, and 18% statutory GST.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-[#5769e7]">2.</span>
              <span><strong>Opt-Out of Bundled Insurance:</strong> Decline mandatory single-premium loan protection insurance if you already hold term life cover.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-[#5769e7]">3.</span>
              <span><strong>Cap Processing Fee:</strong> Standard 2% bank processing fees can routinely be negotiated down to 0.75%–1.0%.</span>
            </li>
          </ul>
        </div>

        {/* Do-Not-Cross Safety Rules */}
        <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 text-xs text-rose-950 space-y-1">
          <span className="font-bold text-[10px] uppercase tracking-wider block text-rose-900">
            Do-Not-Cross Rules
          </span>
          <p className="font-medium">
            Never accept a tenure stretched to 60+ months just to fit an unaffordable loan into a lower monthly EMI.
          </p>
        </div>

        {/* Footer Audit Stamp */}
        <div className="pt-2 border-t border-[#ebeae8] flex items-center justify-between text-[10px] text-[#747371]">
          <span>Generated by Borrower Copilot · Stateless Algorithm</span>
          <span>Not a loan sanction · Independent borrower guide</span>
        </div>
      </article>
    </div>
  );
}

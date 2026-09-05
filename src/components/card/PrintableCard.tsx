'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Assessment, BorrowerProfile } from '@/lib/types';
import { createShareableCardUrl } from '@/lib/share';

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

  return (
    <div className="w-full max-w-[1280px] mx-auto px-5 lg:px-16 py-8 space-y-6">
      {/* Top Action Controls (Hidden on Print) */}
      <div className="flex items-center justify-between no-print">
        <Link
          href={isSharedView ? '/' : '/results'}
          className="text-xs font-semibold text-[#5d5b59] hover:text-[#171717] px-3.5 py-1.5 rounded-full bg-white border border-[#ebeae8] transition-colors"
        >
          {isSharedView ? 'BorrowIQ Home' : 'Back to Results'}
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="px-4 py-1.5 rounded-full text-xs font-semibold bg-white border border-[#ebeae8] hover:bg-[#f7f6f4] text-[#171717] cursor-pointer transition-colors shadow-2xs"
          >
            {copied ? 'Link Copied' : 'Copy Share Link'}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#171717] text-white hover:bg-[#333333] cursor-pointer transition-colors shadow-2xs"
          >
            Print / Save PDF
          </button>
        </div>
      </div>

      {/* Main Negotiation Card */}
      <article className="bg-white rounded-3xl p-6 sm:p-10 border border-[#ebeae8] shadow-sm space-y-8 print:border-black print:shadow-none">
        <div className="border-b border-[#ebeae8] pb-6 flex flex-col sm:flex-row items-start justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5d5b59] block mb-1">
              Personal Underwriting Card
            </span>
            <h1 className="text-2xl sm:text-4xl font-bold text-[#171717] tracking-tight">
              Borrower Negotiation Brief
            </h1>
            <p className="text-xs text-[#5d5b59] mt-1.5">
              Inferred Product Route: <span className="font-semibold text-[#171717]">{assessment.inferredProductRoute}</span>
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#f7f6f4] border border-[#ebeae8] text-[#171717]">
              {assessment.verdict} · {assessment.confidence} Confidence
            </span>
          </div>
        </div>

        {/* Core Numbers Bento Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#f7f6f4] border border-[#ebeae8]">
            <span className="text-[11px] font-bold text-[#5d5b59] uppercase tracking-wider block">Safe Carrying Limit</span>
            <span className="text-2xl font-bold text-[#171717] block mt-1">
              {formatLakhs(assessment.borrowerSafeRange[0])}–{formatLakhs(assessment.borrowerSafeRange[1])}
            </span>
            <span className="text-[11px] text-[#747371] block mt-1">Safe cash capacity</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#f7f6f4] border border-[#ebeae8]">
            <span className="text-[11px] font-bold text-[#5d5b59] uppercase tracking-wider block">Lender Sanction</span>
            <span className="text-2xl font-bold text-[#171717] block mt-1">
              {formatLakhs(assessment.estimatedLenderRange[0])}–{formatLakhs(assessment.estimatedLenderRange[1])}
            </span>
            <span className="text-[11px] text-[#747371] block mt-1">Max bank FOIR</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#f7f6f4] border border-[#ebeae8]">
            <span className="text-[11px] font-bold text-[#5d5b59] uppercase tracking-wider block">Fair Interest Rate</span>
            <span className="text-2xl font-bold text-[#171717] block mt-1">
              {assessment.fairRateRange[0]}%–{assessment.fairRateRange[1]}%
            </span>
            <span className="text-[11px] text-[#747371] block mt-1">All-In APR: {assessment.effectiveAPRRange[0]}%–{assessment.effectiveAPRRange[1]}%</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#f7f6f4] border border-[#ebeae8]">
            <span className="text-[11px] font-bold text-[#5d5b59] uppercase tracking-wider block">Safe Monthly EMI</span>
            <span className="text-2xl font-bold text-[#171717] block mt-1">
              {formatINR(assessment.recommendedMaxEMI)}
            </span>
            <span className="text-[11px] text-[#747371] block mt-1">10% cash buffer included</span>
          </div>
        </div>

        {/* Branch Counter-Offer Script Bento */}
        <div className="p-6 rounded-2xl bg-[#f7f6f4] border border-[#ebeae8] space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#5d5b59] block">
            Direct Statement for Sales Officer
          </span>
          <p className="text-sm sm:text-base font-medium text-[#171717] leading-relaxed">
            &quot;Based on my verified profile, I am targeting an interest rate of {assessment.fairRateRange[0]}%–{assessment.fairRateRange[1]}%. Disclose the full all-inclusive APR in writing with all upfront fees and 18% statutory GST. I will not accept an agreement where monthly EMI exceeds {formatINR(assessment.recommendedMaxEMI)}/month.&quot;
          </p>
        </div>

        {/* Essential Negotiation Points */}
        <div className="space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#5d5b59] block">
            Branch Negotiation Guardrails
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-xl border border-[#ebeae8] bg-white">
              <span className="font-bold text-[#171717] block mb-1">1. Demand Written APR</span>
              <p className="text-[#5d5b59] leading-relaxed">
                Require written disclosure of all one-time fees, documentation charges, and 18% statutory GST.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#ebeae8] bg-white">
              <span className="font-bold text-[#171717] block mb-1">2. Decline Bundled Insurance</span>
              <p className="text-[#5d5b59] leading-relaxed">
                Decline mandatory single-premium loan insurance if you already hold personal term life cover.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#ebeae8] bg-white">
              <span className="font-bold text-[#171717] block mb-1">3. Cap Upfront Fees</span>
              <p className="text-[#5d5b59] leading-relaxed">
                Standard 2% bank processing fees can routinely be negotiated down to 0.5%–0.75%.
              </p>
            </div>
          </div>
        </div>

        {/* Do Not Cross Limit */}
        <div className="p-4 rounded-xl bg-[#f7f6f4] border border-[#ebeae8] text-xs">
          <span className="font-bold text-[#171717] block mb-0.5">Non-Negotiable Boundary</span>
          <p className="text-[#5d5b59] leading-relaxed">
            Never accept a tenure stretched to 60+ months just to fit an unaffordable loan into a lower monthly installment.
          </p>
        </div>

        {/* Footer Audit Stamp */}
        <div className="pt-4 border-t border-[#ebeae8] flex items-center justify-between text-[11px] text-[#747371]">
          <span>Generated by BorrowIQ</span>
          <span>Self-Reported Assessment · Not a Bank Sanction</span>
        </div>
      </article>
    </div>
  );
}

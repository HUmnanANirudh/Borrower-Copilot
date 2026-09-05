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
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-6">
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
      <article className="bg-white rounded-3xl p-6 sm:p-9 space-y-8 print:border-black print:shadow-none">
        <div className="border-b-2 border-[#171717] pb-5 flex flex-col sm:flex-row items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#171717] tracking-tight">
              Borrower Negotiation Card
            </h1>
            <p className="text-[14px] text-[#5d5b59] mt-2">
              Inferred Route: {assessment.inferredProductRoute}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold text-[#5d5b59]">Safe Amount</span>
            <span className="text-2xl font-bold text-[#171717] mt-1">
              {formatLakhs(assessment.borrowerSafeRange[0])}–{formatLakhs(assessment.borrowerSafeRange[1])}
            </span>
            <span className="text-[12px] text-[#747371] mt-1">Your repayment limit</span>
          </div>

          <div className="flex flex-col border-l pl-4 border-[#ebeae8]">
            <span className="text-[13px] font-semibold text-[#5d5b59]">Lender Estimate</span>
            <span className="text-2xl font-bold text-[#171717] mt-1">
              {formatLakhs(assessment.estimatedLenderRange[0])}–{formatLakhs(assessment.estimatedLenderRange[1])}
            </span>
            <span className="text-[12px] text-[#747371] mt-1">Max bank FOIR</span>
          </div>

          <div className="flex flex-col border-l pl-4 border-[#ebeae8]">
            <span className="text-[13px] font-semibold text-[#323c7c]">Fair Rate</span>
            <span className="text-2xl font-bold text-[#323c7c] mt-1">
              {assessment.fairRateRange[0]}%–{assessment.fairRateRange[1]}%
            </span>
            <span className="text-[12px] text-[#5d5b59] mt-1">APR ~{assessment.effectiveAPRRange[1]}%</span>
          </div>

          <div className="flex flex-col border-l pl-4 border-[#ebeae8]">
            <span className="text-[13px] font-semibold text-[#5d5b59]">Safe EMI</span>
            <span className="text-2xl font-bold text-[#171717] mt-1">
              {formatINR(assessment.recommendedMaxEMI)}
            </span>
            <span className="text-[12px] text-[#747371] mt-1">10% budget buffer</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#f7f6f4] border border-[#ebeae8]">
          <h4 className="text-[14px] font-bold text-[#171717] mb-2">What to say to the lender</h4>
          <p className="text-[15px] font-medium text-[#171717] leading-relaxed italic">
            “Based on my verified profile, I am targeting an interest rate of {assessment.fairRateRange[0]}%–{assessment.fairRateRange[1]}%. Please disclose the all-inclusive APR in writing including processing fees and GST. I will not accept an agreement where monthly EMI exceeds {formatINR(assessment.recommendedMaxEMI)}/month.”
          </p>
        </div>
        <div>
          <h4 className="text-[14px] font-bold text-[#171717] mb-3">
            What to ask the branch manager
          </h4>
          <ul className="space-y-3 text-[14px] text-[#5d5b59]">
            <li className="flex items-start gap-2">
              <span className="font-semibold text-[#171717]">1.</span>
              <span><strong>Demand All-In APR Disclosure:</strong> Require written disclosure of all one-time fees, documentation charges, and 18% statutory GST.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold text-[#171717]">2.</span>
              <span><strong>Opt-Out of Bundled Insurance:</strong> Decline mandatory single-premium loan protection insurance if you already hold term life cover.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold text-[#171717]">3.</span>
              <span><strong>Cap Processing Fee:</strong> Standard 2% bank processing fees can routinely be negotiated down to 0.75%–1.0%.</span>
            </li>
          </ul>
        </div>

        {/* Do-Not-Cross Safety Rules */}
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
          <p className="text-[14px] font-medium text-rose-800 leading-relaxed">
            Never accept a tenure stretched to 60+ months just to fit an unaffordable loan into a lower monthly EMI.
          </p>
        </div>

        {/* Footer Audit Stamp */}
        <div className="pt-4 border-t border-[#ebeae8] flex flex-col sm:flex-row items-center justify-between text-[11px] font-medium text-[#a09f9d]">
          <span>Generated by BorrowIQ · Self-Reported Assessment</span>
          <span>Not a loan sanction</span>
        </div>
      </article>
    </div>
  );
}

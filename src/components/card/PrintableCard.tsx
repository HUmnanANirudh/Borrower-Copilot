'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Assessment, BorrowerProfile } from '@/lib/types';
import { createShareableCardUrl } from '@/lib/share';

import { 
  ArrowLeft01Icon, 
  Copy01Icon, 
  CheckmarkCircle01Icon, 
  PrinterIcon 
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

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 py-4 sm:py-8 space-y-4 sm:space-y-6 print:p-0 print:m-0 print:space-y-0 print:max-w-none">
      {/* Top Action Controls (Hidden on Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <Link
          href={isSharedView ? '/' : '/results'}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#5d5b59] hover:text-[#171717] px-4 py-2 sm:py-1.5 rounded-full bg-white border border-[#ebeae8] hover:bg-[#f7f6f4] transition-all shadow-2xs w-fit active:scale-98 touch-manipulation"
        >
          <ArrowLeft01Icon className="w-3.5 h-3.5" />
          <span>{isSharedView ? 'BorrowIQ Home' : 'Back to Results'}</span>
        </Link>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 sm:py-1.5 rounded-full text-xs font-semibold bg-white border border-[#ebeae8] hover:bg-[#f7f6f4] text-[#171717] cursor-pointer transition-all shadow-2xs active:scale-98 touch-manipulation"
          >
            {copied ? (
              <>
                <CheckmarkCircle01Icon className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Link Copied</span>
              </>
            ) : (
              <>
                <Copy01Icon className="w-3.5 h-3.5 text-[#5d5b59]" />
                <span>Copy Share Link</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2 sm:py-1.5 rounded-full text-xs font-semibold bg-[#171717] text-white hover:bg-[#333333] cursor-pointer transition-all shadow-2xs active:scale-98 touch-manipulation"
          >
            <PrinterIcon className="w-3.5 h-3.5 text-white" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      <article className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 space-y-7 print:p-0 print:space-y-4 print:border-none print:shadow-none print:rounded-none print-one-page">
        {/* Header: Clean document title and verdict typography (no badge component) */}
        <div className="border-b border-[#ebeae8] pb-5 flex flex-col sm:flex-row items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#171717] tracking-tight whitespace-nowrap">
              Borrower Negotiation Brief
            </h1>
            <p className="text-xs text-[#5d5b59] mt-1">
              Inferred Product Route: <span className="font-semibold text-[#171717]">{assessment.inferredProductRoute}</span>
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-base sm:text-lg font-bold text-[#171717] tracking-tight block">
              {assessment.verdict}
            </span>
            <span className="text-xs text-[#747371] font-medium block mt-0.5">
              {assessment.confidence} Confidence
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 print:grid-cols-4 print:gap-3">
          <div className="p-4 sm:p-5 print:p-3 rounded-xl bg-[#f7f6f4]">
            <span className="text-[10px] sm:text-[11px] font-bold text-[#5d5b59] uppercase tracking-wider block">Safe Carrying Limit</span>
            <span className="text-xl sm:text-2xl font-bold text-[#171717] block mt-1 print:text-xl">
              {formatLakhs(assessment.borrowerSafeRange[0])}–{formatLakhs(assessment.borrowerSafeRange[1])}
            </span>
            <span className="text-[11px] text-[#747371] block mt-1">Safe cash capacity (36–48m)</span>
          </div>

          <div className="p-4 sm:p-5 print:p-3 rounded-xl bg-[#f7f6f4]">
            <span className="text-[10px] sm:text-[11px] font-bold text-[#5d5b59] uppercase tracking-wider block">Lender Sanction</span>
            <span className="text-xl sm:text-2xl font-bold text-[#171717] block mt-1 print:text-xl">
              {formatLakhs(assessment.estimatedLenderRange[0])}–{formatLakhs(assessment.estimatedLenderRange[1])}
            </span>
            <span className="text-[11px] text-[#747371] block mt-1">Aggressive bank 50%–60% FOIR</span>
          </div>

          <div className="p-4 sm:p-5 print:p-3 rounded-xl bg-[#f7f6f4]">
            <span className="text-[10px] sm:text-[11px] font-bold text-[#5d5b59] uppercase tracking-wider block">Fair Interest Rate</span>
            <span className="text-xl sm:text-2xl font-bold text-[#171717] block mt-1 print:text-xl">
              {assessment.fairRateRange[0]}%–{assessment.fairRateRange[1]}%
            </span>
            <span className="text-[11px] text-[#747371] block mt-1">All-In APR: {assessment.effectiveAPRRange[0]}%–{assessment.effectiveAPRRange[1]}%</span>
          </div>

          <div className="p-4 sm:p-5 print:p-3 rounded-xl bg-[#f7f6f4]">
            <span className="text-[10px] sm:text-[11px] font-bold text-[#5d5b59] uppercase tracking-wider block">Safe Monthly EMI</span>
            <span className="text-xl sm:text-2xl font-bold text-[#171717] block mt-1 print:text-xl">
              {formatINR(assessment.recommendedMaxEMI)}
            </span>
            <span className="text-[11px] text-[#747371] block mt-1">10% emergency buffer included</span>
          </div>
        </div>

        {/* Branch Counter-Offer Statement (Clean flat tint, no border) */}
        <div className="p-4 sm:p-5 print:p-3.5 rounded-xl bg-[#f7f6f4] space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#5d5b59] block">
            Direct Statement for Sales Officer
          </span>
          <p className="text-xs sm:text-sm font-medium text-[#171717] leading-relaxed">
            {assessment.recommendedMaxEMI > 0 ? (
              <>&quot;Based on my verified profile, I am targeting an interest rate of {assessment.fairRateRange[0]}%–{assessment.fairRateRange[1]}%. Disclose the full all-inclusive APR in writing with all upfront fees and 18% statutory GST. I will not accept an agreement where monthly EMI exceeds {formatINR(assessment.recommendedMaxEMI)}/month.&quot;</>
            ) : (
              <>&quot;Based on my verified profile and current living cost requirements, I cannot safely service new monthly debt obligations today without risking default. I request all terms and written APR disclosures to review with an independent advisor before proceeding.&quot;</>
            )}
          </p>
        </div>

        {/* Underwriting Rationale & Binding Rules (Clean flat tint, no borders) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 print:grid-cols-2 print:gap-3">
          <div className="p-4 print:p-3 rounded-xl bg-[#f7f6f4] space-y-1">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#5d5b59] block">
              Safe EMI Binding Rule: {assessment.safeEMITrace.bindingRule.replace(/_/g, ' ')}
            </span>
            <p className="text-xs text-[#171717] leading-relaxed">
              {assessment.safeEMITrace.rationale}
            </p>
          </div>

          <div className="p-4 print:p-3 rounded-xl bg-[#f7f6f4] space-y-1">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#5d5b59] block">
              Fair Rate Benchmark: {assessment.rateTrace.bindingRule.replace(/_/g, ' ')}
            </span>
            <p className="text-xs text-[#171717] leading-relaxed">
              {assessment.rateTrace.rationale}
            </p>
          </div>
        </div>

        {/* Branch Negotiation Guardrails (Clean flat tint, no borders) */}
        <div className="space-y-2 print:space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#5d5b59] block">
            Branch Negotiation Guardrails
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 print:grid-cols-3 print:gap-2.5 text-xs print:text-[11px]">
            <div className="p-3.5 print:p-3 rounded-xl bg-[#f7f6f4]">
              <span className="font-bold text-[#171717] block mb-1">1. Demand Written APR</span>
              <p className="text-[#5d5b59] leading-relaxed">
                Require written disclosure of all one-time fees, documentation charges, and 18% statutory GST.
              </p>
            </div>

            <div className="p-3.5 print:p-3 rounded-xl bg-[#f7f6f4]">
              <span className="font-bold text-[#171717] block mb-1">2. Decline Bundled Insurance</span>
              <p className="text-[#5d5b59] leading-relaxed">
                Decline mandatory single-premium loan insurance if you already hold personal term life cover.
              </p>
            </div>

            <div className="p-3.5 print:p-3 rounded-xl bg-[#f7f6f4]">
              <span className="font-bold text-[#171717] block mb-1">3. Cap Upfront Fees</span>
              <p className="text-[#5d5b59] leading-relaxed">
                Standard 2% bank processing fees can routinely be negotiated down to 0.5%–0.75%.
              </p>
            </div>
          </div>
        </div>

        {/* Repayment Horizon Tenure Amortization Comparison (Clean table, text labels, no badge components) */}
        {assessment.tenureMatrix && assessment.tenureMatrix.length > 0 && (
          <div className="space-y-1.5 print:space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5d5b59]">
                Repayment Horizon Amortization (Avoid the 5-Year Tenure Trap)
              </span>
              <span className="text-[10px] text-[#747371]">
                Safe EMI Ceiling: {formatINR(assessment.recommendedMaxEMI)}/mo
              </span>
            </div>
            <div className="overflow-x-auto rounded-xl bg-[#f7f6f4]">
              <table className="w-full text-left text-xs print:text-[11px]">
                <thead className="text-[#5d5b59]">
                  <tr>
                    <th className="py-2 px-3 font-bold">Tenure</th>
                    <th className="py-2 px-3 font-bold">Monthly EMI</th>
                    <th className="py-2 px-3 font-bold">Total Interest</th>
                    <th className="py-2 px-3 font-bold">Total Outflow</th>
                    <th className="py-2 px-3 font-bold text-right">Assessment</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#f2f1f0]">
                  {assessment.tenureMatrix.map((opt) => {
                    const isOver = opt.emi > assessment.recommendedMaxEMI;
                    return (
                      <tr key={opt.tenureMonths}>
                        <td className="py-1.5 px-3 font-semibold text-[#171717]">
                          {opt.tenureMonths} Months ({opt.tenureMonths / 12} Yrs)
                        </td>
                        <td className="py-1.5 px-3 font-bold text-[#171717]">
                          {formatINR(opt.emi)}
                        </td>
                        <td className="py-1.5 px-3 text-[#5d5b59]">
                          {formatINR(opt.totalInterest)}
                        </td>
                        <td className="py-1.5 px-3 text-[#171717] font-medium">
                          {formatINR(opt.totalRepayment)}
                        </td>
                        <td className="py-1.5 px-3 text-right">
                          <span className="font-semibold text-[11px] text-[#171717]">
                            {isOver ? 'Exceeds Ceiling' : 'Safe Capacity'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex justify-center items-center pt-3 border-t border-[#ebeae8] flex items-center justify-between text-[11px] font-medium text-[#747371]">
          <span className='whitespace-nowrap'>Generated by BorrowIQ · Self-Reported Assessment</span>
        </div>
      </article>
    </div>
  );
}

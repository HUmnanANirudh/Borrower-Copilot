'use client';

import React, { useState } from 'react';
import { Assessment, BorrowerProfile } from '@/lib/types';
import { encodeCardPayload } from '@/lib/share';
import { 
  ShieldCheckIcon, 
  Copy01Icon, 
  PrinterIcon, 
  AlertCircleIcon, 
  SparklesIcon,
  CheckmarkCircle01Icon,
  Share01Icon
} from '@hugeicons/react';

interface NegotiationCardProps {
  assessment: Assessment;
  profile: BorrowerProfile;
  onBackToResults?: () => void;
}

export function NegotiationCard({ assessment, profile, onBackToResults }: NegotiationCardProps) {
  const [copied, setCopied] = useState(false);

  const formatINR = (amt: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amt);
  };

  const handleCopyShareLink = () => {
    const hashPayload = encodeCardPayload(assessment, profile);
    const url = `${window.location.origin}${window.location.pathname}#card=${hashPayload}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between no-print">
        {onBackToResults && (
          <button
            onClick={onBackToResults}
            className="text-xs font-semibold text-[#5d5b59] hover:text-[#171717] cursor-pointer"
          >
            ← Back to Assessment
          </button>
        )}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyShareLink}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white border border-[#dedcd9] hover:bg-[#f2f1f0] text-[#171717] cursor-pointer shadow-2xs"
          >
            {copied ? <CheckmarkCircle01Icon className="w-3.5 h-3.5 text-emerald-600" /> : <Copy01Icon className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied!' : 'Copy Share Link'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#5769e7] text-white hover:bg-[#4958be] cursor-pointer shadow-2xs"
          >
            <PrinterIcon className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* THE NEGOTIATION CARD (Single-Screen / Single-Sheet Format) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#171717] menti-card-shadow space-y-6 print:border-black print:shadow-none">
        {/* Card Header */}
        <div className="border-b-2 border-[#171717] pb-4 flex items-start justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-black text-[#5769e7] block">
              Official Borrower Defense Instrument
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#171717] tracking-tight uppercase">
              Borrower Negotiation Card
            </h1>
            <p className="text-xs text-[#5d5b59] mt-0.5 font-medium">
              Requested: {formatINR(profile.requestedAmount)} · Route: {assessment.inferredProductRoute}
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] uppercase font-bold text-[#5d5b59] block">Verdict</span>
            <span className={`text-sm font-black px-2.5 py-0.5 rounded-full border ${
              assessment.verdict === 'BORROW'
                ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                : assessment.verdict === 'BORROW LESS'
                ? 'bg-amber-100 text-amber-900 border-amber-400'
                : 'bg-rose-100 text-rose-900 border-rose-400'
            }`}>
              {assessment.verdict}
            </span>
          </div>
        </div>

        {/* Core Metric Quadrants */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="p-3.5 rounded-2xl bg-[#fcfbf9] border border-[#dedcd9]">
            <span className="text-[10px] uppercase font-bold text-[#5d5b59] block">Safe Borrowing Target</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-700 block mt-0.5">
              ₹{(assessment.borrowerSafeRange[0]/100000).toFixed(1)}L – ₹{(assessment.borrowerSafeRange[1]/100000).toFixed(1)}L
            </span>
            <span className="text-[10px] text-[#5d5b59] block mt-0.5">Stick to this number</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#fcfbf9] border border-[#dedcd9]">
            <span className="text-[10px] uppercase font-bold text-[#5d5b59] block">Estimated Lender Offer</span>
            <span className="text-xl sm:text-2xl font-black text-[#171717] block mt-0.5">
              ₹{(assessment.estimatedLenderRange[0]/100000).toFixed(1)}L – ₹{(assessment.estimatedLenderRange[1]/100000).toFixed(1)}L
            </span>
            <span className="text-[10px] text-rose-600 font-semibold block mt-0.5">Sales inflation trap</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#fcfbf9] border border-[#dedcd9]">
            <span className="text-[10px] uppercase font-bold text-[#5d5b59] block">Fair Interest Rate</span>
            <span className="text-xl sm:text-2xl font-black text-[#5769e7] block mt-0.5">
              {assessment.fairRateRange[0]}% – {assessment.fairRateRange[1]}%
            </span>
            <span className="text-[10px] text-[#5d5b59] block mt-0.5">All-in APR: {assessment.effectiveAPRRange[0]}%–{assessment.effectiveAPRRange[1]}%</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200">
            <span className="text-[10px] uppercase font-black text-rose-800 block">Safe EMI Ceiling</span>
            <span className="text-xl sm:text-2xl font-black text-rose-900 block mt-0.5">
              ₹{assessment.recommendedMaxEMI.toLocaleString('en-IN')}/mo
            </span>
            <span className="text-[10px] font-bold text-rose-800 block mt-0.5">DO NOT CROSS</span>
          </div>
        </div>

        {/* Why One-Liner */}
        <div className="p-3.5 rounded-2xl bg-[#f2f1f0] border border-[#dedcd9] text-xs space-y-1">
          <span className="font-bold text-[#171717] block">Core Rationale:</span>
          <p className="text-[#171717] font-medium leading-relaxed">{assessment.verdictReason}</p>
        </div>

        {/* Better Alternative Callout */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-300 text-xs text-emerald-950 space-y-1">
          <span className="font-bold uppercase tracking-wider text-[10px] text-emerald-800 block">
            Recommended Action Tomorrow:
          </span>
          <p className="font-bold">{assessment.betterAlternative.title}</p>
          <p className="text-emerald-900 leading-relaxed">{assessment.betterAlternative.recommendation}</p>
          {assessment.betterAlternative.illustrativeScenario && (
            <p className="font-semibold text-emerald-800 mt-1 italic text-[11px]">
              {assessment.betterAlternative.illustrativeScenario}
            </p>
          )}
        </div>

        {/* Exact Talking Points */}
        <div className="space-y-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-[#171717] flex items-center gap-1.5">
            <SparklesIcon className="w-4 h-4 text-[#5769e7]" />
            Exact Counter-Script For The Lender:
          </h4>
          <ul className="space-y-1.5 text-xs text-[#171717] pl-5 list-disc font-medium">
            {assessment.negotiationPoints.map((pt, i) => (
              <li key={i}>{pt}</li>
            ))}
          </ul>
        </div>

        {/* Strict Do Not Cross */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-950 space-y-1.5">
          <h4 className="font-bold flex items-center gap-1.5 text-amber-900">
            <AlertCircleIcon className="w-4 h-4 text-amber-700" />
            Hard Rules — Do Not Cross:
          </h4>
          <ul className="space-y-1 pl-5 list-disc text-amber-900 text-[11px] font-medium">
            {assessment.doNotCrossRules.map((rule, i) => (
              <li key={i}>{rule}</li>
            ))}
          </ul>
        </div>

        {/* Card Footer */}
        <div className="pt-2 border-t border-[#dedcd9] flex items-center justify-between text-[10px] text-[#a09f9d]">
          <span>Generated via Borrower Copilot · Privacy Preserved</span>
          <span>Zero Bureau Pull · Stateless Hash Verification</span>
        </div>
      </div>
    </div>
  );
}

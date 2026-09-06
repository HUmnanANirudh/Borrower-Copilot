'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BorrowerProfile, Assessment, AssumptionOverrides } from '@/lib/types';
import { PERSONA_PRIYA, PERSONA_RAVI, PERSONA_ANITA } from '@/lib/personas';
import { evaluateAssessment } from '@/lib/rules/index';
import { BASE_QUESTION_IDS, QUESTION_REGISTRY } from '@/lib/questions/registry';
import { getEligibleAdaptiveQuestions } from '@/lib/questions/eligibility';
import { 
  ShieldCheckIcon, 
  ArrowRight01Icon, 
  RotateLeftIcon,
  CheckmarkCircle01Icon,
  AlertCircleIcon,
  CancelCircleIcon
} from '@/components/icons';

export function DemoClient() {
  const router = useRouter();

  // Selected persona state
  const [selectedPersonaKey, setSelectedPersonaKey] = useState<'priya' | 'ravi' | 'anita'>('priya');

  // Dynamic Rule Assumption Overrides Sandbox
  const [safeFOIR, setSafeFOIR] = useState<number>(35);
  const [gigFOIR, setGigFOIR] = useState<number>(25);
  const [stressPercent, setStressPercent] = useState<number>(20);

  const activePersona: BorrowerProfile = useMemo(() => {
    switch (selectedPersonaKey) {
      case 'priya': return PERSONA_PRIYA;
      case 'ravi': return PERSONA_RAVI;
      case 'anita': return PERSONA_ANITA;
    }
  }, [selectedPersonaKey]);

  const overrides: AssumptionOverrides = useMemo(() => ({
    safeFOIRCapPercent: safeFOIR,
    gigFOIRCapPercent: gigFOIR,
    incomeStressPercent: stressPercent
  }), [safeFOIR, gigFOIR, stressPercent]);

  // Live evaluated assessment with overrides
  const assessment: Assessment = useMemo(() => {
    return evaluateAssessment(activePersona, overrides);
  }, [activePersona, overrides]);

  // Questions asked for this profile
  const questionsAsked = useMemo(() => {
    const base = BASE_QUESTION_IDS.map(id => QUESTION_REGISTRY[id]).filter(Boolean);
    const adaptive = getEligibleAdaptiveQuestions(activePersona, BASE_QUESTION_IDS as string[]);
    return [...base, ...adaptive];
  }, [activePersona]);

  const formatINR = (amt: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amt);
  };

  const formatLakhs = (amt: number) => `₹${(amt / 100000).toFixed(1)}L`;

  const handleOpenInResults = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('borrower_profile', JSON.stringify(activePersona));
      router.push('/results');
    }
  };

  const handleResetOverrides = () => {
    setSafeFOIR(35);
    setGigFOIR(25);
    setStressPercent(20);
  };

  return (
    <div className="min-h-screen bg-[#f3ede7] text-[#171717] font-sans selection:bg-[#5769e7]/20 selection:text-[#5769e7] pb-16">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#f3ede7]/90 backdrop-blur-md border-b border-[#ebeae8] px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#171717] text-white flex items-center justify-center">
              <ShieldCheckIcon className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <span className="text-[14px] font-semibold text-[#171717]">Borrower Copilot · Evaluator Sandbox</span>
              <span className="text-[10px] text-[#747371] block">Isolated benchmark launcher & dynamic rule overrides</span>
            </div>
          </div>

          <Link
            href="/"
            className="text-xs font-semibold text-[#5d5b59] hover:text-[#171717] px-3 py-1 rounded-full border border-[#ebeae8] bg-white"
          >
            ← Public Home
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-8 space-y-8">
        {/* 1. Benchmark Persona Selector */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ebeae8] shadow-sm space-y-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#5769e7] block">
              Step 1: Choose Evaluator Benchmark
            </span>
            <h2 className="text-xl sm:text-2xl font-display font-normal leading-tight text-[#171717]">
              Inspect Divergent Underwriting Decisions
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Priya */}
            <button
              type="button"
              onClick={() => setSelectedPersonaKey('priya')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                selectedPersonaKey === 'priya'
                  ? 'border-[#5769e7] bg-[#e5e9ff]/40 ring-2 ring-[#5769e7]/30'
                  : 'border-[#ebeae8] bg-[#fcfbf9] hover:bg-[#f2f1f0]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-semibold text-[#171717]">Priya, 29</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Prime Salaried
                </span>
              </div>
              <p className="text-xs text-[#5d5b59] mt-1.5">
                ₹1.1L net salary · ₹14k car EMI · 780 CIBIL · ₹8L wedding request
              </p>
            </button>

            {/* Ravi */}
            <button
              type="button"
              onClick={() => setSelectedPersonaKey('ravi')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                selectedPersonaKey === 'ravi'
                  ? 'border-[#5769e7] bg-[#e5e9ff]/40 ring-2 ring-[#5769e7]/30'
                  : 'border-[#ebeae8] bg-[#fcfbf9] hover:bg-[#f2f1f0]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-semibold text-[#171717]">Ravi, 42</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  SME Kirana Owner
                </span>
              </div>
              <p className="text-xs text-[#5d5b59] mt-1.5">
                ₹60k profit + ₹18k wife · ₹45L shop premises · ₹15L stock request
              </p>
            </button>

            {/* Anita */}
            <button
              type="button"
              onClick={() => setSelectedPersonaKey('anita')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                selectedPersonaKey === 'anita'
                  ? 'border-[#5769e7] bg-[#e5e9ff]/40 ring-2 ring-[#5769e7]/30'
                  : 'border-[#ebeae8] bg-[#fcfbf9] hover:bg-[#f2f1f0]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-semibold text-[#171717]">Anita, 35</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                  Informal / Deficit
                </span>
              </div>
              <p className="text-xs text-[#5d5b59] mt-1.5">
                ₹28k gig earnings · ₹35k app debt (30%+) · 1 bounce · ₹1.5L request
              </p>
            </button>
          </div>
        </div>

        {/* 2. KILLER FEATURE: Live Assumption Overrides Sandbox */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#171717] shadow-sm space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] uppercase font-display font-normal leading-tight tracking-widest text-[#5769e7] block">
                Step 2: Rule Assumption Overrides Sandbox
              </span>
              <h3 className="text-lg font-display font-normal leading-tight text-[#171717]">
                Tweak Engine Rules & Observe Live Recalculation
              </h3>
              <p className="text-xs text-[#5d5b59] mt-0.5">
                Proves financial formulas are modular and parameterized, not hardcoded around the three profiles.
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetOverrides}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#5769e7] hover:underline cursor-pointer"
            >
              <RotateLeftIcon className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Reset Defaults</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            {/* Safe FOIR Cap */}
            <div className="p-4 bg-[#fcfbf9] rounded-2xl border border-[#ebeae8] space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#171717]">Safe Salaried FOIR</span>
                <span className="text-base font-display font-normal leading-tight text-[#5769e7]">{safeFOIR}%</span>
              </div>
              <input
                type="range"
                min={25}
                max={50}
                step={1}
                value={safeFOIR}
                onChange={(e) => setSafeFOIR(Number(e.target.value))}
                className="w-full h-2 bg-[#dedcd9] rounded-lg appearance-none cursor-pointer accent-[#5769e7]"
              />
              <span className="text-[10px] text-[#747371] block">Default: 35% cap</span>
            </div>

            {/* Gig FOIR Cap */}
            <div className="p-4 bg-[#fcfbf9] rounded-2xl border border-[#ebeae8] space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#171717]">Gig / Informal FOIR</span>
                <span className="text-base font-display font-normal leading-tight text-[#5769e7]">{gigFOIR}%</span>
              </div>
              <input
                type="range"
                min={15}
                max={40}
                step={1}
                value={gigFOIR}
                onChange={(e) => setGigFOIR(Number(e.target.value))}
                className="w-full h-2 bg-[#dedcd9] rounded-lg appearance-none cursor-pointer accent-[#5769e7]"
              />
              <span className="text-[10px] text-[#747371] block">Default: 25% cap</span>
            </div>

            {/* Income Stress % */}
            <div className="p-4 bg-[#fcfbf9] rounded-2xl border border-[#ebeae8] space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#171717]">Income Shock Stress</span>
                <span className="text-base font-display font-normal leading-tight text-[#5769e7]">{stressPercent}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={40}
                step={5}
                value={stressPercent}
                onChange={(e) => setStressPercent(Number(e.target.value))}
                className="w-full h-2 bg-[#dedcd9] rounded-lg appearance-none cursor-pointer accent-[#5769e7]"
              />
              <span className="text-[10px] text-[#747371] block">Default: -20% drop</span>
            </div>
          </div>
        </div>

        {/* 3. Live Assessment Output */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ebeae8] shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#ebeae8] pb-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#747371] block">
                Calculated Output for {activePersona.primaryIncomeSignal.replace(/_/g, ' ')}
              </span>
              <h3 className="text-2xl font-display font-normal leading-tight text-[#171717] mt-0.5">
                Verdict: <span className="text-[#5769e7]">{assessment.verdict}</span>
              </h3>
            </div>
            <button
              type="button"
              onClick={handleOpenInResults}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#5769e7] text-white text-xs font-bold shadow-xs hover:bg-[#4958be] cursor-pointer"
            >
              <span>Inspect Full Consumer View</span>
              <ArrowRight01Icon className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>

          {/* Core Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
              <span className="text-[10px] uppercase font-bold text-emerald-950 block">Safe Amount</span>
              <span className="text-lg font-display font-normal leading-tight text-emerald-800 mt-1 block">
                {formatLakhs(assessment.borrowerSafeRange[0])}–{formatLakhs(assessment.borrowerSafeRange[1])}
              </span>
            </div>

            <div className="p-3 bg-[#f7f6f4] rounded-2xl border border-[#ebeae8]">
              <span className="text-[10px] uppercase font-bold text-[#5d5b59] block">Lender Range</span>
              <span className="text-lg font-display font-normal leading-tight text-[#171717] mt-1 block">
                {formatLakhs(assessment.estimatedLenderRange[0])}–{formatLakhs(assessment.estimatedLenderRange[1])}
              </span>
            </div>

            <div className="p-3 bg-[#e5e9ff]/50 rounded-2xl border border-[#5769e7]/30">
              <span className="text-[10px] uppercase font-bold text-[#323c7c] block">Fair Rate Band</span>
              <span className="text-lg font-display font-normal leading-tight text-[#5769e7] mt-1 block">
                {assessment.fairRateRange[0]}%–{assessment.fairRateRange[1]}%
              </span>
            </div>

            <div className="p-3 bg-[#f2f1f0] rounded-2xl border border-[#ebeae8]">
              <span className="text-[10px] uppercase font-bold text-[#5d5b59] block">Safe EMI Ceiling</span>
              <span className="text-lg font-display font-normal leading-tight text-[#171717] mt-1 block">
                {formatINR(assessment.recommendedMaxEMI)}
              </span>
            </div>
          </div>

          {/* Inferred Product Route */}
          <div className="p-4 rounded-2xl bg-[#fcfbf9] border border-[#ebeae8] space-y-1">
            <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-[#dedcd9] text-[#171717] inline-block">
              Inferred Product Route
            </span>
            <h4 className="text-sm font-bold text-[#171717]">{assessment.inferredProductRoute}</h4>
            <p className="text-xs text-[#5d5b59] leading-relaxed">{assessment.productRouteRationale}</p>
          </div>

          {/* Mathematical Reason Trace */}
          <div className="p-4 rounded-2xl bg-[#e5e9ff]/30 border border-[#5769e7]/30 text-xs text-[#323c7c] space-y-1.5">
            <span className="font-bold block">
              Binding Rule: {assessment.safeEMITrace.bindingRule.replace(/_/g, ' ')}
            </span>
            <p className="italic text-[#171717]">{assessment.safeEMITrace.rationale}</p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {assessment.safeEMITrace.drivers.map((drv, i) => (
                <span key={i} className="bg-white px-2 py-1 rounded-lg border border-[#ebeae8] text-[10px] text-[#171717]">
                  {drv}
                </span>
              ))}
            </div>
          </div>

          {/* Adaptive Questionnaire Execution Trail */}
          <div className="space-y-2 pt-2 border-t border-[#ebeae8]">
            <span className="text-xs font-bold text-[#171717] block">
              Adaptive Questionnaire Trail ({questionsAsked.length} questions prioritized):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {questionsAsked.map((q, idx) => (
                <div key={q.id as string} className="p-2.5 rounded-xl bg-[#fcfbf9] border border-[#ebeae8] flex items-center justify-between">
                  <span className="font-medium text-[#171717] truncate max-w-[280px]">
                    {idx + 1}. {q.title}
                  </span>
                  <span className="text-[10px] font-bold text-[#5769e7] shrink-0 ml-2">
                    Score: {q.informationScore(activePersona)}/10
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

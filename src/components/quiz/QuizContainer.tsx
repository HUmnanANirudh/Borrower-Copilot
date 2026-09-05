'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BorrowerProfile } from '@/lib/types';
import { BASE_QUESTION_IDS, QUESTION_REGISTRY, RegisteredQuestion } from '@/lib/questions/registry';
import { determineNextQuestion, NextQuestionResult } from '@/lib/questions/selector';
import Avatar from 'boring-avatars';
import { InputControls } from '@/components/quiz/InputControls';

interface QuestionMeta {
  reason: string;
  source: NextQuestionResult['source'];
}

export function QuizContainer() {
  const router = useRouter();

  const [profile, setProfile] = useState<Partial<BorrowerProfile>>({
    loanPurpose: 'wedding_personal',
    requestedAmount: 500000,
    age: 30,
    primaryIncomeSignal: 'salaried_corporate',
    netMonthlyIncome: 75000,
    existingMonthlyEMI: 0,
    householdLivingExpenses: 30000,
    creditScoreStatus: 'unknown'
  });

  const [questionQueue, setQuestionQueue] = useState<RegisteredQuestion[]>(() => {
    return BASE_QUESTION_IDS.map(id => QUESTION_REGISTRY[id]).filter(Boolean);
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionMetaMap, setQuestionMetaMap] = useState<Record<string, QuestionMeta>>({});
  const [isSelecting, setIsSelecting] = useState(false);

  const currentQuestion = questionQueue[currentIndex];
  const totalBaseQuestions = BASE_QUESTION_IDS.length;
  const isAdaptivePhase = currentIndex >= totalBaseQuestions;
  const currentMeta = currentQuestion ? questionMetaMap[currentQuestion.id] : undefined;

  const progressPercent = Math.min(
    100,
    currentIndex < totalBaseQuestions
      ? Math.round(((currentIndex + 1) / totalBaseQuestions) * 85)
      : 85 + Math.min(14, (currentIndex - totalBaseQuestions + 1) * 5)
  );

  const formatINR = (amt: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amt);
  };

  const handleAnswer = (field: keyof BorrowerProfile, value: any) => {
    let parsedValue = value;
    if (value === 'true') parsedValue = true;
    if (value === 'false') parsedValue = false;
    if (field === 'variablePayPortionPercent' || field === 'emergencySavingsMonths' || field === 'businessVintageYears') {
      parsedValue = Number(value);
    }
    setProfile(prev => ({
      ...prev,
      [field]: parsedValue
    }));
  };

  const finishAssessment = (finalProfile: Partial<BorrowerProfile>) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('borrower_profile', JSON.stringify(finalProfile));
    }
    router.push('/results');
  };

  const handleNext = async () => {
    if (currentIndex < questionQueue.length - 1) {
      setCurrentIndex(prev => prev + 1);
      return;
    }

    const answeredIds = questionQueue.map(q => q.id as string);
    const maxAdaptiveQuestions = 3;
    const adaptiveQuestionsAsked = questionQueue.length - totalBaseQuestions;

    if (adaptiveQuestionsAsked >= maxAdaptiveQuestions) {
      finishAssessment(profile);
      return;
    }

    setIsSelecting(true);

    try {
      const decision = await determineNextQuestion(profile, answeredIds);

      if (decision.shouldStop || !decision.question) {
        finishAssessment(profile);
        return;
      }

      setQuestionQueue(prev => [...prev, decision.question!]);
      setQuestionMetaMap(prev => ({
        ...prev,
        [decision.question!.id]: {
          reason: decision.reason,
          source: decision.source,
        }
      }));
      setCurrentIndex(prev => prev + 1);
    } catch (err) {
      console.error('Question selection error:', err);
      finishAssessment(profile);
    } finally {
      setIsSelecting(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    if (currentQuestion?.id === 'creditScoreStatus') {
      handleAnswer('creditScoreStatus', 'unknown');
    }
    handleNext();
  };

  if (!currentQuestion) return null;

  const currentValue = profile[currentQuestion.id as keyof BorrowerProfile] ?? currentQuestion.defaultValue;
  const isAiSelected = currentMeta?.source === 'ai_groq';

  return (
    <div className="w-full max-w-[1280px] mx-auto px-5 lg:px-16 py-8 flex flex-col justify-between min-h-[88vh]">
      <div>
        {/* Top Navbar */}
        <div className="flex items-center justify-between mb-6">
          <Link 
            href="/"
            className="flex items-center gap-2 font-display text-[20px] text-[#171717] tracking-tight"
          >
            <Avatar size={26} name="BorrowIQ" variant="pixel" colors={["#5769e7", "#171717", "#f3ede7", "#52ad6e", "#d5daf7"]} />
            BorrowIQ
          </Link>

          <div className="flex items-center gap-2">
            {isAdaptivePhase && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white text-[#171717] border border-[#ebeae8]">
                {isAiSelected ? 'AI Adaptive Analysis' : 'Adaptive Assessment'}
              </span>
            )}
            <span className="text-xs font-semibold text-[#171717] px-3 py-1 rounded-full bg-white border border-[#ebeae8]">
              Step {currentIndex + 1}
            </span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div 
          role="progressbar" 
          aria-valuenow={progressPercent} 
          aria-valuemin={0} 
          aria-valuemax={100}
          className="w-full h-1.5 bg-[#dedcd9] rounded-full overflow-hidden mb-8"
        >
          <div 
            className="h-full bg-[#171717] transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Adaptive Rationale Banner */}
        {currentMeta?.reason && (
          <div className="mb-6 p-4 rounded-2xl bg-white border border-[#ebeae8] flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-[#5769e7] mt-1.5 shrink-0" />
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider block text-[#5d5b59]">
                {isAiSelected ? 'Prioritized by AI Question Selector' : 'Adaptive Underwriting Check'}
              </span>
              <p className="text-xs text-[#171717] font-medium leading-relaxed mt-0.5">
                {currentMeta.reason}
              </p>
            </div>
          </div>
        )}

        {/* Flexed Bento Grid for Assessment */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Question Bento Card (8 Cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 border border-[#ebeae8] shadow-sm flex flex-col justify-between min-h-[460px]">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#171717] leading-tight tracking-tight mb-2">
                {currentQuestion.title}
              </h1>

              <div className="py-6">
                <InputControls 
                  currentQuestion={currentQuestion} 
                  currentValue={currentValue} 
                  handleAnswer={handleAnswer} 
                  formatINR={formatINR} 
                />
              </div>
            </div>

            {/* Navigation inside card */}
            <div className="pt-6 border-t border-[#ebeae8] flex items-center justify-between gap-4">
              {currentIndex > 0 ? (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold bg-[#f7f6f4] hover:bg-[#ebeae8] text-[#171717] cursor-pointer transition-colors"
                >
                  Previous
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-3">
                {currentQuestion.canSkip && (
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="text-xs font-semibold text-[#747371] hover:text-[#171717] px-3 py-2 cursor-pointer transition-colors"
                  >
                    Skip
                  </button>
                )}

                <button
                  type="button"
                  disabled={isSelecting}
                  onClick={handleNext}
                  className="px-7 py-3 rounded-full text-xs font-semibold bg-[#5769e7] hover:bg-[#4958be] text-white cursor-pointer shadow-sm active:scale-98 transition-all disabled:opacity-75"
                >
                  {isSelecting ? (
                    'Evaluating...'
                  ) : (
                    isAdaptivePhase && currentIndex === questionQueue.length - 1 
                      ? 'Calculate My Position' 
                      : 'Continue'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Live Summary Bento Column (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Live Parameter Tile */}
            <div className="bg-white rounded-3xl p-6 border border-[#ebeae8] shadow-sm space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5d5b59] block">
                Parameters Registered
              </span>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-[#f7f6f4] flex justify-between">
                  <span className="text-[#747371]">Target Loan</span>
                  <span className="font-semibold text-[#171717]">{formatINR(profile.requestedAmount || 500000)}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#f7f6f4] flex justify-between">
                  <span className="text-[#747371]">Monthly Income</span>
                  <span className="font-semibold text-[#171717]">{formatINR(profile.netMonthlyIncome || 75000)}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#f7f6f4] flex justify-between">
                  <span className="text-[#747371]">Existing EMIs</span>
                  <span className="font-semibold text-[#171717]">{formatINR(profile.existingMonthlyEMI || 0)}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#f7f6f4] flex justify-between">
                  <span className="text-[#747371]">Credit Score</span>
                  <span className="font-semibold text-[#171717]">
                    {profile.creditScoreStatus === '750_plus' ? '750+' : profile.creditScoreStatus === 'unknown' ? 'Unknown' : profile.creditScoreStatus || 'Evaluating'}
                  </span>
                </div>
              </div>
            </div>

            {/* Privacy Tile */}
            <div className="bg-white rounded-3xl p-6 border border-[#ebeae8] shadow-sm text-xs space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5d5b59] block">
                Privacy Standard
              </span>
              <p className="text-[#5d5b59] leading-relaxed">
                Calculations execute entirely in your browser. No credit bureau pulls, no telephone inquiries, and zero database tracking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

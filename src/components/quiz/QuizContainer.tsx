'use client';

import React, { useState, useRef } from 'react';
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
    primaryIncomeSignal: 'salaried_corporate',
  });

  const [questionQueue, setQuestionQueue] = useState<RegisteredQuestion[]>(() => {
    return BASE_QUESTION_IDS.map(id => QUESTION_REGISTRY[id]).filter(Boolean);
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionMetaMap, setQuestionMetaMap] = useState<Record<string, QuestionMeta>>({});
  const [isSelecting, setIsSelecting] = useState(false);
  const [prefetched, setPrefetched] = useState<{ key: string; decision: NextQuestionResult } | null>(null);
  const prefetchingRef = useRef(false);

  const currentQuestion = questionQueue[currentIndex];
  const totalBaseQuestions = BASE_QUESTION_IDS.length;
  const isAdaptivePhase = currentIndex >= totalBaseQuestions;
  const currentMeta = currentQuestion ? questionMetaMap[currentQuestion.id] : undefined;

  const PROGRESS_MAP = [12, 24, 36, 48, 60, 72, 84, 92, 96, 98, 100];
  const progressPercent = isSelecting
    ? Math.min(99, (PROGRESS_MAP[Math.min(currentIndex, PROGRESS_MAP.length - 1)] || 50) + 4)
    : (PROGRESS_MAP[Math.min(currentIndex, PROGRESS_MAP.length - 1)] || 95);

  const formatINR = (amt: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amt);
  };

  const prefetchNextQuestion = async (currProfile: Partial<BorrowerProfile>, currQueue: RegisteredQuestion[]) => {
    if (currQueue.length < totalBaseQuestions) return;
    const answeredIds = currQueue.map(q => q.id as string);
    const key = JSON.stringify(currProfile);
    if (prefetchingRef.current) return;
    prefetchingRef.current = true;
    try {
      const decision = await determineNextQuestion(currProfile, answeredIds);
      if (decision && decision.question) {
        setPrefetched({ key, decision });
      }
    } catch {
      // silent fallback
    } finally {
      prefetchingRef.current = false;
    }
  };

  const handleAnswer = (field: keyof BorrowerProfile, value: any) => {
    let parsedValue = value;
    if (value === 'true') parsedValue = true;
    if (value === 'false') parsedValue = false;
    if (field === 'variablePayPortionPercent' || field === 'emergencySavingsMonths' || field === 'businessVintageYears') {
      parsedValue = Number(value);
    }
    const updated = {
      ...profile,
      [field]: parsedValue
    };
    setProfile(updated);

    // Trigger non-blocking background prefetch for near-zero click latency
    if (currentIndex >= totalBaseQuestions - 1) {
      prefetchNextQuestion(updated, questionQueue);
    }
  };

  const finishAssessment = (finalProfile: Partial<BorrowerProfile>) => {
    const completeProfile: BorrowerProfile = {
      loanPurpose: finalProfile.loanPurpose || 'wedding_personal',
      requestedAmount: finalProfile.requestedAmount || 500000,
      age: finalProfile.age || 30,
      primaryIncomeSignal: finalProfile.primaryIncomeSignal || 'salaried_corporate',
      netMonthlyIncome: finalProfile.netMonthlyIncome || 50000,
      existingMonthlyEMI: finalProfile.existingMonthlyEMI || 0,
      householdLivingExpenses: finalProfile.householdLivingExpenses || 25000,
      creditScoreStatus: finalProfile.creditScoreStatus || 'unknown',
      ...finalProfile,
    } as BorrowerProfile;

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('borrower_profile', JSON.stringify(completeProfile));
    }
    router.push('/results');
  };

  const handleNext = async () => {
    const answeredValue = profile[currentQuestion.id as keyof BorrowerProfile] ?? currentQuestion.defaultValue;
    const updatedProfile = {
      ...profile,
      [currentQuestion.id]: answeredValue,
    };
    setProfile(updatedProfile);

    if (currentIndex < questionQueue.length - 1) {
      setCurrentIndex(prev => prev + 1);
      return;
    }

    const answeredIds = questionQueue.map(q => q.id as string);
    const maxAdaptiveQuestions = 5;
    const adaptiveQuestionsAsked = questionQueue.length - totalBaseQuestions;

    if (adaptiveQuestionsAsked >= maxAdaptiveQuestions) {
      finishAssessment(updatedProfile);
      return;
    }

    // Check if prefetch resolved for instantaneous transition
    const profileKey = JSON.stringify(updatedProfile);
    if (prefetched && prefetched.key === profileKey && prefetched.decision.question) {
      const decision = prefetched.decision;
      setQuestionQueue(prev => [...prev, decision.question!]);
      setQuestionMetaMap(prev => ({
        ...prev,
        [decision.question!.id]: {
          reason: decision.reason,
          source: decision.source,
        }
      }));
      setPrefetched(null);
      setCurrentIndex(prev => prev + 1);
      return;
    }

    setIsSelecting(true);

    try {
      const decision = await determineNextQuestion(updatedProfile, answeredIds);

      if (decision.shouldStop || !decision.question) {
        finishAssessment(updatedProfile);
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
      finishAssessment(updatedProfile);
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
      handleNext();
      return;
    }
    if (isAdaptivePhase) {
      finishAssessment(profile);
      return;
    }
    handleNext();
  };

  if (!currentQuestion) return null;

  const currentValue = profile[currentQuestion.id as keyof BorrowerProfile] ?? currentQuestion.defaultValue;
  const isAiSelected = currentMeta?.source === 'ai_groq';

  return (
    <div className="w-full max-w-2xl mx-auto px-5 py-6 sm:py-10 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-5">
          <Link 
            href="/"
            className="flex items-center gap-2 font-display text-[20px] text-[#171717] tracking-tight"
          >
            <Avatar size={26} name="BorrowIQ" variant="pixel" colors={["#5769e7", "#171717", "#f3ede7", "#52ad6e", "#d5daf7"]} />
            BorrowIQ
          </Link>

          <div className="flex items-center gap-2">
            {isAdaptivePhase ? (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white text-[#171717] border border-[#ebeae8]">
                {isAiSelected ? 'Adaptive Tightening (Groq gpt-oss-120b)' : 'Adaptive Tightening'}
              </span>
            ) : (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white text-[#5d5b59] border border-[#ebeae8]">
                Must Question
              </span>
            )}
            <span className="text-xs font-semibold text-[#171717] px-3 py-1 rounded-full bg-white border border-[#ebeae8]">
              {isAdaptivePhase 
                ? `Tightening Q${currentIndex - totalBaseQuestions + 1}` 
                : `Step ${currentIndex + 1} of ${totalBaseQuestions}`}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div 
          role="progressbar" 
          aria-valuenow={progressPercent} 
          aria-valuemin={0} 
          aria-valuemax={100}
          className="w-full h-1.5 bg-[#dedcd9] rounded-full overflow-hidden mb-6"
        >
          <div 
            className="h-full bg-[#5769e7] transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        {/* Adaptive Rationale Banner */}
        {currentMeta?.reason && (
          <div className="mb-6 p-4 rounded-2xl bg-white border border-[#ebeae8] flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-[#5769e7] mt-1.5 shrink-0" />
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider block text-[#5d5b59]">
                {isAiSelected ? 'Prioritized by Groq gpt-oss-120b' : 'Adaptive Underwriting Check'}
              </span>
              <p className="text-xs text-[#171717] font-medium leading-relaxed mt-0.5">
                {currentMeta.reason}
              </p>
            </div>
          </div>
        )}

        {/* Main Questionnaire Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#ebeae8] shadow-sm min-h-[360px] flex flex-col justify-center">
          {isSelecting ? (
            <div className="py-8 sm:py-12 flex flex-col items-center justify-center text-center">
              <div className="relative mb-5">
                <div className="w-16 h-16 rounded-2xl bg-[#f7f6f4] border border-[#ebeae8] flex items-center justify-center shadow-xs">
                  <Avatar size={40} name="BorrowIQ" variant="pixel" colors={["#5769e7", "#171717", "#f3ede7", "#52ad6e", "#d5daf7"]} />
                </div>
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5769e7] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#5769e7]"></span>
                </span>
              </div>

              <h2 className="text-xl font-bold text-[#171717] tracking-tight mb-2">
                Analyzing Risk Signals
              </h2>
              <p className="text-xs text-[#5d5b59] max-w-sm leading-relaxed mb-6">
                BorrowIQ underwriter is evaluating your profile with openai/gpt-oss-120b to select the most impactful risk question...
              </p>

              {/* Animated progress bar */}
              <div className="w-56 h-1.5 bg-[#ebeae8] rounded-full overflow-hidden">
                <div className="h-full bg-[#5769e7] rounded-full animate-pulse w-full" />
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#747371]">
                  {isAdaptivePhase ? 'Adaptive Question · Range Tightening' : `Must Question ${currentIndex + 1} of ${totalBaseQuestions}`}
                </span>
                <span className="text-xs font-mono text-[#747371]">
                  Q{currentIndex + 1}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-[#171717] leading-tight tracking-tight mb-2">
                {currentQuestion.title}
              </h1>

              <div className="py-4 sm:py-6">
                <InputControls 
                  currentQuestion={currentQuestion} 
                  currentValue={currentValue} 
                  handleAnswer={handleAnswer} 
                  formatINR={formatINR} 
                />
              </div>
            </div>
          )}
        </div>

        {/* Navigation controls outside the card */}
        {!isSelecting && (
          <div className="mt-6 flex items-center justify-between gap-4">
            {currentIndex > 0 ? (
              <button
                type="button"
                onClick={handlePrevious}
                className="px-5 py-2.5 rounded-full text-xs font-semibold bg-white border border-[#ebeae8] hover:bg-[#f7f6f4] text-[#171717] cursor-pointer transition-colors shadow-xs"
              >
                Previous
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-3">
              {(currentQuestion.canSkip || isAdaptivePhase || currentIndex === totalBaseQuestions - 1) && (
                <button
                  type="button"
                  onClick={handleSkip}
                  className="text-xs font-semibold text-[#747371] hover:text-[#171717] px-3 py-2 cursor-pointer transition-colors"
                >
                  {isAdaptivePhase || currentIndex === totalBaseQuestions - 1 
                    ? 'Calculate My Position (Wide Band)' 
                    : 'Skip'}
                </button>
              )}

              <button
                type="button"
                onClick={handleNext}
                className="px-7 py-3 rounded-full text-xs font-semibold bg-[#5769e7] hover:bg-[#4958be] text-white cursor-pointer shadow-sm active:scale-98 transition-all"
              >
                {isAdaptivePhase && currentIndex === questionQueue.length - 1 
                  ? 'Calculate My Position' 
                  : (currentIndex === totalBaseQuestions - 1 ? 'Tighten My Range' : 'Continue')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

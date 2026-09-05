'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BorrowerProfile, QuizQuestion } from '@/lib/types';
import { BASE_QUESTION_IDS, QUESTION_REGISTRY, RegisteredQuestion } from '@/lib/questions/registry';
import { determineNextQuestion } from '@/lib/questions/selector';
import Avatar from 'boring-avatars';
import { 
  ArrowLeft01Icon, 
  ArrowRight01Icon, 
  InfoCircleIcon 
} from '@/components/icons';
import { InputControls } from '@/components/quiz/InputControls';

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

  // Questions queue that grows as AI selects next questions
  const [questionQueue, setQuestionQueue] = useState<RegisteredQuestion[]>(() => {
    return BASE_QUESTION_IDS.map(id => QUESTION_REGISTRY[id]).filter(Boolean);
  });

  // Current index in questionQueue
  const [currentIndex, setCurrentIndex] = useState(0);

  // Tracks why AI selected this question (mapped by questionId)
  const [aiRationaleMap, setAiRationaleMap] = useState<Record<string, string>>({});

  // Loading state when AI is selecting next question
  const [isAiSelecting, setIsAiSelecting] = useState(false);
  const [aiStatusMessage, setAiStatusMessage] = useState('Evaluating profile...');

  const currentQuestion = questionQueue[currentIndex];
  const totalBaseQuestions = BASE_QUESTION_IDS.length;
  const isAdaptivePhase = currentIndex >= totalBaseQuestions;

  // Approximate progress
  const progressPercent = Math.min(100, Math.round(((currentIndex + 1) / Math.max(questionQueue.length, 10)) * 100));

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
    // If we're not at the end of the current queue, simply advance
    if (currentIndex < questionQueue.length - 1) {
      setCurrentIndex(prev => prev + 1);
      return;
    }

    // We are at the end of the current queue.
    // Check if we need to ask AI for the next adaptive question!
    const answeredIds = questionQueue.map(q => q.id as string);
    const maxAdaptiveQuestions = 3;
    const adaptiveQuestionsAsked = questionQueue.length - totalBaseQuestions;

    if (adaptiveQuestionsAsked >= maxAdaptiveQuestions) {
      // Reached safe question limit
      finishAssessment(profile);
      return;
    }

    // Call AI selector
    setIsAiSelecting(true);
    setAiStatusMessage(
      adaptiveQuestionsAsked === 0 
        ? 'Analyzing base profile to identify highest-impact unknowns...' 
        : 'Recalculating risk metrics to determine next question...'
    );

    try {
      const decision = await determineNextQuestion(profile, answeredIds);

      if (decision.shouldStop || !decision.question) {
        // AI determined enough information is gathered
        finishAssessment(profile);
        return;
      }

      // Add selected question to queue
      setQuestionQueue(prev => [...prev, decision.question!]);
      setAiRationaleMap(prev => ({
        ...prev,
        [decision.question!.id]: decision.reason
      }));
      setCurrentIndex(prev => prev + 1);
    } catch (err) {
      console.error('Failed to select next question:', err);
      finishAssessment(profile);
    } finally {
      setIsAiSelecting(false);
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

  if (isAiSelecting) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-24 flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-[#5769e7]/10 border border-[#5769e7]/20 flex items-center justify-center animate-pulse">
          <Avatar size={36} name="BorrowIQ" variant="pixel" colors={["#5769e7", "#171717", "#f3ede7", "#52ad6e", "#d5daf7"]} />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-[#171717]">
            AI Adaptive Question Selector
          </h2>
          <p className="text-sm text-[#747371] max-w-md mx-auto leading-relaxed">
            {aiStatusMessage}
          </p>
        </div>
        <div className="w-48 h-1.5 bg-[#ebeae8] rounded-full overflow-hidden">
          <div className="h-full bg-[#5769e7] w-2/3 animate-[shimmer_1.5s_infinite] rounded-full" />
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  const currentValue = profile[currentQuestion.id as keyof BorrowerProfile] ?? currentQuestion.defaultValue;
  const aiRationale = aiRationaleMap[currentQuestion.id];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-6 flex flex-col justify-between min-h-[85vh]">
      <div>
        {/* Header bar */}
        <div className="flex items-center justify-between mb-4">
          <Link 
            href="/"
            className="flex items-center gap-2 font-display text-[20px] text-[#171717] tracking-tight"
          >
            <Avatar size={26} name="BorrowIQ" variant="pixel" colors={["#5769e7", "#171717", "#f3ede7", "#52ad6e", "#d5daf7"]} />
            BorrowIQ
          </Link>

          <div className="flex items-center gap-2 text-right">
            {isAdaptivePhase && (
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#5769e7]/10 text-[#5769e7] border border-[#5769e7]/20">
                AI Adaptive Phase
              </span>
            )}
            <span className="text-[13px] font-semibold text-[#171717]">
              Progress: {progressPercent}%
            </span>
          </div>
        </div>
        
        {/* Progress bar */}
        <div 
          role="progressbar" 
          aria-valuenow={progressPercent} 
          aria-valuemin={0} 
          aria-valuemax={100}
          className="w-full h-2 bg-[#dedcd9] rounded-full overflow-hidden mb-8"
        >
          <div 
            className="h-full bg-[#5769e7] transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* AI Selection Banner (Only shown when selected by AI) */}
        {aiRationale && (
          <div className="mb-6 p-4 rounded-2xl bg-[#f0f3ff] border border-[#5769e7]/30 flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-[#5769e7] mt-1.5 shrink-0" />
            <div>
              <span className="text-[11px] font-bold text-[#5769e7] uppercase tracking-wider block mb-0.5">
                Prioritized by AI Question Selector
              </span>
              <p className="text-xs text-[#323c7c] font-medium leading-relaxed">
                {aiRationale}
              </p>
            </div>
          </div>
        )}

        {/* Main Question Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#ebeae8] shadow-sm space-y-6">
          <div>
            <h1 className="text-2xl sm:text-[32px] font-semibold text-[#171717] leading-tight tracking-tight mb-2">
              {currentQuestion.title}
            </h1>
            {currentQuestion.subtitle && (
              <p className="text-[14px] text-[#747371] leading-relaxed">
                {currentQuestion.subtitle}
              </p>
            )}
          </div>

          <div className="py-2">
            <InputControls 
              currentQuestion={currentQuestion} 
              currentValue={currentValue} 
              handleAnswer={handleAnswer} 
              formatINR={formatINR} 
            />
          </div>

          {currentQuestion.whyWeAsk && (
            <div className="mt-2 pt-5 border-t border-[#ebeae8]">
              <p className="text-[13px] text-[#747371] leading-relaxed flex items-start gap-2">
                <InfoCircleIcon className="w-4 h-4 text-[#5769e7] shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  <strong className="text-[#171717] font-semibold">Why this matters: </strong>
                  {currentQuestion.whyWeAsk}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation footer */}
      <div className="pt-8 flex items-center justify-between gap-4">
        {currentIndex > 0 ? (
          <button
            type="button"
            onClick={handlePrevious}
            className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full text-[14px] font-semibold bg-white border border-[#dedcd9] hover:bg-[#f2f1f0] text-[#171717] cursor-pointer transition-colors"
          >
            <ArrowLeft01Icon className="w-4 h-4" aria-hidden="true" />
            <span>Previous</span>
          </button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-3">
          {currentQuestion.canSkip && (
            <button
              type="button"
              onClick={handleSkip}
              className="text-[14px] font-semibold text-[#747371] hover:text-[#171717] px-3 py-2 cursor-pointer transition-colors"
            >
              Don’t know? Skip
            </button>
          )}

          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-[15px] font-semibold bg-[#5769e7] hover:bg-[#4958be] text-white cursor-pointer shadow-sm active:scale-98 transition-all"
          >
            <span>
              {isAdaptivePhase && currentIndex === questionQueue.length - 1 
                ? 'Calculate My Position' 
                : 'Continue'}
            </span>
            <ArrowRight01Icon className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

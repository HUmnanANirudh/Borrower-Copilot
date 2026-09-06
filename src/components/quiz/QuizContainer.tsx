'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BorrowerProfile, QuizQuestion } from '@/lib/types';
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

  const [profile, setProfile] = useState<Partial<BorrowerProfile>>({});

  const [questionQueue, setQuestionQueue] = useState<RegisteredQuestion[]>(() => {
    return BASE_QUESTION_IDS.map(id => QUESTION_REGISTRY[id]).filter(Boolean);
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionMetaMap, setQuestionMetaMap] = useState<Record<string, QuestionMeta>>({});
  const [isSelecting, setIsSelecting] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(15);
  const [analysisStage, setAnalysisStage] = useState('Analyzing debt-to-income and cash-flow stability...');

  React.useEffect(() => {
    if (!isSelecting) return;

    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev < 45) {
          setAnalysisStage('Checking debt-to-income ratio and interest rate sensitivity...');
          return prev + 6;
        } else if (prev < 72) {
          setAnalysisStage('Evaluating archetype risk factors with AI underwriter...');
          return prev + 4;
        } else if (prev < 90) {
          setAnalysisStage('Formulating tailored range-tightening questions...');
          return prev + 2;
        }
        return prev;
      });
    }, 110);

    return () => clearInterval(interval);
  }, [isSelecting]);

  const currentQuestion = questionQueue[currentIndex];
  const totalBaseQuestions = BASE_QUESTION_IDS.length;
  const isAdaptivePhase = currentIndex >= totalBaseQuestions;
  const currentMeta = currentQuestion ? questionMetaMap[currentQuestion.id] : undefined;

  const progressPercent = isSelecting
    ? Math.min(98, Math.round(((currentIndex + 1) / (totalBaseQuestions + 1)) * 100) + 5)
    : isAdaptivePhase
      ? 95
      : Math.min(90, Math.round(((currentIndex + 1) / (totalBaseQuestions + 1)) * 100));

  const formatINR = (amt: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amt);
  };

  const handleAnswer = (field: keyof BorrowerProfile, value: string | number | boolean) => {
    let parsedValue: string | number | boolean = value;
    if (value === 'true') parsedValue = true;
    if (value === 'false') parsedValue = false;
    if (field === 'variablePayPortionPercent' || field === 'emergencySavingsMonths' || field === 'businessVintageYears' || field === 'professionalPracticeYears') {
      parsedValue = Number(value);
    }
    setProfile(prev => ({
      ...prev,
      [field]: parsedValue
    }));
  };

  const finishAssessment = (finalProfile: Partial<BorrowerProfile>) => {
    const completeProfile: BorrowerProfile = {
      loanPurpose: finalProfile.loanPurpose || 'wedding_personal',
      requestedAmount: finalProfile.requestedAmount || 500000,
      age: finalProfile.age || 30,
      primaryIncomeSignal: finalProfile.primaryIncomeSignal || 'salaried_corporate',
      netMonthlyIncome: finalProfile.netMonthlyIncome || 75000,
      existingMonthlyEMI: finalProfile.existingMonthlyEMI ?? 0,
      householdLivingExpenses: finalProfile.householdLivingExpenses || Math.round((finalProfile.netMonthlyIncome || 75000) * 0.35),
      creditScoreStatus: finalProfile.creditScoreStatus || 'unknown',
      ...finalProfile,
    } as BorrowerProfile;

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('borrower_profile', JSON.stringify(completeProfile));
    }
    router.push('/results');
  };

  const getDefaultValue = (q: QuizQuestion, currentProf: Partial<BorrowerProfile>) => {
    if (q.id === 'householdLivingExpenses' && currentProf.netMonthlyIncome) {
      const calculated = Math.round((currentProf.netMonthlyIncome * 0.35) / 2500) * 2500;
      const minVal = typeof q.min === 'number' ? q.min : 10000;
      const maxVal = typeof q.max === 'number' ? q.max : 500000;
      const capVal = typeof q.defaultValue === 'number' ? q.defaultValue : 30000;
      return Math.min(capVal, Math.max(minVal, Math.min(maxVal, calculated)));
    }
    return q.defaultValue;
  };

  const handleNext = async () => {
    const defaultVal = getDefaultValue(currentQuestion, profile);
    const answeredValue = currentQuestion.inputType === 'choice_pill'
      ? profile[currentQuestion.id as keyof BorrowerProfile]
      : (profile[currentQuestion.id as keyof BorrowerProfile] ?? defaultVal);
    
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
    const maxAdaptiveQuestions = 2;
    const adaptiveQuestionsAsked = questionQueue.length - totalBaseQuestions;

    if (adaptiveQuestionsAsked >= maxAdaptiveQuestions) {
      finishAssessment(updatedProfile);
      return;
    }

    setAnalysisProgress(20);
    setAnalysisStage('Evaluating cash-flow stability and living cost floors...');
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
    if (isAdaptivePhase || currentIndex >= totalBaseQuestions - 1) {
      finishAssessment(profile);
      return;
    }
    handleNext();
  };

  if (!currentQuestion) return null;

  // Deliberate input: choice questions must NOT pre-select unless the user has chosen
  const currentValue = currentQuestion.inputType === 'choice_pill'
    ? profile[currentQuestion.id as keyof BorrowerProfile]
    : (profile[currentQuestion.id as keyof BorrowerProfile] ?? getDefaultValue(currentQuestion, profile));

  const isChoiceAnswered = currentQuestion.inputType === 'choice_pill'
    ? (currentValue !== undefined && currentValue !== null)
    : true;

  return (
    <div className="w-full max-w-4xl mx-auto px-5 py-6 sm:py-10 flex flex-col justify-between">
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
            <span className="text-xs font-semibold text-[#171717] px-3.5 py-1 rounded-full bg-white border border-[#ebeae8] shadow-xs">
              {isAdaptivePhase 
                ? 'Adaptive Range Check' 
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
                Adaptive Underwriting Check
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
              </div>

              <h2 className="text-xl font-bold text-[#171717] tracking-tight mb-2">
                Analyzing Risk Signals
              </h2>

              {/* Real animated progress bar */}
              <div className="w-64 sm:w-80 h-2 bg-[#ebeae8] rounded-full overflow-hidden mb-3">
                <div 
                  className="h-full bg-[#5769e7] rounded-full transition-all duration-200 ease-out" 
                  style={{ width: `${Math.min(95, Math.round(analysisProgress))}%` }}
                />
              </div>

              <p className="text-xs text-[#747371] font-medium max-w-sm transition-all">
                {analysisStage}
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#747371]">
                  {isAdaptivePhase ? 'Adaptive Range Tightening' : 'Essential Intake'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-[#171717] leading-tight tracking-tight mb-2">
                {currentQuestion.title}
              </h1>

              {currentQuestion.subtitle && (
                <p className="text-xs sm:text-sm text-[#747371] leading-relaxed mb-4">
                  {currentQuestion.subtitle}
                </p>
              )}

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

            <div className="flex items-center gap-2 sm:gap-3">
              {(currentQuestion.canSkip || isAdaptivePhase || currentIndex === totalBaseQuestions - 1) && (
                <button
                  type="button"
                  onClick={handleSkip}
                  className="text-xs font-semibold text-[#747371] hover:text-[#171717] px-2.5 sm:px-3 py-2 cursor-pointer transition-colors"
                >
                  Skip
                </button>
              )}

              <button
                type="button"
                disabled={!isChoiceAnswered || isSelecting}
                onClick={handleNext}
                className={`px-5 sm:px-7 py-2.5 sm:py-3 rounded-full text-xs font-semibold shadow-sm transition-all ${
                  !isChoiceAnswered || isSelecting
                    ? 'bg-[#dedcd9] text-[#747371] cursor-not-allowed opacity-60'
                    : 'bg-[#5769e7] hover:bg-[#4958be] text-white cursor-pointer active:scale-98'
                }`}
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

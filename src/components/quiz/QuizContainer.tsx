'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BorrowerProfile, QuizQuestion } from '@/lib/types';
import { getPrioritizedQuestions, getContextTransition } from '@/lib/quizzing';
import Avatar from 'boring-avatars';
import { 
  ArrowLeft01Icon, 
  ArrowRight01Icon, 
  HelpCircleIcon, 
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

  const [currentStep, setCurrentStep] = useState(0);
  const [showWhyWeAsk, setShowWhyWeAsk] = useState(false);

  const activeQuestions = useMemo(() => {
    return getPrioritizedQuestions(profile);
  }, [profile]);

  const currentQuestion: QuizQuestion | undefined = activeQuestions[currentStep];
  const totalSteps = activeQuestions.length;
  const progressPercent = Math.min(100, Math.round(((currentStep + 1) / totalSteps) * 100));

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
    if (field === 'variablePayPortionPercent' || field === 'emergencySavingsMonths') {
      parsedValue = Number(value);
    }
    setProfile(prev => ({
      ...prev,
      [field]: parsedValue
    }));
  };

  const handleNext = () => {
    setShowWhyWeAsk(false);
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('borrower_profile', JSON.stringify(profile));
      }
      router.push('/results');
    }
  };

  const handlePrevious = () => {
    setShowWhyWeAsk(false);
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
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
  const contextMessage = getContextTransition(currentQuestion.id as string, profile);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-6 flex flex-col justify-between min-h-[85vh]">
      <div>
        <div className="flex items-center justify-between mb-4">
          <Link 
            href="/"
            className="flex items-center gap-2 font-display text-[20px] text-[#171717] tracking-tight"
          >
            <Avatar size={26} name="BorrowIQ" variant="pixel" colors={["#5769e7", "#171717", "#f3ede7", "#52ad6e", "#d5daf7"]} />
            BorrowIQ
          </Link>

          <div className="text-right">
            <span className="text-[13px] font-semibold text-[#171717]">
              Assessment progress: {progressPercent}%
            </span>
          </div>
        </div>
        
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

        {contextMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-[#e5e9ff]/70 border border-[#5769e7]/30 flex items-start gap-2.5">
            <InfoCircleIcon className="w-4 h-4 text-[#5769e7] mt-0.5 shrink-0" aria-hidden="true" />
            <p className="text-xs text-[#323c7c] font-medium leading-relaxed">
              {contextMessage}
            </p>
          </div>
        )}

        {/* Main Question Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#ebeae8] shadow-sm space-y-6">
          {/* Question Title */}
          <div>
            <h1 className="text-2xl sm:text-[32px] font-semibold text-[#171717] leading-tight tracking-tight mb-2">
              {currentQuestion.title}
            </h1>
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
              <p className="text-[13px] text-[#747371] leading-relaxed flex gap-2">
                <span className="font-semibold text-[#5769e7]">Why we ask:</span>
                {currentQuestion.whyWeAsk}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="pt-8 flex items-center justify-between gap-4">
        {currentStep > 0 ? (
          <button
            type="button"
            onClick={handlePrevious}
            className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full text-[14px] font-semibold bg-white border border-[#dedcd9] hover:bg-[#f2f1f0] text-[#171717] cursor-pointer"
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
            <span>{currentStep === totalSteps - 1 ? 'Calculate My Position' : 'Continue'}</span>
            <ArrowRight01Icon className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

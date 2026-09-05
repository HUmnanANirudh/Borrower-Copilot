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

export function QuizContainer() {
  const router = useRouter();

  // Initial borrower profile state
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

  // Dynamic prioritized questions from information-value engine
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
      // Assessment complete: store profile in sessionStorage and route to /results
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
    <div className="w-full max-w-2xl mx-auto px-4 py-8 sm:py-12 flex flex-col justify-between min-h-[85vh]">
      {/* Top Header Bar */}
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
            <span className="text-[11px] text-[#747371] block">
              Usually takes ~2–3 minutes
            </span>
          </div>
        </div>

        {/* Progress Bar */}
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

        {/* Smart Context Transition Notice */}
        {contextMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-[#e5e9ff]/70 border border-[#5769e7]/30 flex items-start gap-2.5">
            <InfoCircleIcon className="w-4 h-4 text-[#5769e7] mt-0.5 shrink-0" aria-hidden="true" />
            <p className="text-xs text-[#323c7c] font-medium leading-relaxed">
              {contextMessage}
            </p>
          </div>
        )}

        {/* Main Question Card (Mentimeter Presentation Style) */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#ebeae8] shadow-sm space-y-6">
          {/* Question Title & Subtitle */}
          <div>
            <h1 className="font-display text-[32px] sm:text-[40px] lg:text-[48px] font-normal text-[#171717] leading-[0.9] tracking-[-0.02em] uppercase mb-2">
              {currentQuestion.title}
            </h1>
            <p className="text-[15px] sm:text-[16px] text-[#5d5b59] leading-relaxed">
              {currentQuestion.subtitle}
            </p>
          </div>

          {/* Input Control Surfaces */}
          <div className="py-2">
            {/* 1. Choice Pills */}
            {currentQuestion.inputType === 'choice_pill' && currentQuestion.options && (
              <div className="grid grid-cols-1 gap-2.5">
                {currentQuestion.options.map((opt) => {
                  const isSelected = String(currentValue) === String(opt.value);
                  return (
                    <button
                      key={String(opt.value)}
                      type="button"
                      onClick={() => handleAnswer(currentQuestion.id as keyof BorrowerProfile, opt.value)}
                      className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-[#5769e7] bg-[#e5e9ff]/40 ring-2 ring-[#5769e7]/20 shadow-xs'
                          : 'border-[#dedcd9] bg-[#fcfbf9] hover:bg-[#f2f1f0]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[15px] font-semibold ${isSelected ? 'text-[#323c7c]' : 'text-[#171717]'}`}>
                            {opt.label}
                          </span>
                          {opt.badge && (
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-white border border-[#dedcd9] text-[#5769e7]">
                              {opt.badge}
                            </span>
                          )}
                        </div>
                        {opt.description && (
                          <p className="text-xs text-[#747371] mt-0.5">{opt.description}</p>
                        )}
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-[#5769e7] bg-[#5769e7]' : 'border-[#dedcd9] bg-white'
                      }`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* 2. Currency Slider */}
            {currentQuestion.inputType === 'currency_slider' && (
              <div className="space-y-6 pt-2">
                <div className="text-center py-6 bg-[#f7f6f4] rounded-2xl border border-[#ebeae8]">
                  <span className="font-display text-[40px] sm:text-[48px] text-[#171717] leading-none">
                    {formatINR(Number(currentValue))}
                  </span>
                  <span className="text-[13px] font-medium text-[#747371] block mt-1">
                    {Number(currentValue) >= 100000 
                      ? `₹${(Number(currentValue) / 100000).toFixed(2)} Lakhs` 
                      : ''}
                  </span>
                </div>

                <input
                  type="range"
                  min={currentQuestion.min ?? 10000}
                  max={currentQuestion.max ?? 5000000}
                  step={currentQuestion.step ?? 10000}
                  value={Number(currentValue)}
                  onChange={(e) => handleAnswer(currentQuestion.id as keyof BorrowerProfile, Number(e.target.value))}
                  className="w-full h-2 bg-[#ebeae8] rounded-lg appearance-none cursor-pointer accent-[#5769e7]"
                />

                <div className="flex justify-between text-[13px] text-[#747371] font-medium">
                  <span>{formatINR(currentQuestion.min ?? 10000)}</span>
                  <span>{formatINR(currentQuestion.max ?? 5000000)}</span>
                </div>
              </div>
            )}

            {/* 3. Number Stepper */}
            {currentQuestion.inputType === 'number_stepper' && (
              <div className="flex items-center justify-center gap-8 py-6">
                <button
                  type="button"
                  onClick={() => {
                    const nextVal = Math.max((currentQuestion.min ?? 1), Number(currentValue) - 1);
                    handleAnswer(currentQuestion.id as keyof BorrowerProfile, nextVal);
                  }}
                  className="w-14 h-14 rounded-full border border-[#ebeae8] bg-[#f7f6f4] hover:bg-[#f2f1f0] text-2xl text-[#171717] flex items-center justify-center cursor-pointer transition-colors"
                >
                  -
                </button>

                <div className="text-center min-w-[140px]">
                  <span className="font-display text-[48px] text-[#171717] leading-none">
                    {currentValue}
                  </span>
                  <span className="text-[13px] font-medium text-[#747371] block mt-1">
                    {currentQuestion.id === 'age' ? 'Years Old' : 'Years Active'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const nextVal = Math.max((currentQuestion.max ?? 65), Number(currentValue) + 1);
                    handleAnswer(currentQuestion.id as keyof BorrowerProfile, nextVal);
                  }}
                  className="w-14 h-14 rounded-full border border-[#ebeae8] bg-[#f7f6f4] hover:bg-[#f2f1f0] text-2xl text-[#171717] flex items-center justify-center cursor-pointer transition-colors"
                >
                  +
                </button>
              </div>
            )}
          </div>

          {/* "Why are we asking?" Micro-disclosure */}
          {currentQuestion.whyWeAsk && (
            <div className="pt-2 border-t border-[#dedcd9]">
              <button
                type="button"
                onClick={() => setShowWhyWeAsk(!showWhyWeAsk)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5769e7] hover:underline cursor-pointer"
              >
                <HelpCircleIcon className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{showWhyWeAsk ? 'Hide explanation' : 'Why are we asking this?'}</span>
              </button>
              {showWhyWeAsk && (
                <p className="mt-2 text-xs text-[#5d5b59] bg-[#fcfbf9] p-3 rounded-xl border border-[#dedcd9] leading-relaxed">
                  {currentQuestion.whyWeAsk}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation Buttons */}
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

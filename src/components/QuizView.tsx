'use client';

import React, { useState } from 'react';
import { BorrowerProfile, QuizQuestion } from '@/lib/types';
import { ArrowLeft01Icon, ArrowRight01Icon, SparklesIcon } from '@hugeicons/react';

interface QuizViewProps {
  questions: QuizQuestion[];
  currentStep: number;
  profile: Partial<BorrowerProfile>;
  onAnswer: (field: keyof BorrowerProfile, value: any) => void;
  onPrevious: () => void;
  onNext: () => void;
  isSubmitting?: boolean;
}

export function QuizView({
  questions,
  currentStep,
  profile,
  onAnswer,
  onPrevious,
  onNext,
  isSubmitting = false
}: QuizViewProps) {
  const currentQuestion = questions[currentStep];
  const totalSteps = questions.length;
  const progressPercent = Math.round(((currentStep + 1) / totalSteps) * 100);

  if (!currentQuestion) return null;

  const currentValue = profile[currentQuestion.id as keyof BorrowerProfile] ?? currentQuestion.defaultValue;

  const handlePillSelect = (value: any) => {
    // If boolean question represented as string, convert
    let parsedValue = value;
    if (value === 'true') parsedValue = true;
    if (value === 'false') parsedValue = false;
    if (currentQuestion.id === 'variablePayPercent' || currentQuestion.id === 'emergencySavingsMonths') {
      parsedValue = Number(value);
    }
    onAnswer(currentQuestion.id as keyof BorrowerProfile, parsedValue);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onAnswer(currentQuestion.id as keyof BorrowerProfile, Number(e.target.value));
  };

  const isLastQuestion = currentStep === totalSteps - 1;

  // Format currency in Indian Lakhs / Crores
  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8">
      {/* Progress & Breadcrumbs */}
      <div className="mb-6 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f2f1f0] border border-[#dedcd9] text-xs font-semibold text-[#171717]">
          {currentQuestion.isAdaptive ? (
            <span className="flex items-center gap-1 text-[#5769e7]">
              <SparklesIcon className="w-3.5 h-3.5" />
              Adaptive Deep-Dive
            </span>
          ) : (
            <span>Base Profile</span>
          )}
          <span className="text-[#a09f9d]">·</span>
          <span>Question {currentStep + 1} of {totalSteps}</span>
        </div>
        <span className="text-xs font-semibold text-[#5d5b59]">{progressPercent}%</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-[#ebeae8] rounded-full overflow-hidden mb-8">
        <div 
          className="h-full bg-[#5769e7] transition-all duration-300 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Question Card Frame */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#dedcd9] menti-card-shadow transition-all space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight leading-tight">
            {currentQuestion.title}
          </h2>
          {currentQuestion.subtitle && (
            <p className="text-sm text-[#5d5b59] mt-2 leading-relaxed">
              {currentQuestion.subtitle}
            </p>
          )}
        </div>

        {/* Input Rendering by Type */}
        <div className="pt-2">
          {/* Choice Pills */}
          {currentQuestion.inputType === 'choice_pill' && currentQuestion.options && (
            <div className="space-y-2.5">
              {currentQuestion.options.map((opt) => {
                const isSelected = String(currentValue) === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handlePillSelect(opt.value)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#e5e9ff]/50 border-[#5769e7] ring-2 ring-[#5769e7]/20'
                        : 'bg-white border-[#dedcd9] hover:bg-[#fcfbf9] hover:border-[#a09f9d]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${isSelected ? 'text-[#323c7c]' : 'text-[#171717]'}`}>
                          {opt.label}
                        </span>
                        {opt.badge && (
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#f2f1f0] text-[#5d5b59] border border-[#dedcd9]">
                            {opt.badge}
                          </span>
                        )}
                      </div>
                      {opt.description && (
                        <p className="text-xs text-[#5d5b59] mt-0.5">{opt.description}</p>
                      )}
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-[#5769e7] bg-[#5769e7] text-white' : 'border-[#dedcd9]'
                    }`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Currency Slider */}
          {currentQuestion.inputType === 'currency_slider' && (
            <div className="space-y-6 py-2">
              <div className="text-center">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#171717] tracking-tight">
                  {formatINR(Number(currentValue) || 0)}
                </span>
                {currentQuestion.id === 'requestedAmount' && (
                  <p className="text-xs text-[#5d5b59] mt-1 font-medium">
                    {Number(currentValue) >= 100000 ? `₹${(Number(currentValue) / 100000).toFixed(1)} Lakhs` : ''}
                  </p>
                )}
              </div>

              <input
                type="range"
                min={currentQuestion.min}
                max={currentQuestion.max}
                step={currentQuestion.step}
                value={Number(currentValue) || currentQuestion.min}
                onChange={handleSliderChange}
                className="w-full h-2.5 bg-[#dedcd9] rounded-lg appearance-none cursor-pointer accent-[#5769e7]"
              />

              {/* Quick Jump Buttons */}
              <div className="flex flex-wrap gap-2 justify-center">
                {currentQuestion.id === 'requestedAmount' && [200000, 500000, 800000, 1500000, 2500000].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => onAnswer('requestedAmount', amt)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer ${
                      Number(currentValue) === amt
                        ? 'bg-[#5769e7] text-white border-[#5769e7]'
                        : 'bg-[#f2f1f0] text-[#171717] border-[#dedcd9] hover:bg-[#ebeae8]'
                    }`}
                  >
                    ₹{(amt / 100000)}L
                  </button>
                ))}

                {currentQuestion.id === 'netMonthlyIncome' && [30000, 50000, 80000, 120000, 200000].map(inc => (
                  <button
                    key={inc}
                    type="button"
                    onClick={() => onAnswer('netMonthlyIncome', inc)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer ${
                      Number(currentValue) === inc
                        ? 'bg-[#5769e7] text-white border-[#5769e7]'
                        : 'bg-[#f2f1f0] text-[#171717] border-[#dedcd9] hover:bg-[#ebeae8]'
                    }`}
                  >
                    ₹{(inc / 1000)}k/mo
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Number Stepper */}
          {currentQuestion.inputType === 'number_stepper' && (
            <div className="flex items-center justify-center gap-6 py-4">
              <button
                type="button"
                onClick={() => onAnswer(currentQuestion.id as keyof BorrowerProfile, Math.max(currentQuestion.min || 21, (Number(currentValue) || 30) - 1))}
                className="w-12 h-12 rounded-full border border-[#dedcd9] bg-[#f2f1f0] text-[#171717] text-xl font-bold hover:bg-[#ebeae8] cursor-pointer flex items-center justify-center active:scale-95"
              >
                -
              </button>
              <div className="text-center min-w-[100px]">
                <span className="text-4xl font-extrabold text-[#171717]">{currentValue}</span>
                <span className="text-sm font-semibold text-[#5d5b59] block">Years</span>
              </div>
              <button
                type="button"
                onClick={() => onAnswer(currentQuestion.id as keyof BorrowerProfile, Math.min(currentQuestion.max || 65, (Number(currentValue) || 30) + 1))}
                className="w-12 h-12 rounded-full border border-[#dedcd9] bg-[#f2f1f0] text-[#171717] text-xl font-bold hover:bg-[#ebeae8] cursor-pointer flex items-center justify-center active:scale-95"
              >
                +
              </button>
            </div>
          )}
        </div>

        {/* Navigation Controls */}
        <div className="pt-4 flex items-center justify-between border-t border-[#dedcd9]/60">
          <button
            type="button"
            onClick={onPrevious}
            disabled={currentStep === 0}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
              currentStep === 0
                ? 'opacity-30 cursor-not-allowed text-[#a09f9d]'
                : 'text-[#171717] bg-[#f2f1f0] hover:bg-[#ebeae8] border border-[#dedcd9]'
            }`}
          >
            <ArrowLeft01Icon className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#5769e7] hover:bg-[#4958be] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <span>{isLastQuestion ? 'Generate Safe Assessment' : 'Continue'}</span>
            <ArrowRight01Icon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

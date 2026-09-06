'use client';

import React from 'react';
import { BorrowerProfile, QuizQuestion, QuizOption } from '@/lib/types';

interface InputControlsProps {
  currentQuestion: QuizQuestion;
  currentValue: string | number | boolean | undefined;
  handleAnswer: (field: keyof BorrowerProfile, value: string | number | boolean) => void;
  formatINR: (amt: number) => string;
}

export function InputControls({
  currentQuestion,
  currentValue,
  handleAnswer,
  formatINR
}: InputControlsProps) {
  if (currentQuestion.inputType === 'choice_pill' && currentQuestion.options) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
        {currentQuestion.options.map((opt: QuizOption) => {
          const isSelected = currentValue !== undefined && currentValue !== null && String(currentValue) === String(opt.value);
          return (
            <button
              key={String(opt.value)}
              type="button"
              onClick={() => handleAnswer(currentQuestion.id as keyof BorrowerProfile, opt.value)}
              className={`w-full p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between min-h-[52px] sm:min-h-[58px] active:scale-[0.99] touch-manipulation ${
                isSelected
                  ? 'border-[#5769e7] bg-[#5769e7]/5 shadow-2xs ring-1 ring-[#5769e7]/30'
                  : 'border-[#ebeae8] bg-white hover:bg-[#f7f6f4] active:bg-[#f2f1f0]'
              }`}
            >
              <div className="pr-2">
                <span className="text-[13px] sm:text-[14px] font-semibold text-[#171717] leading-snug block">
                  {opt.label}
                </span>
                {opt.description && (
                  <p className="text-[11px] sm:text-xs text-[#747371] mt-0.5 leading-normal">{opt.description}</p>
                )}
              </div>
              <div className={`w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full border flex items-center justify-center shrink-0 ${
                isSelected ? 'border-[#5769e7] bg-[#5769e7]' : 'border-[#dedcd9] bg-white'
              }`}>
                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  if (currentQuestion.inputType === 'currency_slider') {
    return (
      <div className="space-y-4 sm:space-y-6 pt-1 sm:pt-2">
        <div className="text-center py-4 sm:py-6 px-3 bg-[#f7f6f4] rounded-2xl border border-[#ebeae8]">
          <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#171717] tracking-tight">
            {formatINR(Number(currentValue))}
          </span>
          <span className="text-[11px] sm:text-[12px] font-medium text-[#747371] block mt-0.5 sm:mt-1">
            {Number(currentValue) >= 100000 
              ? `₹${(Number(currentValue) / 100000).toFixed(2)} Lakhs` 
              : ''}
          </span>
        </div>

        <div className="px-1">
          <input
            type="range"
            min={currentQuestion.min ?? 10000}
            max={currentQuestion.max ?? 5000000}
            step={currentQuestion.step ?? 10000}
            value={Number(currentValue)}
            onChange={(e) => handleAnswer(currentQuestion.id as keyof BorrowerProfile, Number(e.target.value))}
            className="w-full h-3 sm:h-2.5 bg-[#ebeae8] rounded-lg appearance-none cursor-pointer accent-[#5769e7]"
          />

          <div className="flex justify-between text-[11px] sm:text-xs text-[#747371] font-medium pt-1.5">
            <span>{formatINR(currentQuestion.min ?? 10000)}</span>
            <span>{formatINR(currentQuestion.max ?? 5000000)}</span>
          </div>
        </div>
      </div>
    );
  }

  if (currentQuestion.inputType === 'number_stepper') {
    const safeMin = currentQuestion.min ?? 1;
    const safeMax = currentQuestion.max ?? 65;

    return (
      <div className="flex items-center justify-center gap-6 sm:gap-8 py-4 sm:py-6">
        <button
          type="button"
          onClick={() => {
            const nextVal = Math.max(safeMin, Number(currentValue) - 1);
            handleAnswer(currentQuestion.id as keyof BorrowerProfile, nextVal);
          }}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-[#ebeae8] bg-[#f7f6f4] hover:bg-[#ebeae8] active:scale-95 text-xl sm:text-2xl text-[#171717] flex items-center justify-center cursor-pointer transition-all touch-manipulation shadow-2xs"
        >
          -
        </button>

        <div className="text-center min-w-[100px] sm:min-w-[120px]">
          <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#171717] tracking-tight">
            {currentValue}
          </span>
          <span className="text-[11px] sm:text-xs font-medium text-[#747371] block mt-1">
            {currentQuestion.id === 'age' 
              ? 'Years Old' 
              : (currentQuestion.id === 'professionalPracticeYears' ? 'Years in Practice' : 'Years Active')}
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            const nextVal = Math.min(safeMax, Number(currentValue) + 1);
            handleAnswer(currentQuestion.id as keyof BorrowerProfile, nextVal);
          }}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-[#ebeae8] bg-[#f7f6f4] hover:bg-[#ebeae8] active:scale-95 text-xl sm:text-2xl text-[#171717] flex items-center justify-center cursor-pointer transition-all touch-manipulation shadow-2xs"
        >
          +
        </button>
      </div>
    );
  }

  return null;
}

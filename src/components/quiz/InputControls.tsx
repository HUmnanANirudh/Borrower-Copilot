'use client';

import React from 'react';
import { BorrowerProfile, QuizQuestion, QuizOption } from '@/lib/types';

interface InputControlsProps {
  currentQuestion: QuizQuestion;
  currentValue: any;
  handleAnswer: (field: keyof BorrowerProfile, value: any) => void;
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {currentQuestion.options.map((opt: QuizOption) => {
          const isSelected = String(currentValue) === String(opt.value);
          return (
            <button
              key={String(opt.value)}
              type="button"
              onClick={() => handleAnswer(currentQuestion.id as keyof BorrowerProfile, opt.value)}
              className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                isSelected
                  ? 'border-[#5769e7] bg-[#5769e7]/5 shadow-xs'
                  : 'border-[#ebeae8] bg-white hover:bg-[#f7f6f4]'
              }`}
            >
              <div>
                <span className="text-[14px] font-semibold text-[#171717]">
                  {opt.label}
                </span>
                {opt.description && (
                  <p className="text-xs text-[#747371] mt-0.5">{opt.description}</p>
                )}
              </div>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
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
      <div className="space-y-6 pt-2">
        <div className="text-center py-6 bg-[#f7f6f4] rounded-2xl border border-[#ebeae8]">
          <span className="text-3xl sm:text-4xl font-bold text-[#171717] tracking-tight">
            {formatINR(Number(currentValue))}
          </span>
          <span className="text-[12px] font-medium text-[#747371] block mt-1">
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

        <div className="flex justify-between text-xs text-[#747371] font-medium">
          <span>{formatINR(currentQuestion.min ?? 10000)}</span>
          <span>{formatINR(currentQuestion.max ?? 5000000)}</span>
        </div>
      </div>
    );
  }

  if (currentQuestion.inputType === 'number_stepper') {
    const safeMin = currentQuestion.min ?? 1;
    const safeMax = currentQuestion.max ?? 65;

    return (
      <div className="flex items-center justify-center gap-8 py-6">
        <button
          type="button"
          onClick={() => {
            const nextVal = Math.max(safeMin, Number(currentValue) - 1);
            handleAnswer(currentQuestion.id as keyof BorrowerProfile, nextVal);
          }}
          className="w-12 h-12 rounded-full border border-[#ebeae8] bg-[#f7f6f4] hover:bg-[#ebeae8] text-xl text-[#171717] flex items-center justify-center cursor-pointer transition-colors"
        >
          -
        </button>

        <div className="text-center min-w-[120px]">
          <span className="text-3xl sm:text-4xl font-bold text-[#171717] tracking-tight">
            {currentValue}
          </span>
          <span className="text-xs font-medium text-[#747371] block mt-1">
            {currentQuestion.id === 'age' ? 'Years Old' : 'Years Active'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            const nextVal = Math.min(safeMax, Number(currentValue) + 1);
            handleAnswer(currentQuestion.id as keyof BorrowerProfile, nextVal);
          }}
          className="w-12 h-12 rounded-full border border-[#ebeae8] bg-[#f7f6f4] hover:bg-[#ebeae8] text-xl text-[#171717] flex items-center justify-center cursor-pointer transition-colors"
        >
          +
        </button>
      </div>
    );
  }

  return null;
}

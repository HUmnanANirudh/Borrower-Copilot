'use client';

import React from 'react';
import { BorrowerProfile } from '@/lib/types';
import { PERSONA_PRIYA, PERSONA_RAVI, PERSONA_ANITA } from '@/lib/personas';
import { FlashIcon, UserIcon } from '@hugeicons/react';

interface PersonaBarProps {
  onSelectPersona: (persona: BorrowerProfile, name: string) => void;
  activePersona?: string;
}

export function PersonaBar({ onSelectPersona, activePersona }: PersonaBarProps) {
  return (
    <section className="w-full bg-[#fcfbf9] border-y border-[#dedcd9]/70 py-2.5 px-4">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-1.5 text-xs text-[#5d5b59] font-medium">
          <FlashIcon className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span className="font-semibold text-[#171717]">Evaluator One-Click Presets:</span>
          <span className="hidden md:inline">Test divergent rule behaviors:</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => onSelectPersona(PERSONA_PRIYA, 'Priya')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer border ${
              activePersona === 'Priya'
                ? 'bg-[#5769e7] text-white border-[#5769e7] shadow-sm'
                : 'bg-white text-[#171717] border-[#dedcd9] hover:bg-[#f2f1f0]'
            }`}
          >
            <UserIcon className="w-3 h-3" />
            <span>Priya (Prime Salaried)</span>
          </button>

          <button
            onClick={() => onSelectPersona(PERSONA_RAVI, 'Ravi')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer border ${
              activePersona === 'Ravi'
                ? 'bg-[#5769e7] text-white border-[#5769e7] shadow-sm'
                : 'bg-white text-[#171717] border-[#dedcd9] hover:bg-[#f2f1f0]'
            }`}
          >
            <UserIcon className="w-3 h-3" />
            <span>Ravi (SME / LAP Redirect)</span>
          </button>

          <button
            onClick={() => onSelectPersona(PERSONA_ANITA, 'Anita')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer border ${
              activePersona === 'Anita'
                ? 'bg-[#5769e7] text-white border-[#5769e7] shadow-sm'
                : 'bg-white text-[#171717] border-[#dedcd9] hover:bg-[#f2f1f0]'
            }`}
          >
            <UserIcon className="w-3 h-3" />
            <span>Anita (Informal / Restructure)</span>
          </button>
        </div>
      </div>
    </section>
  );
}

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { Assessment, BorrowerProfile } from '@/lib/types';
import { ArrowRight01Icon } from '@/components/icons';

interface CopilotChatProps {
  assessment: Assessment;
  profile: BorrowerProfile;
}

export function CopilotChat({ assessment, profile }: CopilotChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const systemPrompt = `You are BorrowIQ, an expert AI negotiation coach for consumer loans. 
You are helping the user negotiate their loan based on this profile:
- Requested Amount: ${profile.requestedAmount}
- Income: ${profile.netMonthlyIncome}
- Assessment Verdict: ${assessment.verdict}
- Fair Rate Target: ${assessment.fairRateRange[0]}% - ${assessment.fairRateRange[1]}%
- Safe Max EMI: ${assessment.recommendedMaxEMI}

Answer the user's questions about how to talk to lenders, negotiate better rates, or understand their financial limits. Be concise, highly professional, and actionable. Do NOT use markdown headers, just clean text and bullet points.`;

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: {
      systemPrompt,
    },
  } as any) as any;

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50 print:hidden">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-[#171717] text-white px-5 py-3.5 rounded-full shadow-lg hover:bg-[#333333] transition-all font-semibold text-[14px]"
        >
          <span>Ask AI Copilot</span>
          <ArrowRight01Icon className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[360px] max-h-[500px] flex flex-col bg-white rounded-3xl shadow-2xl border border-[#ebeae8] z-50 overflow-hidden print:hidden">
      {/* Header */}
      <div className="bg-[#171717] text-white px-5 py-4 flex items-center justify-between">
        <span className="font-semibold text-[14px]">AI Negotiation Coach</span>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-[#a09f9d] hover:text-white transition-colors text-[12px] font-bold"
        >
          CLOSE
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#fcfbf9] min-h-[300px]">
        {messages?.length === 0 && (
          <div className="text-center text-[#747371] text-[13px] mt-10">
            Ask me how to negotiate with the branch manager or lower your rate.
          </div>
        )}
        {messages?.map((m: any) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-3 text-[13px] leading-relaxed ${
              m.role === 'user' 
                ? 'bg-[#5769e7] text-white rounded-br-sm' 
                : 'bg-white border border-[#ebeae8] text-[#171717] rounded-bl-sm shadow-sm'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-2xl p-3 text-[13px] bg-white border border-[#ebeae8] text-[#747371] rounded-bl-sm shadow-sm">
              Typing...
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-[#ebeae8] p-3 bg-white">
        <div className="relative">
          <input
            className="w-full bg-[#f7f6f4] border border-[#ebeae8] rounded-full pl-4 pr-10 py-2.5 text-[13px] text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#5769e7]/30"
            value={input}
            placeholder="Type your question..."
            onChange={handleInputChange}
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="absolute right-1.5 top-1.5 w-7 h-7 flex items-center justify-center bg-[#171717] text-white rounded-full disabled:opacity-50"
          >
            <ArrowRight01Icon className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </form>
    </div>
  );
}

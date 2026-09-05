import React from 'react';

const lenses = [
  {
    label: 'Eligibility',
    question: 'What could a lender offer?',
    answer: 'Based on FOIR limits and tenure caps — the maximum they can legally approve.',
  },
  {
    label: 'Affordability',
    question: 'What can you safely carry?',
    answer: 'After real living costs, existing EMIs, and a 10% emergency reserve.',
  },
  {
    label: 'Pricing',
    question: 'Is the rate fair?',
    answer: 'Fair rate bands for your profile, plus the all-in APR with fees and GST.',
  },
];

export function MethodologySection() {
  return (
    <section id="methodology" className="w-full bg-[#f3ede7]">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-16 py-14 lg:py-20">
        {/* Narrative quote */}
        <div className="text-center mb-10 lg:mb-14 max-w-[700px] mx-auto">
          <h2 className="font-display text-[36px] sm:text-[48px] lg:text-[64px] font-normal text-[#171717] leading-[0.9] mb-4">
            Three separate verdicts.
          </h2>
          <p className="text-[15px] text-[#5d5b59] leading-[1.5]">
            Most borrowers confuse what a lender <em>will</em> offer with what they can <em>safely</em> repay. BorrowIQ separates the two.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {lenses.map((lens) => (
            <div key={lens.label} className="bg-white rounded-2xl p-7 lg:p-8">
              <span className="text-[11px] uppercase font-semibold tracking-wider text-[#5d5b59] block mb-3">
                {lens.label}
              </span>
              <h3 className="text-[20px] font-semibold text-[#171717] leading-tight mb-2">
                {lens.question}
              </h3>
              <p className="text-[15px] text-[#5d5b59] leading-[1.5]">
                {lens.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

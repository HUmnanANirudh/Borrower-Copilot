'use client';

import React, { useState } from 'react';

const faqs = [
  {
    question: 'How is BorrowIQ different from loan brokers and bank aggregators?',
    answer:
      'Bank aggregators and brokers make money through commissions when you take bigger loans and longer tenures. BorrowIQ is an independent, conflict-free engine that calculates what you can safely afford without risking default or lifestyle compromise.',
  },
  {
    question: 'Will assessing my loan impact my CIBIL or credit score?',
    answer:
      'Zero impact. BorrowIQ performs no hard or soft bureau pulls. Everything runs statelessly in your browser based purely on numbers you self-report.',
  },
  {
    question: 'How is the safe borrowing ceiling calculated?',
    answer:
      'Lenders evaluate regulatory eligibility using up to 60% FOIR (debt-to-income). BorrowIQ recalculates your true cash-flow capacity after subtracting rent, actual living costs, existing EMIs, and an untouchable 10% emergency buffer reserve.',
  },
  {
    question: 'How does the Borrower Defense Card work?',
    answer:
      'After completing the assessment, you get a clean one-page summary with your target rate band, maximum safe EMI, fee thresholds, and exact counter-arguments to use during branch negotiations.',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="w-full bg-white py-16 lg:py-28 border-t border-[#ebeae8]">
      <div className="max-w-[900px] mx-auto px-5 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="font-display text-[40px] sm:text-[54px] lg:text-[72px] font-normal text-[#171717] leading-[0.88] tracking-tight uppercase">
            FREQUENTLY ASKED QUESTIONS
          </h2>
        </div>

        {/* Accordion List */}
        <div className="flex flex-col divide-y divide-[#ebeae8] border-y border-[#ebeae8]">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question} className="py-5 lg:py-6">
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between text-left gap-4 group cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-[20px] sm:text-[24px] text-[#171717] group-hover:text-[#5769e7] transition-colors leading-snug">
                    {faq.question}
                  </span>
                  <span className="w-8 h-8 rounded-full bg-[#f2f1f0] group-hover:bg-[#e0e7ff] text-[#171717] group-hover:text-[#5769e7] flex items-center justify-center shrink-0 text-[18px] font-semibold transition-all">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                {isOpen && (
                  <div className="mt-3.5 pr-10">
                    <p className="text-[15px] sm:text-[16px] text-[#5d5b59] leading-[1.6]">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

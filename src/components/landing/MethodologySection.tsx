import React from 'react';

const pillars = [
  {
    title: 'Eligibility',
    subtitle: 'Could a lender plausibly offer this?',
    description: 'Lenders evaluate regulatory eligibility using 50%–60% FOIR and 60-month tenures to calculate the maximum loan they can legally approve.',
    tag: 'Lender Perspective',
  },
  {
    title: 'Affordability',
    subtitle: 'Can you safely carry it?',
    description: 'Borrower Copilot calculates your safe cash-flow ceiling after subtracting actual living costs, existing EMIs, and an untouchable 10% emergency reserve.',
    tag: 'Borrower Safety',
  },
  {
    title: 'Pricing',
    subtitle: 'Is the quote fair for your profile?',
    description: 'We calculate fair interest rate bands based on credit tiers and vintage, and compute the estimated all-in APR including processing fees and 18% GST.',
    tag: 'Market Fairness',
  },
];

export function MethodologySection() {
  return (
    <section id="methodology" className="w-full bg-white">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16 py-16 lg:py-24">
        {/* Section heading */}
        <div className="text-center max-w-[800px] mx-auto mb-12 lg:mb-16">
          <h2 className="font-display text-[48px] sm:text-[64px] lg:text-[88px] font-normal text-[#171717] leading-[0.85] tracking-normal">
            Three things we strictly separate.
          </h2>
          <p className="text-[16px] text-[#5d5b59] mt-4 max-w-[520px] mx-auto leading-[1.55]">
            Most borrowers confuse being eligible for a loan with being able to afford it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="bg-[#f7f6f4] rounded-[16px] p-8 lg:p-10 flex flex-col"
            >
              <span className="text-[12px] uppercase font-semibold tracking-wider text-[#5d5b59] mb-6">
                {pillar.tag}
              </span>
              <h3 className="font-display text-[32px] lg:text-[40px] text-[#171717] leading-[1] tracking-tight mb-2">
                {pillar.title}
              </h3>
              <p className="text-[16px] font-semibold text-[#5769e7] mb-4">
                {pillar.subtitle}
              </p>
              <p className="text-[16px] text-[#5d5b59] leading-[1.55]">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

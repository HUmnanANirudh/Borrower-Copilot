import React from 'react';

export function MethodologySection() {
  const pillars = [
    {
      title: 'Eligibility',
      subtitle: 'Could a lender plausibly offer this?',
      description: 'Lenders evaluate regulatory eligibility using 50%–60% FOIR and 60-month tenures to calculate the maximum loan amount they can legally approve.',
      tag: 'Lender Perspective'
    },
    {
      title: 'Affordability',
      subtitle: 'Can you safely carry it?',
      description: 'Borrower Copilot calculates your safe cash-flow ceiling after subtracting actual living costs, existing EMIs, and an untouchable 10% emergency reserve.',
      tag: 'Borrower Safety'
    },
    {
      title: 'Pricing',
      subtitle: 'Is the quote fair for your profile?',
      description: 'We calculate fair interest rate bands based on credit tiers and vintage, and compute the estimated all-in APR including processing fees and 18% GST.',
      tag: 'Market Fairness'
    }
  ];

  return (
    <section id="methodology" className="w-full py-20 lg:py-32 px-6 lg:px-16 bg-white border-y border-[#ebeae8]">
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#5769e7] mb-4 block">
            Our Methodology
          </span>
          <h2 className="font-display text-[44px] sm:text-[52px] lg:text-[64px] font-medium text-[#101010] tracking-[-0.03em] leading-[0.9]">
            Three things we strictly separate
          </h2>
          <p className="text-[18px] text-[#5d5b59] mt-6">
            Most borrowers confuse being eligible for a loan with being able to afford it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => (
            <div 
              key={idx}
              className="bg-[#f7f6f4] p-10 lg:p-12 rounded-[24px] flex flex-col justify-between"
            >
              <div>
                <span className="text-[12px] uppercase font-bold tracking-wider px-4 py-1.5 rounded-full bg-[#f2f1f0] text-[#5d5b59] inline-block mb-8 border border-[#dedcd9]">
                  {pillar.tag}
                </span>
                <h3 className="font-display text-[32px] lg:text-[40px] text-[#101010] tracking-tight mb-2 leading-[1.05]">
                  {pillar.title}
                </h3>
                <h4 className="text-[18px] font-semibold text-[#5769e7] mb-6">
                  {pillar.subtitle}
                </h4>
                <p className="text-[16px] text-[#5d5b59] leading-[1.5]">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

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
    <section id="methodology" className="w-full py-20 px-4 sm:px-6 bg-[#fcfbf9] border-b border-[#dedcd9]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase font-extrabold tracking-wider text-[#5769e7] mb-2 block">
            Our Methodology
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#171717] tracking-tight">
            Three things we strictly separate
          </h2>
          <p className="text-sm text-[#5d5b59] mt-2">
            Most borrowers confuse being eligible for a loan with being able to afford it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => (
            <div 
              key={idx}
              className="bg-white p-7 rounded-3xl border border-[#dedcd9] menti-card-shadow flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#f2f1f0] text-[#5d5b59] inline-block mb-4">
                  {pillar.tag}
                </span>
                <h3 className="text-2xl font-black text-[#171717] tracking-tight">
                  {pillar.title}
                </h3>
                <h4 className="text-xs font-bold text-[#5769e7] mt-1 mb-3">
                  {pillar.subtitle}
                </h4>
                <p className="text-xs text-[#5d5b59] leading-relaxed">
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
